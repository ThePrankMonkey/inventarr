import logging
from bson import ObjectId

from fastapi import HTTPException, status
from fastapi.responses import Response
from pymongo import ReturnDocument
from app.db import client
from app.equipment.models import Equipment
from app.helpers.crud_helpers import create, retrieve, update, delete

logger = logging.getLogger(__name__)
db = client.get_database("v1")
equipment_collection = db.get_collection("equipment")


async def create_equipment(equipment: Equipment):
    """
    Create an equipment record
    """
    logger.info(f"Creating equipment {equipment} entry")
    created_equipment = await create(
        collection=equipment_collection,
        item=equipment,
    )
    return created_equipment


async def retrieve_equipment(equipment_id: str):
    """
    Retrieve an equipment record
    """
    logger.info(f"Looking up equipment id {equipment_id}")
    found_equipment = await retrieve(
        collection=equipment_collection,
        item_id=equipment_id,
    )
    return found_equipment


async def update_equipment(equipment_id: str, equipment: Equipment):
    """
    Update an equipment record
    """
    logger.info(f"Updating equipment {equipment}")
    updated_equipment = await update(
        collection=equipment_collection,
        item_id=equipment_id,
        item=equipment,
    )
    return updated_equipment


async def delete_equipment(equipment_id: str):
    """
    Delete an equipment record
    """
    logger.info(f"Deleting equipment {equipment_id}")
    equipment_delete = await delete(
        collection=equipment_collection,
        item_id=equipment_id,
    )
    return equipment_delete
