FROM python:3.11-slim-bookworm

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PATH="${PATH}:/root/.local/bin"

WORKDIR /src

RUN apt update -y && \
    apt install -y pipx && \
    pipx ensurepath
RUN pipx install poetry
COPY . .

RUN poetry config virtualenvs.create false

RUN poetry install

ENTRYPOINT ["poetry", "run", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "5000"]
# ENTRYPOINT ["poetry", "run", "start"]