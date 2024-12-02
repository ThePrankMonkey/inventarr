from sqlmodel import SQLModel, Field


############
## Chests ##
############

class ChestBase(SQLModel):
    name: str = Field(index=True)
    room_id: int = Field(foreign_key="room.id")


class Chest(ChestBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ChestPublic(ChestBase):
    id: int


class ChestCreate(ChestBase):
    pass


class ChestUpdate(ChestBase):
    name: str | None = None
    room_id: int | None = None