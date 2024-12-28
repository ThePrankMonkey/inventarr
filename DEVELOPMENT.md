## Features

### Create Labels

New dependencies:

```bash
docker compose exec be poetry add pillow
docker compose exec be poetry add segno
docker compose exec be poetry add qrcode-artistic
```

I need to create images for the labels that will be printed. I need to have a global maximum width for the images, as well as have each chest and pocket listing a local area I can make use for generating labels.

I want to include a QR code that I can later scan in to look up things. For the QR data, I have two major plans...

- generate a uuid for each item
- use the type and id to make a unique id.
  - I prefer the as I can look up things faster.

Research:

- https://realpython.com/python-generate-qr-code/#using-python-to-generate-a-basic-qr-code

## Issues

### pymongo.errors.OperationFailure: Authentication failed.

```
pymongo.errors.OperationFailure: Authentication failed., full error: {'ok': 0.0, 'errmsg': 'Authentication failed.', 'code': 18, 'codeName': 'AuthenticationFailed'}
```

Getting an authentication error when trying to connect to mongodb container. Turns out the suggested URL from https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/ is out of date. Need to include an `authSource` flag.

```yaml
MONGODB_URL: "mongodb://root:example@db:27017/dev?authSource=admin&retryWrites=true&w=majority"
```

- https://stackoverflow.com/questions/72048051/pymongo-auth-failure-ok-0-0-errmsg-authentication-failed-code-18

### ValueError: [TypeError("'ObjectId' object is not iterable")

```
ValueError: [TypeError("'ObjectId' object is not iterable"), TypeError('vars() argument must have __dict__ attribute')]
```

My attempt to overwrite the ObjectId isn't going smoothly. Issue seems to be when FastAPI tries to render the object but it has a ObjectID for the `_id` field.

My solution was working. I just forgot to tell FastAPI to use the model. `-> Equipment` is the same as `response_model=Equipment,` and tells FastAPI what structure to use on the response. Otherwise it's the content from mongodb and that's a problem.

```python
@router.post("/")
async def create_item(equipment: Equipment = Body(...)) -> Equipment:
    logger.info("Trying to add some equipment")
    response = await add_equipment(equipment)
    logger.info(response)
    return response
```

- https://stackoverflow.com/questions/76978498/fastapi-automatically-serialize-objectid-from-mongodb
- https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/
- https://stackoverflow.com/questions/71467630/fastapi-issues-with-mongodb-typeerror-objectid-object-is-not-iterable
