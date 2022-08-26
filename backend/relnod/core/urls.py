from django.urls import path, include
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
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
