import json

from rest_framework import viewsets, views, permissions
from rest_framework.response import Response

from .models import *
from .serializers import *


class NodeTypeViewSet(viewsets.ModelViewSet):
    queryset = NodeType.objects.all().order_by('id')
    serializer_class = NodeTypeSerializer
    permission_classes = [permissions.AllowAny]
    # lookup_field = 'key'


class InfoViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all().order_by('id')
    serializer_class = NodeSerializer
    permission_classes = [permissions.AllowAny]


class InfoAPIView:
    def get(self, type, key):
        pass


class ActionAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        node_type = kwargs.get('node_type', None)
        name = kwargs.get('name', None)

        if node_type:
            return self.list(node_type)
        elif name:
            filters = request.query_params.get('filters')
            nodes = json.loads(request.query_params.get('nodes'))
            return self.action(name, nodes, filters)

    @staticmethod
    def list(node_type):
        action_map = {
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

        if node_type not in action_map.keys():
            return Response(data=[])

        return Response(data=action_map[node_type])

    @staticmethod
    def action(name, nodes, filters):

        view_map = {
            "getPersonRelations": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-1'
            },
            "getCars": {
                "engine": postgres_connector,
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
                "engine": postgres_connector,
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
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-3'
            },
            "getVisitors": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-3'
            },
            "getPlaneTravels": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-4'
            },
            "getPlaneTravellers": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-4'
            },
            "getBusTravels": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-5'
            },
            "getBusTravellers": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-5'
            },
            "getPhones": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-6'
            },
            "getCallers": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-6'
            },
            "getCityAccommodations": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-7'
            },
            "getCitizens": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-7'
            },
            "getWorkers": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-8'
            },
            "getJobs": {
                "engine": sqlite_connector,
                "dsn": 'rel.sqlite3',
                "table_name": '1-8'
            },
        }

        keys = [node['key'] for node in nodes]

        view = (view_map[name])
        engine = view["engine"]
        dsn = view["dsn"]
        table_name = view["table_name"]

        data = rows2data(engine(dsn=dsn, table_name=table_name, keys=keys))

        # print(f"ACTION TYPE: {name}, NODES: {nodes}, FILTERS: {filters}, DATA: {data}")
        return Response(data=data)


class TicketAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data={"ticket": 123})


class RelationAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data=[
            {"from": '10088201022', "to": 'Ankara'},
            {"from": 'Istanbul', "to": 'Ramada'},
            {"from": '06BGG742', "to": '10088201190'},
        ])

    def relations(self):
        pass


def dict_factory(cursor, row):
    col_names = [col[0] for col in cursor.description]
    return {key: value for key, value in zip(col_names, row)}


def rows2data(rows):
    edges = []
    nodes = []

    for row in rows:
        edges.append({"from": row["key1"], "to": row["key2"]})
        nodes.append({"key": row["key1"], "type": NodeTypeSerializer(NodeType.objects.get(id=row["type1"])).data})
        nodes.append({"key": row["key2"], "type": NodeTypeSerializer(NodeType.objects.get(id=row["type2"])).data})

    return {"nodes": nodes, "edges": edges}


def sqlite_connector(dsn, table_name, keys):
    import sqlite3

    con = sqlite3.connect(dsn)
    con.row_factory = dict_factory
    keys = ','.join([f"\'{key}\'" for key in keys])

    cur = con.cursor()
    cur.execute(f"""
        SELECT key1, type1, relation_name, key2, type2 FROM \'{table_name}\'
        WHERE key1 in ({keys}) OR key2 in ({keys});
    """)
    rows = cur.fetchall()
    cur.close()
    return rows


def postgres_connector(dsn, table_name, keys):
    import psycopg

    con = psycopg.connect(**dsn, row_factory=psycopg.rows.dict_row)
    keys = ','.join([f"\'{key}\'" for key in keys])

    cur = con.cursor()
    cur.execute(f"""
        SELECT key1, type1, relation_name, key2, type2 FROM \"{table_name}\"
        WHERE key1 in ({keys}) OR key2 in ({keys});
    """)
    rows = cur.fetchall()
    cur.close()
    return rows
