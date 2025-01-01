from typing import Optional, Literal, Union

from pydantic import BaseModel

from app.models.room.model import RoomPublic
from app.models.chest.model import ChestPublic
from app.models.pocket.model import PocketPublic
from app.models.item.model import ItemPublic, ItemPublicFull

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
    pockets: list[PocketPublic]


class InventoryResponse(BaseModel):
    entry_type: Literal["item", "pocket", "chest", "room"]
    locating: InventoryLocating
    contents: InventoryContents
    data: Union[ItemPublic, PocketPublic, ChestPublic, RoomPublic]
