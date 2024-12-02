from sqlmodel import SQLModel, Field


###########
## Rooms ##
###########

class RoomBase(SQLModel):
    name: str = Field(index=True)
    location: str


class Room(RoomBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class RoomPublic(RoomBase):
    id: int


class RoomCreate(RoomBase):
    pass


class RoomUpdate(RoomBase):
    name: str | None = None
    location: int | None = None