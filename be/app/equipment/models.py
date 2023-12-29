from datetime import datetime
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field
from typing import Annotated, Optional

PyObjectId = Annotated[str, BeforeValidator(str)]


class Equipment(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    isbn: str = Field(...)
    name: str = Field(...)
    serial: str | None = Field(default=None)
    location: str | None = Field(default=None)
    notes: str | None = Field(default=None)
    loaned_to: str | None = Field(default=None)
    loaned_on: datetime | None = Field(default=None)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "hammer",
            }
        },
    )
