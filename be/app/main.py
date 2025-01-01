from contextlib import asynccontextmanager
import json
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import create_db_and_tables
from app.helpers.load_test_data import reset_db
from app.inventory.route import router as inventory_router
from app.models.room.route import router as room_router
from app.models.chest.route import router as chest_router
from app.models.pocket.route import router as pocket_router
from app.models.item.route import router as item_router

logging.basicConfig(level=logging.INFO)
# logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    lifespan=lifespan,
    title=settings.app_name,
    openapi_tags=[
        {
            "name": "experimental",
            "description": "Experimental endpoints subject to change.",
        }
    ],
)
app.include_router(room_router)
app.include_router(chest_router)
app.include_router(pocket_router)
app.include_router(item_router)
app.include_router(inventory_router)

# Support CORs
origins = [
    "*",
    # "http://localhost",
    # "http://localhost:3000",
    # "http://frontend:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World", "From": settings.app_name}


def check_dev_mode():
    """
    Raises an HTTPException if not in development mode.

    Raises:
        HTTPException: 400 Bad Request if not in development mode.
    """
    if settings.stage != "dev":
        raise HTTPException(
            status_code=403, detail="Endpoint available only in development mode."
        )


@app.get("/reset_db", dependencies=[Depends(check_dev_mode)])
def database_reset():
    reset_db(with_test_data=True)
    return "Database Reset"
