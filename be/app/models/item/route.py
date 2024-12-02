import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from app.db import SessionDep
from app.models.item.model import (
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


@router.get("/{item_id}")
def get_item(item_id: int, session: SessionDep):
    logger.debug(f"Request to GET Item {item_id}")
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info(f"Item {item_id}: {item}")
    return item


@router.get("/{item_id}/full", response_model=ItemPublicFull)
def get_item_full(item_id: int, session: SessionDep):
    logger.debug(f"Request to GET Item {item_id}")
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info(f"Item {item_id}: {item}")
    return item


@router.patch("/{item_id}", response_model=ItemPublic)
def update_item(item_id: int, Item: ItemPublic, session: SessionDep):
    logger.debug(f"Request to PATCH Item {item_id} with {Item}")
    db_item = session.get(Item, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    item_data = Item.model_dump(exclude_unset=True)
    db_item.sqlmodel_update(item_data)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item
