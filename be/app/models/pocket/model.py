from sqlmodel import SQLModel, Field, Relationship

from app.models.chest.model import Chest, ChestPublic
from app.models.room.model import Room, RoomPublic
from app.config import settings

############
## Pocket ##
############


class PocketBase(SQLModel):
    name: str = Field(index=True)
    location: str = Field()
    label_width: float = Field(
        default=0,
        ge=settings.printer_min_label_width_inches,
        le=settings.printer_max_label_width_inches,
    )  # in_inches
    label_height: float = Field(
        default=0,
        ge=settings.printer_min_label_height_inches,
        le=settings.printer_max_label_height_inches,
    )  # in_inches
    chest_id: int = Field(foreign_key="chest.id")
    room_id: int = Field(foreign_key="room.id")


class Pocket(PocketBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    items: list["Item"] = Relationship(back_populates="pocket")
    chest: Chest | None = Relationship(back_populates="pockets")
    room: Room | None = Relationship(back_populates="pockets")


class PocketPublic(PocketBase):
    id: int


class PocketPublicFull(PocketPublic):
    room: RoomPublic
    chest: ChestPublic
    items: list


class PocketCreate(PocketBase):
    pass


class PocketUpdate(PocketBase):
    name: str | None = None
    location: str | None = None
    chest_id: int | None = None


class PocketScan(PocketPublicFull):
    entry_type: str = "Pocket"
