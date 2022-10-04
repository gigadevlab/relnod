import json

from rest_framework import viewsets, views, permissions
from rest_framework.response import Response

from .models import *
from .serializers import *
from .config import VIEW_MAP, ACTION_MAP


class NodeTypeViewSet(viewsets.ModelViewSet):
    queryset = NodeType.objects.all().order_by('id')
    serializer_class = NodeTypeSerializer
    permission_classes = [permissions.AllowAny]


class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all().order_by('id')
    serializer_class = NodeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'key'


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
        if node_type not in ACTION_MAP.keys():
            return Response(data=[])

        return Response(data=ACTION_MAP[node_type])

    @staticmethod
    def action(name, nodes, filters):
        view = (VIEW_MAP[name])

        keys = [node['key'] for node in nodes]
        dsn = view["dsn"]
        table_name = view["table_name"]

        engine = view["engine"](dsn=dsn, table_name=table_name, keys=keys)

        return Response(data=rows2data(engine.get_rows()))


class TicketAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data={"ticket": 123})


def rows2data(rows):
    edges = []
    nodes = []

    for row in rows:
        edges.append({"from": row["key1"], "to": row["key2"]})
        nodes.append({"key": row["key1"], "type": NodeTypeSerializer(NodeType.objects.get(id=row["type1"])).data})
        nodes.append({"key": row["key2"], "type": NodeTypeSerializer(NodeType.objects.get(id=row["type2"])).data})

    return {"nodes": nodes, "edges": edges}
