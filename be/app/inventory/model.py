from typing import Optional, Literal, Union

from pydantic import BaseModel

from app.models.room.model import Room, RoomPublic
from app.models.chest.model import Chest, ChestPublic
from app.models.pocket.model import Pocket, PocketPublic
from app.models.item.model import Item, ItemPublic

###############
## Inventory ##
###############


class InventoryInput(BaseModel):
    scan: str


class InventoryLocating(BaseModel):
    room: Optional[RoomPublic]
    chest: Optional[ChestPublic]
    pocket: Optional[PocketPublic]


class InventoryContents(BaseModel):
    items: list[ItemPublic]


class InventoryResponse(BaseModel):
    entry_type: Literal["Item", "Pocket", "Chest", "Room"]
    locating: InventoryLocating
    contents: InventoryContents
    data: Union[Item, Pocket, Chest, Room]
