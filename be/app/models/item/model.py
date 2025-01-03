from enum import Enum
from pydantic import field_validator
from sqlmodel import SQLModel, Field, Relationship
from app.models.pocket.model import Pocket, PocketPublic
from app.models.chest.model import Chest, ChestPublic
from app.models.room.model import Room, RoomPublic


###########
## Items ##
###########

item_types = ["component", "ingredient", "tool", "equipment"]


class ItemBase(SQLModel):
    name: str = Field(index=True)
    item_type: str = Field(...)
    quantity: float = Field(...)
    unit: str = Field(...)
    pocket_id: int = Field(foreign_key="pocket.id")
    chest_id: int = Field(foreign_key="chest.id")
    room_id: int = Field(foreign_key="room.id")
    upc: str | None = Field(default=None)
    image_file: str | None = Field(default=None)
    thumb_file: str | None = Field(default=None)
    notes: str | None = Field(default=None)

    @field_validator("item_type")
    def validate_item_type(cls, v: str) -> str:
        if not v in item_types:
            raise ValueError(f"ItemType must be one of {item_types}")
        return v


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
    item_type: str | None = None
    quantity: int | None = None
    pocket_id: int | None = None
    chest_id: int | None = None
    room_id: int | None = None
    unit: str | None = None
    upc: str | None = None
    image_file: str | None = None
    thumb_file: str | None = None
    notes: str | None = None
