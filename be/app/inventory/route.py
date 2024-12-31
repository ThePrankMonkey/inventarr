import json
import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlmodel import select

from app.db import SessionDep
from app.inventory.model import InventoryScan
from app.models.chest.model import Chest
from app.models.pocket.model import Pocket

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/inventory")


@router.post("")
def check_inventory(scan: InventoryScan, session: SessionDep):
    logger.debug(f"Request to POST check inventory with {scan}")
    print(scan)
    data = json.loads(scan.scan)
    entry_type = data["type"]
    entry_id = data["id"]
    match entry_type:
        case "pocket":
            model_type = Pocket
        case "chest":
            model_type = Chest
        case _:
            raise HTTPException(
                status_code=400, detail=f"Entry Type [{entry_type}] not permitted"
            )
    entry = session.get(model_type, entry_id)
    if not entry:
        raise HTTPException(
            status_code=404, detail=f"{entry_type} {entry_id} not found"
        )
    # # convert entry to dict to add entry_type
    entry = entry.__dict__
    entry["entry_type"] = entry_type
    logger.info(f"Entry Type {entry_type} {entry_id}: {entry}")
    return entry
