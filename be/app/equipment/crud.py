import logging
from bson import ObjectId

from fastapi import HTTPException, status
from fastapi.responses import Response
from pymongo import ReturnDocument
from app.db import client
from app.equipment.models import Equipment


logger = logging.getLogger(__name__)
db = client.get_database("v1")
equipment_collection = db.get_collection("equipment")


async def create_equipment(equipment: Equipment):
    """
    Create an equipment record
    """
    new_equipment = await equipment_collection.insert_one(
        equipment.model_dump(by_alias=True, exclude=["id"])
    )
    created_equipment = await equipment_collection.find_one(
        {"_id": new_equipment.inserted_id}
    )
    return created_equipment


async def retrieve_equipment(equipment_id: str):
    """
    Retrieve an equipment record
    """
    logger.info(f"Looking up equipment id {equipment_id}")
    found_equipment = await equipment_collection.find_one(
        {"_id": ObjectId(equipment_id)}
    )
    if found_equipment:
        logger.info(found_equipment)
        return found_equipment
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Equipment with ID {equipment_id} not found",
    )


async def update_equipment(equipment_id: str, equipment: Equipment):
    """
    Update an equipment record
    """
    logger.info(f"Updating equipment {equipment}")
    try:
        equipment_updates = {
            k: v
            for k, v in equipment.model_dump(by_alias=True).items()
            if v is not None
        }
        if len(equipment_updates) >= 1:
            updated_equipment = await equipment_collection.find_one_and_update(
                {"_id": ObjectId(equipment_id)},
                {"$set": equipment_updates},
                return_document=ReturnDocument.AFTER,
            )
            logger.info(f"Update results = {updated_equipment}")
            if updated_equipment is not None:
                return updated_equipment
            else:
                raise HTTPException(
                    status_code=404,
                    detail=f"Equipment {equipment_id} not found",
                )
    except Exception as err:
        logger.error("Issue")
        logger.exception(err)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Equipment with ID {equipment_id} not found",
        )


async def delete_equipment(equipment_id: str):
    """
    Delete an equipment record
    """
    logger.info(f"Deleting equipment {equipment_id}")
    equipment_delete = await equipment_collection.delete_one(
        {"_id": ObjectId(equipment_id)}
    )

    if equipment_delete.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(
        status_code=404,
        detail=f"Equipment with ID {equipment_id} not found",
    )
