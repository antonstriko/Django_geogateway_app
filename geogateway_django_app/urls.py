from django.conf.urls import url, include
from django.views.generic import TemplateView
from rest_framework import routers
from . import GeoGatewayData
from . import views


router = routers.DefaultRouter()

app_name = "geogateway_django_app"


urlpatterns = [
    url(r"^$",
        TemplateView.as_view(template_name="geogateway_django_app/main.html"),
        name="app",
        ),
    url(r'^upload/$', views.MyFileView.as_view(), name='file-upload'),
    url(r"^gps_service/", GeoGatewayData.gps_service),
    url(r"^get_kml/", GeoGatewayData.get_gnss_kml),
    url(r"^wo_forecast/", GeoGatewayData.forecast),
    url(r"^ca_forecast/", GeoGatewayData.forecast),
    url(r"^gdacs/", GeoGatewayData.gdacs),
    url(r"^nowcast/", GeoGatewayData.nowcast_plots),
    url(r"^disloc/", GeoGatewayData.runDisloc),
    url(r'^kml_upload/$', views.KmlUpload.as_view(), name='kml-upload'),
    url(r"^UAVSAR_overview/", GeoGatewayData.uavsarOverview),
    url(r"^UAVSAR_geom/", GeoGatewayData.uavsarGeometry),
    url(r"^UAVSAR_KML/", GeoGatewayData.uavsarKML),
    # url(r"^uavsarHighRes/", GeoGatewayData.uavsarHighRes)


]