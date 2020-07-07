from django.http import HttpResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import subprocess
import requests


DislocUrl = 'http://127.0.0.1:8000/geogateway_django_app/disloc'


class MyFileView(APIView):
    # MultiPartParser AND FormParser
    # https://www.django-rest-framework.org/api-guide/parsers/#multipartparser
    # "You will typically want to use both FormParser and MultiPartParser
    # together in order to fully support HTML form data."
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        payload = {
            'file': file
        }
        return FileResponse(requests.get(DislocUrl, params=payload))


        # if file_serializer.is_valid():
        #     file_serializer.save()
        #     return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        # else:
        #     return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
