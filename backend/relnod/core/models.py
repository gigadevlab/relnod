from django.db import models


class NodeType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, blank=True)
    icon = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name


class Node(models.Model):
    key = models.CharField(max_length=255, unique=True)
    type = models.ForeignKey(NodeType, on_delete=models.CASCADE)
    short_description = models.CharField(max_length=200, blank=True)
    long_description = models.CharField(max_length=500, blank=True)
