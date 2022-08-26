from rest_framework import viewsets, views, permissions
from rest_framework.response import Response

from .models import *
from .serializers import *


class NodeTypeViewSet(viewsets.ModelViewSet):
    queryset = NodeType.objects.all().order_by('name')
    serializer_class = NodeTypeSerializer
    permission_classes = [permissions.AllowAny]
    # lookup_field = 'key'


class InfoViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all().order_by('key')
    serializer_class = NodeSerializer
    permission_classes = [permissions.AllowAny]


class InfoAPIView:
    def get(self, type, key):
        pass


class ActionAPIView(views.APIView):
    def get(self, request):
        return Response(data={
            "actions": ['a', 'b', 'c']
        })


class TicketAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response(data={"ticket": 123})


class RelationAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        print('hello')
        return Response(data=[
            {"from": 1, "to": 2},
            {"from": 3, "to": 1},
            {"from": 4, "to": 10},
            {"from": 6, "to": 9},
        ])

    def relations(self):
        pass
