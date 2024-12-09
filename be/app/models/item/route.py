import logging
import os
import shutil
from typing import Annotated, List
import uuid

from fastapi import APIRouter, HTTPException, Query, File, UploadFile
from fastapi.responses import FileResponse
from sqlmodel import select

from app.config import settings
from app.db import SessionDep
from app.models.item.model import (
    item_types,
    Item,
    ItemPublic,
    ItemPublicFull,
    ItemCreate,
    ItemUpdate,
)
from app.models.room.model import Room
from app.models.chest.model import Chest
from app.models.pocket.model import Pocket

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/items")


@router.post("", response_model=ItemPublic)
def create_item(item: ItemCreate, session: SessionDep):
    logger.debug("Request to POST item with {item}")
    db_item = Item.model_validate(item)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.post("/photo")
def upload_photo(file: UploadFile = File(...)):
    photo_name = f"{uuid.uuid4()}.png"
    photo_path = os.path.join(settings.storage_path, photo_name)
    try:
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"image_file": photo_path}
    except Exception as err:
        raise HTTPException(status_code=500, detail="Unable to save image to disk.")


@router.get("", response_model=list[ItemPublic])
def get_items(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug("Request to GET items")
    items = session.exec(select(Item).offset(offset).limit(limit)).all()
    return items


@router.get("/full", response_model=list[ItemPublicFull])
def get_items_full(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    logger.debug("Request to GET items")
    items = session.exec(select(Item).offset(offset).limit(limit)).all()
    return items


@router.get("/types", response_model=List[str])
def get_item_types():
    logger.debug("Request to GET item types")
    return item_types


@router.get("/{item_id}")
def get_item(item_id: int, session: SessionDep):
    logger.debug(f"Request to GET Item {item_id}")
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info(f"Item {item_id}: {item}")
    logger.info(item_types)
    return item


@router.get("/{item_id}/full", response_model=ItemPublicFull)
def get_item_full(item_id: int, session: SessionDep):
    logger.debug(f"Request to GET Item {item_id}")
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info(f"Item {item_id}: {item}")
    return item


@router.get("/{item_id}/photo")
def get_item_photo(item_id: int, session: SessionDep):
    logger.debug(f"Request to GET photo for Item {item_id}")
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not item.image_file:
        raise HTTPException(status_code=404, detail="Item Image not found")
    return FileResponse(item.image_file, media_type="image/jpeg")


@router.patch("/{item_id}", response_model=ItemPublic)
def update_item(item_id: int, item: ItemUpdate, session: SessionDep):
    logger.debug(f"Request to PATCH Item {item_id} with {item}")
    db_item = session.get(Item, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    item_data = item.model_dump(exclude_unset=True)
    db_item.sqlmodel_update(item_data)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
def delete_item(item_id: int, session: SessionDep):
    logger.debug(f"Request to DELETE Item {item_id}")
    db_item = session.get(Item, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    session.delete(db_item)
    session.commit()
    return {"message": f"Item {item_id} was deleted."}