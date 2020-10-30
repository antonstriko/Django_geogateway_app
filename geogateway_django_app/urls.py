from django.conf.urls import url, include
from django.views.generic import TemplateView
from rest_framework import routers
from . import GeoGatewayData
from . import views

from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

app_name = "geogateway_django_app"



urlpatterns = [
    url(r'^$',
        views.frontend,
        name="home",
        ),
    url(r"^gps_service/", GeoGatewayData.gps_service),
    url(r"^get_kml/", GeoGatewayData.get_gnss_kml),
    url(r"^wo_forecast/", GeoGatewayData.forecast),
    url(r"^ca_forecast/", GeoGatewayData.forecast),
    url(r"^gdacs/", GeoGatewayData.gdacs),
    url(r"^nowcast/", GeoGatewayData.nowcast_plots),
    url(r"^disloc/", GeoGatewayData.runDisloc),
    url(r'^kml_upload/$', GeoGatewayData.kml_upload),
    url(r"^UAVSAR_overview/", GeoGatewayData.uavsarOverview),
    url(r"^UAVSAR_geom/", GeoGatewayData.uavsarGeometry),
    url(r"^UAVSAR_KML/", GeoGatewayData.uavsarKML),
    url(r"^UAVSAR_test/", GeoGatewayData.uavsarTest),
    url(r"^UAVSAR_csv/", GeoGatewayData.uavsarCSV),
    url(r"^UAVSAR_flight/", GeoGatewayData.uavsarFlight),
    url(r'^kmz_upload/$', GeoGatewayData.kmz_upload),
    url(r'^seismicity/$', GeoGatewayData.seismicity),



]