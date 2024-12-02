from sqlmodel import SQLModel, Field


###########
## Items ##
###########

class ItemBase(SQLModel):
    name: str = Field(index=True)
    quantity: int = Field()
    pocket_id: int = Field(foreign_key="pocket.id")
    upc: str | None = Field(default=None)
    notes: str | None = Field(default=None)


class Item(ItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ItemPublic(ItemBase):
    id: int


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    name: str | None = None
    quantity: int | None = None
    pocket_id: int | None = None
    upc: str | None = None
    notes: str | None = None
