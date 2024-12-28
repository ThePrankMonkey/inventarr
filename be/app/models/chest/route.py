import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from sqlmodel import select

from app.db import SessionDep
from app.helpers.label_maker import make_label
from app.models.chest.model import (
    Chest,
    ChestPublic,
    ChestCreate,
    ChestUpdate,
)
from app.models.pocket.model import Pocket, PocketCreate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chests")


@router.post("", response_model=ChestPublic)
def create_chest(chest: ChestCreate, session: SessionDep):
    logger.debug("Request to POST chest with {chest}")
    db_chest = Chest.model_validate(chest)
    session.add(db_chest)
    session.commit()
    session.refresh(db_chest)
    return db_chest


@router.post("/{chest_id}/copy", response_model=ChestPublic)
def create_chest_copy(chest_id: int, chest: ChestCreate, session: SessionDep):
    logger.debug("Request to POST copy chest {chest_id} with {chest}")
    db_chest = Chest.model_validate(chest)
    session.add(db_chest)
    session.commit()
    session.refresh(db_chest)
    original_chest = session.get(Chest, chest_id)
    old_pockets = original_chest.pockets
    logger.debug(f"Found: {old_pockets}")
    for old_pocket in old_pockets:
        logger.debug(f"Duplicating pocket {old_pocket}")
        # copy old pocket to a new pocket
        new_pocket = PocketCreate.model_validate(old_pocket)
        db_pocket = Pocket.model_validate(new_pocket)
        logger.debug(f"New pocket {db_pocket}")
        # set the chest_id to the new chest
        db_pocket.chest_id = db_chest.id
        logger.debug(f"Adding duplicated pocket {db_pocket}")
        session.add(db_pocket)
    session.commit()
    session.refresh(db_chest)
    return db_chest


@router.get("", response_model=list[ChestPublic])
def get_chests(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug("Request to GET chests")
    chests = session.exec(select(Chest).offset(offset).limit(limit)).all()
    return chests


@router.get("/{chest_id}")
def get_chest(chest_id: int, session: SessionDep):
    logger.debug("Request to GET chest {chest_id}")
    chest = session.get(Chest, chest_id)
    if not chest:
        raise HTTPException(status_code=404, detail="Chest not found")
    logger.info(f"Chest {chest_id}: {chest}")
    return chest


@router.get("/{chest_id}/label")
def get_chest_label(
    chest_id: int,
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug(f"Request to GET Label for Chest {chest_id}")
    chest = session.get(Chest, chest_id)
    if not chest:
        raise HTTPException(status_code=404, detail="Chest not found")
    label = make_label(
        entry_type="chest",
        entry_id=chest.id,
        width=2.5,
        height=1.0,
        message="",
    )
    label_path = "/tmp/label.png"
    label.save(label_path)
    return FileResponse(label_path, media_type="image/png")


@router.get("/{chest_id}/pockets")
def get_chest_pockets(
    chest_id: int,
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug(f"Request to GET Pockets located in Chest {chest_id}")
    pockets = session.exec(
        select(Pocket).where(Pocket.chest_id == chest_id).offset(offset).limit(limit)
    ).all()
    return pockets


@router.patch("/{chest_id}", response_model=ChestPublic)
def update_chest(chest_id: int, chest: ChestPublic, session: SessionDep):
    print(f"Request to PATCH Chest {chest_id} with {chest}")
    db_chest = session.get(Chest, chest_id)
    if not db_chest:
        raise HTTPException(status_code=404, detail="Chest not found")
    chest_data = chest.model_dump(exclude_unset=True)
    db_chest.sqlmodel_update(chest_data)
    session.add(db_chest)
    session.commit()
    session.refresh(db_chest)
    return db_chest


@router.delete("/{chest_id}")
def delete_chest(chest_id: int, session: SessionDep):
    logger.debug(f"Request to DELETE Chest {chest_id}")
    db_chest = session.get(Chest, chest_id)
    if not db_chest:
        raise HTTPException(status_code=404, detail="Item not found")
    # TODO: Add checks/logic for pockets being deleted first
    session.delete(db_chest)
    session.commit()
    return {"message": f"Chest {chest_id} was deleted."}
