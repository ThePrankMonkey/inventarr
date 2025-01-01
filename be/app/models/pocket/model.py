from sqlmodel import SQLModel, Field, Relationship

# from app.models.item.model import ItemPublic
from app.models.chest.model import Chest, ChestPublic
from app.models.room.model import Room, RoomPublic

############
## Pocket ##
############


class PocketBase(SQLModel):
    name: str = Field(index=True)
    location: str = Field()
    label_width: float = Field(default=0)  # in_inches
    label_height: float = Field(default=0)  # in_inches
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
    # items: List[ItemPublic]
    # items: list["ItemPublic"]


class PocketCreate(PocketBase):
    pass


class PocketUpdate(PocketBase):
    name: str | None = None
    location: str | None = None
    chest_id: int | None = None


class PocketScan(PocketPublic):
    entry_type: str = "Pocket"
    # items: list
