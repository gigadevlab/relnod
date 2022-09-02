from django.urls import path, include, re_path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

from .views import *

router = routers.DefaultRouter()
router.register(r'info', InfoViewSet)
router.register(r'type-info', NodeTypeViewSet)
router.register(r'node-types', NodeTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ticket/', TicketAPIView.as_view(), name='ticket'),
    path('relation/', RelationAPIView.as_view(), name='relation'),
    re_path(r'^type-action/(?P<node_type>\w+)/$', ActionAPIView.as_view(), name='type-action'),
    re_path(r'^action/(?P<action_type>\w+)/$', ActionAPIView.as_view(), name='action'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
