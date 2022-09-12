from .engines import SQLiteEngine, PostgresEngine

ACTION_MAP = {
    "person": [
        {"name": 'getCars', "description": "Get owned cars"},
        {"name": 'getPhones', "description": "Get owned phones"},
        {"name": 'getPersonRelations', "description": "Get person relations"},
        {"name": 'getHotelVisits', "description": "Get hotel visits"},
        {"name": 'getPlaneTravels', "description": "Get plane travels"},
        {"name": 'getBusTravels', "description": "Get bus travels"},
        {"name": 'getJobs', "description": "Get jobs"},
        {"name": 'getCityAccommodations', "description": "Get accommodated cities"},
    ],
    "car": [
        {"name": 'getOwners', "description": "Get owners till now"}
    ],
    "hotel": [
        {"name": 'getVisitors', "description": "Get visitors of the hotel"},
    ],
    "plane": [
        {"name": 'getPlaneTravellers', "description": "Get plane travellers"}
    ],
    "bus": [
        {"name": 'getBusTravellers', "description": "Get bus travellers"}
    ],
    "phone": [
        {"name": 'getCallers', "description": "Get callers"}
    ],
    "city": [
        {"name": 'getCitizens', "description": "Get citizens"}
    ],
    "job": [
        {"name": 'getWorkers', "description": "Get workers"}
    ],
}

VIEW_MAP = {
    "getPersonRelations": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-1'
    },
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
    "getOwners": {
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
    "getHotelVisits": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-3'
    },
    "getVisitors": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-3'
    },
    "getPlaneTravels": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-4'
    },
    "getPlaneTravellers": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-4'
    },
    "getBusTravels": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-5'
    },
    "getBusTravellers": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-5'
    },
    "getPhones": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-6'
    },
    "getCallers": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-6'
    },
    "getCityAccommodations": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-7'
    },
    "getCitizens": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-7'
    },
    "getWorkers": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-8'
    },
    "getJobs": {
        "engine": SQLiteEngine,
        "dsn": 'rel.sqlite3',
        "table_name": '1-8'
    },
}
