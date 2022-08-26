from rest_framework import serializers

from .models import *


class NodeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeType
        fields = [
            'id',
            'name',
            'description',
            'icon',
        ]


class NodeSerializer(serializers.ModelSerializer):
    type = NodeTypeSerializer()

    class Meta:
        model = Node
        fields = [
            'id',
            'key',
            'type',
        ]
