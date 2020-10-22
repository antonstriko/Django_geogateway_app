from django.http import HttpResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.generic import TemplateView
import subprocess
import requests
import zipfile
import io
import os
from io import StringIO
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView

from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage

BASEDIR = os.path.dirname(os.path.abspath(__file__))


DislocUrl = 'https://beta.geogateway.scigap.org/geogateway_django_app/disloc'


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


class KmzUpload(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):

        file = request.FILES['file']
        zipdata = StringIO()
        zipdata.write(file)
        myzipfile = zipfile.ZipFile(zipdata)
        return FileResponse(zip_file)



def frontend(request):
    template_name = "geogateway_django_app/main.html"

    return render(request, template_name)

#     @method_decorator(login_required)
#     def dispatch(self, *args, **kwargs):
#         return super().dispatch(*args, **kwargs)



