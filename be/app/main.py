import json
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import create_db_and_tables
from .load_test_data import create_demo_data
from .models.room.route import router as room_router
from .models.chest.route import router as chest_router
from .models.pocket.route import router as pocket_router
from .models.item.route import router as item_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.include_router(room_router)
app.include_router(chest_router)
app.include_router(pocket_router)
app.include_router(item_router)

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

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # create_demo_data()


@app.get("/")
def read_root():
    return {
        "Hello": "World",
        "From": "Inventarr"
        }