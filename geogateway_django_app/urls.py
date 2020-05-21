from django.conf.urls import url, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static

from . import views


app_name = 'geogateway_django_app'
urlpatterns = [
    url(r'^main/', views.main, name="home"),
    url(r'^kml-upload/', views.upload, name="kml-upload"),

]
urlpatterns += staticfiles_urlpatterns()


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)