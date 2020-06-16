from django.conf.urls import url, include
from django.views.generic import TemplateView
from rest_framework import routers
from . import GeoGatewayData, views


router = routers.DefaultRouter()

app_name = "geogateway_django_app"


urlpatterns = [
    url(r"^api/", include(router.urls)),

    url(
        r"^$",
        TemplateView.as_view(template_name="geogateway_django_app/main.html"),
        name="app",
    ),
    url(r"^gps_service/", GeoGatewayData.gps_service),
    url(r"^get_kml/", GeoGatewayData.get_gnss_kml)
]