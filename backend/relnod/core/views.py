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
        action_type = kwargs.get('action_type', None)
        filters = request.query_params

        if node_type:
            return self.list(node_type)
        elif action_type:
            return self.action(action_type, filters)

    @staticmethod
    def list(node_type):
        action_map = {
            "person": [
                {"name": 'a', "description": "get first degree relations"},
                {"name": 'c', "description": "get first degree relations"},
                {"name": 'b', "description": "get third degree relations"},
            ],
            "hotel": [
                {"name": 'c', "description": "get visitors"},
            ],
            "car": [
                {"name": 'getOwners', "description": "Get owners till now"}
            ]
        }

        if node_type not in action_map.keys():
            return Response(data=[])

        return Response(data=action_map[node_type])

    @staticmethod
    def action(action_type, filters):
        print(f"ACTION TYPE: {action_type}, FILTERS: {filters}", flush=True)
        return Response(data=f"ACTION TYPE: {action_type}")


class TicketAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data={"ticket": 123})


class RelationAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data=[
            {"from": 1, "to": 2},
            {"from": 3, "to": 1},
            {"from": 4, "to": 10},
            {"from": 6, "to": 9},
        ])

    def relations(self):
        pass
