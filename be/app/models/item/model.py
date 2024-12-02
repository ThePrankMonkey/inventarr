from sqlmodel import SQLModel, Field, Relationship
from app.models.pocket.model import (Pocket, PocketPublic)
from app.models.chest.model import (Chest, ChestPublic)
from app.models.room.model import (Room, RoomPublic)

###########
## Items ##
###########

class ItemBase(SQLModel):
    name: str = Field(index=True)
    quantity: int = Field()
    pocket_id: int = Field(foreign_key="pocket.id")
    chest_id: int = Field(foreign_key="chest.id")
    room_id: int = Field(foreign_key="room.id")
    upc: str | None = Field(default=None)
    notes: str | None = Field(default=None)


class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    pocket: Pocket = Relationship(back_populates="items")
    chest: Chest = Relationship(back_populates="items")
    room: Room = Relationship(back_populates="items")


class ItemPublic(ItemBase):
    id: int


class ItemPublicFull(ItemPublic):
    id: int
    room: RoomPublic
    chest: ChestPublic
    pocket: PocketPublic


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    name: str | None = None
    quantity: int | None = None
    pocket_id: int | None = None
    upc: str | None = None
    notes: str | None = None
