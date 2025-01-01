import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlmodel import select

from app.db import SessionDep
from app.helpers.label_maker import make_label
from app.models.pocket.model import (
    Pocket,
    PocketPublic,
    PocketPublicFull,
    PocketCreate,
    PocketUpdate,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/pockets")


@router.post("", response_model=PocketPublic, status_code=status.HTTP_201_CREATED)
def create_pocket(pocket: PocketCreate, session: SessionDep):
    logger.debug("Request to POST Pocket with {pocket}")
    db_pocket = Pocket.model_validate(pocket)
    session.add(db_pocket)
    session.commit()
    session.refresh(db_pocket)
    return db_pocket


@router.get("", response_model=list[PocketPublic])
def get_pockets(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug("Request to GET Pockets")
    Pockets = session.exec(select(Pocket).offset(offset).limit(limit)).all()
    return Pockets


@router.get("/{pocket_id}")
def get_pocket(pocket_id: int, session: SessionDep):
    logger.debug("Request to GET Pocket {pocket_id}")
    pocket = session.get(Pocket, pocket_id)
    if not pocket:
        raise HTTPException(status_code=404, detail="Pocket not found")
    logger.info(f"Pocket {pocket_id}: {Pocket}")
    return pocket


@router.get("/{pocket_id}/full", response_model=PocketPublicFull)
def get_pocket_full(pocket_id: int, session: SessionDep):
    logger.debug("Request to GET Pocket {pocket_id}")
    pocket = session.get(Pocket, pocket_id)
    if not pocket:
        raise HTTPException(status_code=404, detail="Pocket not found")
    logger.debug(f"Items: {pocket.items}")
    logger.info(f"Pocket {pocket_id}: {Pocket}")
    return pocket


@router.get("/{pocket_id}/label")
def get_pocket_label(
    pocket_id: int,
    session: SessionDep,
):
    logger.debug(f"Request to GET Label for Pocket {pocket_id}")
    pocket = session.get(Pocket, pocket_id)
    if not pocket:
        raise HTTPException(status_code=404, detail="Pocket not found")
    # TODO: Account for too wide label
    if pocket.label_width == 0 or pocket.label_height == 0:
        raise HTTPException(status_code=500, detail="Pocket label size invalid")
    label_path = make_label(
        entry_type="pocket",
        entry_id=pocket.id,
        width=pocket.label_width,
        height=pocket.label_height,
        message=pocket.location,
    )
    return FileResponse(label_path, media_type="image/png")


@router.patch("/{pocket_id}", response_model=PocketPublic)
def update_pocket(pocket_id: int, pocket: PocketPublic, session: SessionDep):
    print(f"Request to PATCH Pocket {pocket_id} with {pocket}")
    db_pocket = session.get(Pocket, pocket_id)
    if not db_pocket:
        raise HTTPException(status_code=404, detail="Pocket not found")
    pocket_data = Pocket.model_dump(exclude_unset=True)
    db_pocket.sqlmodel_update(pocket_data)
    session.add(db_pocket)
    session.commit()
    session.refresh(db_pocket)
    return db_pocket


@router.delete("/{pocket_id}")
def delete_pocket(pocket_id: int, session: SessionDep):
    logger.debug(f"Request to DELETE Pocket {pocket_id}")
    db_pocket = session.get(Pocket, pocket_id)
    if not db_pocket:
        raise HTTPException(status_code=404, detail="Pocket not found")
    if db_pocket.items:
        raise HTTPException(status_code=400, detail="Pocket not empty")
    session.delete(db_pocket)
    session.commit()
    return {"message": f"Pocket {pocket_id} was deleted."}
