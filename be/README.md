# Notes for Inventarr Backend

## Play with API

### Fill in test data

```bash
http POST http://127.0.0.1:5123/rooms name=Office location="Office Room"
http POST http://127.0.0.1:5123/rooms name=Kitchen location="Kitchen Room"

http POST http://127.0.0.1:5123/chests name="Component 1" room_id=1
http POST http://127.0.0.1:5123/chests name="Pantry" room_id=2


http POST http://127.0.0.1:5123/pockets name="Drawer A1" location="A1" room_id=1 chest_id=1
http POST http://127.0.0.1:5123/pockets name="Shelf 1" location="Shelf 1" room_id=2 chest_id=2


http POST http://127.0.0.1:5123/items name="WaveShare 2.7in EPaper Display" item_type="component" room_id=1 chest_id=1 pocket_id=1 quantity=1
http POST http://127.0.0.1:5123/items name="All Purpose Flour" item_type="ingredient" room_id=2 chest_id=2 pocket_id=2 quantity=2
```

### Check the test data

```bash
http GET http://127.0.0.1:5123/rooms/1/chests
http GET http://127.0.0.1:5123/rooms
http GET http://127.0.0.1:5123/chests
http GET http://127.0.0.1:5123/pockets
http GET http://127.0.0.1:5123/pockets/1/full
http GET http://127.0.0.1:5123/items
```

### Delete Items

http GET http://127.0.0.1:5123/items
http DELETE http://127.0.0.1:5123/items/3
http GET http://127.0.0.1:5123/chests
http DELETE http://127.0.0.1:5123/chests/3

### Duplicate Chest

http POST http://127.0.0.1:5123/chests/1/copy name="Component 2" room_id=1

### Perform Inventory Scan

http POST http://127.0.0.1:5123/inventory scan='{"type": "pocket", "id": 4}'
http POST http://127.0.0.1:5123/inventory scan="{\"type\": \"pocket\", \"id\": 4}"

## Notices

Fonts from: https://www.gnu.org/software/freefont/

## Issues

### How to do a migration with SQLModel?

Found a [lovely guide](https://medium.com/@kasperjuunge/how-to-get-started-with-alembic-and-sqlmodel-288700002543) for using Alembic with SQLModel.

I should just need to update `./be/migrations/env.py` with any additional models (just the ones with `table=True`) I want to track with Alembic. Then when I make changes, I can run the following commands to perform a migration.

```bash
docker compose exec be alembic revision --autogenerate -m "SOME_MESSAGE"
docker compose exec be alembic upgrade head
```

I'll dabble with a `.envrc` function. BAH! I Forgot that `export_function` doesn't pass things in correctly...

```bash
function migrate(){
    local message="$1"
    echo "$message"
    # Check if the string is empty
    if [[ -z "$message" ]]; then
        echo "Error: Empty message provided." >&2
        exit 1
    fi
    # perform db migration
    docker compose exec be alembic revision --autogenerate -m "$message"
    docker compose exec be alembic upgrade head
}
```

In addition, I may need to set a `server_default` directly when performing a migration. Here's an example:

```python
op.add_column(
    "chest",
    sa.Column("label_width", sa.Float(), nullable=False, server_default="0.0"),
)
```

In case things get deleted, these are the steps I took:

1. Install Alembic, `docker compose exec be poetry add alembic`.
2. Initialise Alembic, `docker compose exec be alembic init migrations`.
3. Edit `alembic.ini` with `sqlalchemy.url = sqlite:///database.db` (or whatever connection string I make for Postgres later on)
4. Edit `env.py` with the following:

   - ```python
        from sqlmodel import SQLModel
        from alembic import context
        from models import *  # Import your SQLModel models here

        target_metadata = SQLModel.metadata
     ```

5. Edit `script.py.mako` with `import sqlmodel`. I put mine near `import sqlalchemy`.

### How to upload image with Item?

I don't think I should include the file in the DB. My research says the DB should just contain a file name and the actual file is stored on storage for the server.

I'm thinking I'll perform two API calls on form submit. First, I upload the image and get a file name in the response. If that is successful, I'll include the file name in the POST for Item.

Should I process out a thumbnail photo too? I can then add a link or BLOB call to get a photo to include in the View.

- https://stackoverflow.com/questions/43692479/how-to-upload-an-image-in-react-js
- https://stackoverflow.com/questions/72681390/how-to-upload-a-file-from-react-front-end-to-fastapi
- https://www.tutorialspoint.com/fastapi/fastapi_uploading_files.htm

Example Code:

```python
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    # Do something with the file contents (e.g., save to disk, process it)
    return {"filename": file.filename}
```

```js
import React, { useState } from "react";

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/uploadfile/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("File uploaded:", data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
```

### How do I use a test db in tests:

```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from .app.main import app
from app.db import get_session


@pytest.fixture(name="session", scope="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client", scope="session")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_session] = get_session_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
```

- https://sqlmodel.tiangolo.com/tutorial/fastapi/tests/#why-two-fixtures
