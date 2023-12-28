import logging

from fastapi import FastAPI

from app.equipment.views import router as equipment_router

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)
app = FastAPI()
app.include_router(router=equipment_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/test")
async def test():
    return {"message": "TEST"}
