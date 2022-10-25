import json

from rest_framework import views, permissions, status
from rest_framework.response import Response

from .config import VIEW_MAP, ACTION_MAP, INFO_MAP, NODE_TYPE_MAP
from .templates import pre_process, post_process


class NodeTypeAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        type_id = kwargs.get('id', None)

        if type_id:
            return Response(data=NODE_TYPE_MAP[type_id])

        return Response(data=NODE_TYPE_MAP.values())


class NodeInfoAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION')
        node_key = kwargs.get('key', None)
        node_type = kwargs.get('type', None)

        return self.info(node_type, node_key, token)

    @staticmethod
    def info(node_type, node_key, token):
        view = (INFO_MAP.get(node_type, None))

        if view is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        keys = pre_process([node_key], token)
        dsn = view["dsn"]
        table_name = view["table_name"]

        engine = view["engine"](dsn=dsn, table_name=table_name, keys=keys)

        return Response(data=rows2info(post_process(engine.get_rows(), token)))


class ActionAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION')
        node_type = kwargs.get('node_type', None)
        name = kwargs.get('name', None)

        if node_type:
            return self.list(node_type)
        elif name:
            filters = request.query_params.get('filters')
            nodes = json.loads(request.query_params.get('nodes'))
            return self.action(name, nodes, token, filters=filters)

    @staticmethod
    def list(node_type):
        if node_type not in ACTION_MAP.keys():
            return Response(data=[])

        return Response(data=ACTION_MAP[node_type])

    @staticmethod
    def action(name, nodes, token, filters=None):
        view = (VIEW_MAP.get(name, None))

        if view is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        keys = pre_process([node['key'] for node in nodes], token)
        dsn = view["dsn"]
        table_name = view["table_name"]

        engine = view["engine"](dsn=dsn, table_name=table_name, keys=keys)

        return Response(data=rows2graph(post_process(engine.get_rows(filters=filters), token)))


class TokenAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data={"token": 123})


def rows2graph(rows):
    edges = []
    nodes = []

    for row in rows:
        edges.append({"from": row["key1"], "to": row["key2"], "label": row["relation_name"]})
        nodes.append({"key": row["key1"], "type": NODE_TYPE_MAP.get(row["type1"], None)})
        nodes.append({"key": row["key2"], "type": NODE_TYPE_MAP.get(row["type2"], None)})

    return {"nodes": nodes, "edges": edges}


def rows2info(rows):
    if len(rows) <= 0:
        return {}

    return {"short_description": rows[0]["short_description"], "long_description": rows[0]["long_description"]}

