from sqlmodel import SQLModel, Field


############
## Pocket ##
############

class PocketBase(SQLModel):
    name: str = Field(index=True)
    location: str = Field()
    chest_id: int = Field(foreign_key="chest.id")


class Pocket(PocketBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class PocketPublic(PocketBase):
    id: int


class PocketCreate(PocketBase):
    pass


class PocketUpdate(PocketBase):
    name: str | None = None
    location: str | None = None
    chest_id: int | None = None