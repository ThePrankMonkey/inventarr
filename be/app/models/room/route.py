import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from app.db import SessionDep
from app.models.room.model import (
    Room,
    RoomPublic,
    RoomCreate,
    RoomUpdate,
)
from app.models.chest.model import Chest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/rooms")


@router.post("", response_model=RoomPublic)
def create_room(room: RoomCreate, session: SessionDep):
    logger.debug("Request to POST Room with {room}")
    db_room = Room.model_validate(room)
    session.add(db_room)
    session.commit()
    session.refresh(db_room)
    return db_room


@router.get("", response_model=list[RoomPublic])
def get_rooms(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug("Request to GET Rooms")
    rooms = session.exec(select(Room).offset(offset).limit(limit)).all()
    return rooms


@router.get("/{room_id}")
def get_room(room_id: int, session: SessionDep):
    logger.debug(f"Request to GET Room {room_id}")
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    logger.info(f"Room {room_id}: {room}")
    return room


@router.get("/{room_id}/chests")
def get_room_chests(
    room_id: int,
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug(f"Request to GET Chests located in Room {room_id}")
    chests = session.exec(
        select(Chest).where(Chest.room_id == room_id).offset(offset).limit(limit)
    ).all()
    return chests


@router.patch("/{room_id}", response_model=RoomPublic)
def update_room(room_id: int, room: RoomPublic, session: SessionDep):
    logger.debug(f"Request to PATCH Room {room_id} with {room}")
    db_room = session.get(Room, room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    room_data = Room.model_dump(exclude_unset=True)
    db_room.sqlmodel_update(room_data)
    session.add(db_room)
    session.commit()
    session.refresh(db_room)
    return db_room
