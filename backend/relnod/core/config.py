from .engines import SQLiteEngine, PostgresEngine, PostgresInfoEngine

INFO_MAP = {
    "person": {
        "engine": PostgresInfoEngine,
        "dsn": {
            "dbname": 'relnod',
            "user": 'postgres',
            "password": 'postgres',
            "host": 'relnod_db_postgres',  # docker-compose container name
            "port": '5432'
        },
        "table_name": 'main_core_node'
    },
}

ACTION_MAP = {
    "person": [
        {"name": 'getCars', "description": "Get owned cars"},
        {"name": 'getPlaneTravels', "description": "Get plane travels"},
    ],
    "car": [
        {"name": 'getOwners', "description": "Get owners"},
    ],
}

VIEW_MAP = {
    "getCars": {
        "engine": PostgresEngine,
        "dsn": {
            "dbname": 'relnod',
            "user": 'postgres',
            "password": 'postgres',
            "host": 'relnod_db_postgres',  # docker-compose container name
            "port": '5432'
        },
        "table_name": '1-2'
    },
    "getPlaneTravels": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-4'
    },
}

NODE_TYPE_MAP = {
    1: {"id": 1, "description": 'person', "icon": 'person-icon.png', "name": 'Person'},
    2: {"id": 2, "description": 'car', "icon": 'car-icon.png', "name": 'Car'},
    4: {"id": 4, "description": 'plane', "icon": 'plane-icon.png', "name": 'Plane'},
}
