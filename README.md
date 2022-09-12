# relnod
Node relation project

## Setup

Unzip Node.js libraries

```bash
cd frontend
unzip node_modules.zip
```

Run Docker containers

```bash
cd docker/relnod
docker-compose up -d
```

## Data Init

Dummy data in: backend/relnod/core/management/command

## Config

There are engines and config files inside "backend/relnod/core/".
You can define database further engines and views to make connection. 

### config.py

* ACTION_MAP: Defines the methods that will be show on frontend

Ex:
```python
ACTION_MAP = {
    "<action name>": [
        {"name": '<action name>', "description": "<...>"}
    ],
    .
    .
    .
}
``` 

* VIEW_MAP: Defines DB connection engines, DSNs, and table names that are mapped to
            "methods" in ACTION_MAP

Ex:
```python
VIEW_MAP = {
    "<action name>": {
        "engine": <any chield of the BaseEngine>,
        "dsn": {
            "dbname": '<...>',
            "user": '<...>',
            "password": '<...>',
            "host": '<...>',
            "port": '<...>'
        },
        "table_name": '<...>'
    },
    .
    .
    .
}
```

```
Note: <action name> should be exist for both VIEW_MAP and ACTION_MAP!
```

### engines.py

Till now, I implemented engines for SQLite and Postgres. Further engines
can be implemented by using the BaseEngine class.


## Usage

Go to page: https://localhost:3000
