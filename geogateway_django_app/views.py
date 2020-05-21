from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage

# Create your views here.

@login_required
def main(request):
    return render(request, "geogateway_django_app/main.html")


def upload(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['kml-file']
        fs = FileSystemStorage()
        fs.save(uploaded_file.name, uploaded_file)
    return render(request, 'geogateway_django_app/kml-upload.html')
