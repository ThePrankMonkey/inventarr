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
from app.models.room.model import Room
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
    except KeyError:
        raise HTTPException(
            status_code=400, detail="Missing required fields in scan string"
        )
    match entry_type:
        case "pocket":
            model_type = Pocket
        case "chest":
            model_type = Chest
        case _:
            raise HTTPException(
                status_code=400, detail=f"Entry Type [{entry_type}] not permitted"
            )
    db_entry = session.get(model_type, entry_id)
    print(db_entry.room)
    if not db_entry:
        raise HTTPException(
            status_code=404, detail=f"{entry_type} {entry_id} not found"
        )
    # Find locating information
    room = db_entry.room if "room_id" in db_entry.model_dump() else None
    chest = db_entry.chest if "chest_id" in db_entry.model_dump() else None
    pocket = db_entry.pocket if "pocket_id" in db_entry.model_dump() else None
    # Find content information5
    items = db_entry.items
    pockets = db_entry.pockets if entry_type == "chest" else []
    return InventoryResponse(
        entry_type=entry_type,
        locating=InventoryLocating(
            room=room,
            chest=chest,
            pocket=pocket,
        ),
        contents=InventoryContents(
            items=items,
            pockets=pockets,
        ),
        data=db_entry,
    )
