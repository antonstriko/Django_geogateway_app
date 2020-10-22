import io
import json
import subprocess
import zipfile
import csv


import requests
from django.http import HttpResponse, FileResponse, JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage
# TODO: add error catching

GpsServiceUrl = "http://156.56.174.162:8000/gpsservice/kml?"
KmlPrefix = "http://156.56.174.162:8000/static"
WoForecastUrl = 'http://www.openhazards.com/Tools/kml/wo-forecast.kmz'
CaForecastUrl = 'http://www.openhazards.com/Tools/kml/ca-forecast.kmz'
GdacsUrl = 'https://www.gdacs.org/xml/gdacsEQ.geojson'
NowcastUrl = "http://gf8.ucs.indiana.edu:8000/seismicityservice/plot?"
uavsarOverUrl = 'http://gf8.ucs.indiana.edu/geoserver/InSAR/wms'
uavsarJsonUrl = 'https://geo-gateway.org/uavsar_query/?querystr='
geoServerUrl='http://gf2.ucs.indiana.edu/quaketables/uavsar/search?searchstring='


def gps_service(request):
    if request.method == 'GET':
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
        return responseData


def runDisloc(request):
    if request.method == 'GET':
        file = request.GET.get('file')
        subprocess.run(['./disloc/disloc', file])
        subprocess.run(['cat', './disloc/disloc.output'])
        output = open('./disloc/disloc.output', 'rb')
        subprocess.run(['python', 'disloc/disloc2kml.py', '-i', output, '-o disloc.kml'])
        kmlOut = open('./disloc/disloc.kml', 'rb')
        response = FileResponse(kmlOut)
        return response


def uavsarOverview(request):
    if request.method == 'GET':
        data = requests.get(uavsarOverUrl)
        responseData = HttpResponse(data)
        return responseData


def uavsarGeometry(request):
    print('Geometry Ran /////////////////////////////////////')
    if request.method == 'GET':
        if request.GET.get('type') == 'point':
            point = request.GET.get('queryStr')
            fullQuery = uavsarJsonUrl + 'Point:' + point
        elif request.GET.get('type') == 'polygon':
            poly = request.GET.get('queryStr')
            fullQuery = uavsarJsonUrl + 'Polygon:' + poly
        else:
            rect = request.GET.get('queryStr')
            fullQuery = uavsarJsonUrl + 'Rectangle:' + rect

        data = requests.get(fullQuery)
        responseData = HttpResponse(data)
        return responseData


def uavsarFlight(request):
    if request.method == 'GET':
        path = request.GET.get('queryStr')
        fullUri = geoServerUrl + path
        data = requests.get(fullUri)
        responseData = HttpResponse(data)
        return responseData

def uavsarTest(request):
    if request.method == 'GET':
        testURI = 'http://js-168-89.jetstream-cloud.org/geoserver/InSAR/wms?version=1.1.1&request=DescribeLayer' \
                  '&outputFormat=application/json&exceptions=application/json&layers= '

        layername = request.GET.get('uid')

        data = requests.get(testURI + layername)
        return HttpResponse(data)


def uavsarKML(request):
    if request.method == 'GET':

        baseURI = 'http://gf2.ucs.indiana.edu/kmz/'
        raw = request.GET.get('json')
        query = json.loads(raw)
        postfix = 'uid' + query['uid'] + '/' + query['dataname'] + '.int.kml'
        fullURI = baseURI + postfix
        data = requests.get(fullURI)

        uid = query['uid']

        toRep = '<href>http://gf2.ucs.indiana.edu/kmz/' + 'uid' + uid + '/'

        respData = data.content.replace('<href>'.encode(), toRep.encode()).decode("utf-8")
        meta = query
        responseObj = {'kml': respData, 'info': meta, 'active': True, 'extended': False}

        response = JsonResponse(responseObj, safe=False)
        return response


def uavsarCSV(request):
    if request.method == 'GET':
        # http://149.165.157.193:8000/los/profile?image=uid475_unw&point=-115.8003008515625,33.56101488057798,-115.7003008515625,33.56101488057798&format=csv&resolution=undefined&method=native
        baseURI = 'http://149.165.157.193:8000/los/profile?image='
        raw = request.GET.get('entry')
        entry = json.loads(raw)
        info = entry['info']
        uid = info['uid']
        image_name = info['dataname']
        lat1 = request.GET.get('lat1')
        lon1 = request.GET.get('lon1')
        lat2 = request.GET.get('lat2')
        lon2 = request.GET.get('lon2')
        losLength = request.GET.get('losLength')
        azimuth = request.GET.get('azimuth')

        finalURI = baseURI + 'uid' + uid + '_unw&point=' + lon1 + ',' + lat1 + ',' + lon2 + ',' + lat2 + \
                   '&format=csv&resolution=undefined&method=native'

        data = requests.get(finalURI)

        data = str(data.content.decode())

        data = data.replace('""', '')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=' + uid + '.csv"'

        writer = csv.writer(response)
        writer.writerow([image_name])
        writer.writerow(['start', lat1, lon1])
        writer.writerow(['end', lat2, lon2])
        writer.writerow(['azimuth', azimuth])
        writer.writerow(['length', losLength])
        writer.writerow("Lon, Lat, Distance (km), Displacement, Elevation Angle".split(','))
        data = data.splitlines()
        print(data)
        data = [line.split(',') for line in data]
        print(data)
        writer.writerows(data)

        return response


def kmz_upload(request):
    if request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(file.name, file)
        uploaded_file_url = fs.url(filename)
        return HttpResponse(uploaded_file_url, content_type='text/plain')

def kml_upload(request):
    if request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(file.name, file)
        uploaded_file_url = fs.url(filename)
        return HttpResponse(uploaded_file_url, content_type='text/plain')

