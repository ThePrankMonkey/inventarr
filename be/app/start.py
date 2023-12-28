import uvicorn

from main import app

def run():
    print("Running Dev Server")
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True, workers=2)
