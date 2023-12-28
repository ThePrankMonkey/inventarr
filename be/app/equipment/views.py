import logging
from bson import json_util
import json

from fastapi import APIRouter, Body
from .models import Equipment
from .crud import add_equipment, find_equipment

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/equipment")


@router.post("/")
async def create_item(equipment: Equipment = Body(...)) -> Equipment:
    logger.info("Trying to add some equipment")
    response = await add_equipment(equipment)
    logger.info(response)
    return response


@router.get("/{equipment_id}")
async def get_item(equipment_id: str) -> Equipment:
    logger.info("Trying to find some equipment")
    response = await find_equipment(equipment_id)
    logger.info(response)
    return response
