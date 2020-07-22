import io
import requests
import zipfile
from django.http import HttpResponse, FileResponse
import subprocess
import json

# TODO: add error catching

GpsServiceUrl = "http://156.56.174.162:8000/gpsservice/kml?"
KmlPrefix = "http://156.56.174.162:8000/static"
WoForecastUrl = 'http://www.openhazards.com/Tools/kml/wo-forecast.kmz'
CaForecastUrl = 'http://www.openhazards.com/Tools/kml/ca-forecast.kmz'
GdacsUrl = 'https://www.gdacs.org/xml/gdacsEQ.geojson'
NowcastUrl = "http://gf8.ucs.indiana.edu:8000/seismicityservice/plot?"
uavsarOverUrl = 'http://gf8.ucs.indiana.edu/geoserver/InSAR/wms'
uavsarJsonUrl = 'https://geo-gateway.org/uavsar_query/?querystr='


def gps_service(request):
    if request.method == 'GET':
        print(request.GET.get("data"))
        # more efficient way of getting request params?
        # getting request params from GET in GNSS.vue
        payload = {
            "function": request.GET.get("function"),  # .GET.get("function"),
            "lat": request.GET.get("lat"),
            "lon": request.GET.get("lon"),
            "width": request.GET.get("width"),
            "height": request.GET.get("height"),
            "epoch": request.GET.get("epoch"),
            "epoch1": request.GET.get("epoch1"),
            "epoch2": request.GET.get("epoch2"),
            "scale": request.GET.get("scale"),
            "ref": request.GET.get("ref"),
            "ct": request.GET.get("ct"),
            "pt": request.GET.get("pt"),
            "dwin1": request.GET.get("dwin1"),
            "dwin2": request.GET.get("dwin2"),
            "prefix": request.GET.get("prefix"),
            "mon": request.GET.get("mon"),
            "eon": request.GET.get("eon"),
            "vabs": request.GET.get("vabs")}
        data = requests.get(GpsServiceUrl, params=payload)
        responseData = HttpResponse(data)
        return responseData


def get_gnss_kml(request):
    if request.method == 'GET':
        folder = request.GET.get("folder")
        file = request.GET.get("file")
        url = KmlPrefix + '/' + folder + '/' + file
        print('url:' + url)
        data = requests.get(url)
        responseData = HttpResponse(data)
        return responseData


def forecast(request):
    if request.method == 'GET':
        if request.GET.get('loc') == 'global':
            data = requests.get(WoForecastUrl, stream=True)
        else:
            data = requests.get(CaForecastUrl, stream=True)

        z = zipfile.ZipFile(io.BytesIO(data.content))
        responseData = HttpResponse(z.open('doc.kml'))
        return responseData


def gdacs(request):
    if request.method == 'GET':
        data = requests.get(GdacsUrl)
        responseData = HttpResponse(data)
        return responseData


def nowcast_plots(request):
    if request.method == 'GET':
        lat = request.GET.get("lat")
        lon = request.GET.get("lon")
        payload = {
            'location': lat + ',' + lon,
            'name': request.GET.get("place"),
            'country': 'notset',
        }
        data = requests.get(NowcastUrl, params=payload)
        responseData = HttpResponse(data)
        print(data)
        return responseData


def runDisloc(request):
    if request.method == 'GET':
        file = request.GET.get('file')
        subprocess.run(['./disloc/disloc', file])
        subprocess.run(['cat', './disloc/disloc.output'])
        output = open('./disloc/disloc.output', 'rb')
        response = FileResponse(output)
        return response


def uavsarOverview(request):
    if request.method == 'GET':
        data = requests.get(uavsarOverUrl)
        responseData = HttpResponse(data)
        return responseData


def uavsarGeometry(request):
    if request.method == 'GET':
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        fullQuery = uavsarJsonUrl + 'Point:(' + str(lat) + ',' + str(lon) + ')'
        data = requests.get(fullQuery)
        responseData = HttpResponse(data)
        return responseData


def uavsarKML(request):
    if request.method == 'GET':
        baseURI = 'http://gf2.ucs.indiana.edu/kmz/'
        raw = request.GET.get('json')
        query = json.loads(raw)
        postfix = 'uid'+query['uid']+'/'+query['dataname']+'.int.kml'
        fullURI = baseURI + postfix
        data = requests.get(fullURI)

        uid = query['uid']

        toRep = '<href>http://gf2.ucs.indiana.edu/kmz/' + 'uid' + uid + '/'

        respData = data.content.replace('<href>'.encode(), toRep.encode())
        response = HttpResponse(respData)
    
        return response
