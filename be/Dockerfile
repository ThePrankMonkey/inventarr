FROM python:3.11-slim-bookworm

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PATH="${PATH}:/root/.local/bin"

WORKDIR /src

COPY poetry.lock pyproject.toml /src/

RUN apt update -y && \
    apt install -y pipx && \
    pipx ensurepath
RUN pipx install poetry
RUN poetry config virtualenvs.create false
RUN pip config set global.break-system-packages true
RUN poetry install

COPY . .

ENTRYPOINT ["poetry", "run", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "5000"]
# ENTRYPOINT ["poetry", "run", "start"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]