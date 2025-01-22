FROM python:3.11-slim-bookworm

WORKDIR /src
ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PYTHONPATH="." \
    PATH="${PATH}:/root/.local/bin"

RUN apt update -y && \
    apt install -y pipx && \
    pipx ensurepath
RUN pipx install poetry
# RUN poetry config virtualenvs.create false
# RUN pip config set global.break-system-packages true

COPY poetry.lock pyproject.toml README.md /src/
RUN poetry install
# RUN poetry install --no-root

COPY . .

ENTRYPOINT ["poetry", "run", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "5000"]
# poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
# ENTRYPOINT ["poetry", "run", "start"]
# poetry run start
# ENTRYPOINT ["tail", "-f", "/dev/null"]