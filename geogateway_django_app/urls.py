from django.conf.urls import url, include
from django.views.generic import TemplateView

app_name = "geogateway_django_app"


urlpatterns = [

    url(
        "",
        TemplateView.as_view(template_name="geogateway_django_app/main.html"),
        name="app",
    ),
]