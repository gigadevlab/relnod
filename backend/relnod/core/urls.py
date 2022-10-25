from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path(r'token/', TokenAPIView.as_view(), name='token'),
    path(r'type-action/<str:node_type>/', ActionAPIView.as_view(), name='type-action'),
    path(r'action/<str:name>/', ActionAPIView.as_view(), name='action'),
    path(r'node-info/<str:type>/<str:key>/', NodeInfoAPIView.as_view(), name='node-info'),
    path(r'type-info/', NodeTypeAPIView.as_view(), name='node-type'),
    path(r'type-info/<int:id>/', NodeTypeAPIView.as_view(), name='type-info'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
