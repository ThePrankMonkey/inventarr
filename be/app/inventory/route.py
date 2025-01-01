import json
import logging
from typing import Annotated, Union

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlmodel import select

from app.db import SessionDep
from app.inventory.model import (
    InventoryInput,
    InventoryResponse,
    InventoryLocating,
    InventoryContents,
)
from app.models.chest.model import Chest, ChestScan
from app.models.pocket.model import Pocket, PocketScan

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inventory")


@router.post("", response_model=Union[ChestScan, PocketScan])
def check_inventory(scan: InventoryInput, session: SessionDep):
    logger.debug(f"Request to POST check inventory with {scan}")
    try:
        data = json.loads(scan.scan)
        entry_type = data["type"]
        entry_id = data["id"]
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON data")
    match entry_type:
        case "pocket":
            model_type = Pocket
            model_scan = PocketScan
        case "chest":
            model_type = Chest
            model_scan = ChestScan
        case _:
            raise HTTPException(
                status_code=400, detail=f"Entry Type [{entry_type}] not permitted"
            )
    db_entry = session.get(model_type, entry_id)
    if not db_entry:
        raise HTTPException(
            status_code=404, detail=f"{entry_type} {entry_id} not found"
        )
    logger.info(db_entry.items)
    return db_entry


@router.post("/v2", response_model=InventoryResponse, tags=["experimental"])
def check_inventory_v2(scan: InventoryInput, session: SessionDep):
    logger.debug(f"Request to POST check inventory with {scan}")
    try:
        data = json.loads(scan.scan)
        entry_type = data["type"]
        entry_id = data["id"]
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON data")
