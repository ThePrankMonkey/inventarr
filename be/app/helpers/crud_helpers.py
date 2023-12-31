import logging
from bson import ObjectId

from fastapi import HTTPException, status
from fastapi.responses import Response
from pymongo import ReturnDocument
from pymongo.collection import Collection
from typing import Any

logger = logging.getLogger(__name__)


async def create(collection: Collection, item: Any):
    """
    Add an item to a collection
    """
    new_item = await collection.insert_one(
        item.model_dump(by_alias=True, exclude=["id"])
    )
    created_item = await collection.find_one({"_id": new_item.inserted_id})
    return created_item


async def retrieve(collection: Collection, item_id: str):
    """
    Lookup an item in a collection
    """
    found_item = await collection.find_one({"_id": ObjectId(item_id)})
    if found_item:
        logger.info(found_item)
        return found_item
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Item with ID {item_id} not found",
    )


async def update(collection: Collection, item_id: str, item: Any):
    """
    Update an item record in a collection
    """
    try:
        item_updates = {
            k: v for k, v in item.model_dump(by_alias=True).items() if v is not None
        }
        if len(item_updates) >= 1:
            updated_item = await collection.find_one_and_update(
                {"_id": ObjectId(item_id)},
                {"$set": item_updates},
                return_document=ReturnDocument.AFTER,
            )
            logger.info(f"Update results = {updated_item}")
            if updated_item is not None:
                return updated_item
            else:
                raise HTTPException(
                    status_code=404,
                    detail=f"Item {item_id} not found",
                )
    except Exception as err:
        logger.error("Issue")
        logger.exception(err)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found",
        )


async def delete(collection: Collection, item_id: str):
    """
    Delete an item record from a collection
    """
    item_delete = await collection.delete_one({"_id": ObjectId(item_id)})
    if item_delete.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(
        status_code=404,
        detail=f"Item with ID {item_id} not found",
    )
