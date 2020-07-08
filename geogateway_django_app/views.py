from django.http import HttpResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import subprocess
import requests


DislocUrl = 'http://127.0.0.1:8000/geogateway_django_app/disloc'


class MyFileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        payload = {
            'file': file
        }
        return FileResponse(requests.get(DislocUrl, params=payload))


class KmlUpload(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        return FileResponse(file)
