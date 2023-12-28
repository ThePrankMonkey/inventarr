import logging
from bson import ObjectId

from fastapi import HTTPException, status
from app.db import client
from app.equipment.models import Equipment


logger = logging.getLogger(__name__)
db = client.get_database("v1")
equipment_collection = db.get_collection("equipment")


async def add_equipment(equipment: Equipment):
    new_equipment = await equipment_collection.insert_one(
        equipment.model_dump(by_alias=True, exclude=["id"])
    )
    created_equipment = await equipment_collection.find_one(
        {"_id": new_equipment.inserted_id}
    )
    return created_equipment


async def find_equipment(equipment_id: str):
    logger.info(f"Looking up equipment id {equipment_id}")
    try:
        found_equipment = await equipment_collection.find_one(
            {"_id": ObjectId(equipment_id)}
        )
        logger.info(found_equipment)
        return found_equipment
    except Exception:
        logger.info("Issue")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Equipment with ID {equipment_id} not found",
        )
