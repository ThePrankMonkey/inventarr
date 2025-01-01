from sqlmodel import SQLModel, Field, Relationship
from app.models.room.model import Room


############
## Chests ##
############


class ChestBase(SQLModel):
    name: str = Field(index=True)
    label_width: float = Field(default=0)  # in_inches
    label_height: float = Field(default=0)  # in_inches
    room_id: int = Field(foreign_key="room.id")


class Chest(ChestBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    items: list["Item"] = Relationship(back_populates="chest")
    pockets: list["Pocket"] = Relationship(back_populates="chest")
    room: Room | None = Relationship(back_populates="chests")


class ChestPublic(ChestBase):
    id: int


class ChestCreate(ChestBase):
    pass


class ChestUpdate(ChestBase):
    name: str | None = None
    room_id: int | None = None


class ChestScan(ChestPublic):
    entry_type: str = "Chest"
