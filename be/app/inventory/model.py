from pydantic import BaseModel


###############
## Inventory ##
###############


class InventoryScan(BaseModel):
    scan: str
