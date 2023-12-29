import logging
from bson import json_util
import json

from fastapi import APIRouter, Body
from .models import Equipment
from .crud import (
    create_equipment,
    retrieve_equipment,
    update_equipment,
    delete_equipment,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/equipment")


@router.post("/")
async def create_item(equipment: Equipment = Body(...)) -> Equipment:
    logger.info("Trying to add some equipment")
    response = await create_equipment(equipment)
    logger.info(response)
    return response


@router.get("/{equipment_id}")
async def get_item(equipment_id: str) -> Equipment:
    logger.info("Trying to find some equipment")
    response = await retrieve_equipment(equipment_id)
    logger.info(response)
    return response


@router.put("/{equipment_id}")
async def update_item(equipment_id: str, equipment: Equipment = Body(...)) -> Equipment:
    logger.info("Trying to update some equipment")
    response = await update_equipment(equipment_id, equipment)
    logger.info(response)
    return response


@router.delete("/{equipment_id}")
async def delete_item(equipment_id: str):
    logger.info("Trying to delete some equipment")
    response = await delete_equipment(equipment_id)
    logger.info(response)
    return response
