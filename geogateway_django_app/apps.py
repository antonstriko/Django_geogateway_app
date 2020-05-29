from django.apps import AppConfig
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class Settings:

    WEBPACK_LOADER = {
        "djvue_app2": {
            "BUNDLE_DIR_NAME": "geogateway_django_app/bundles/",
            "STATS_FILE": os.path.join(
                BASE_DIR,
                "static",
                "geogateway_django_app",
                "bundles",
                "webpack-stats.json",
            ),
        }
    }


class GeogatewayDjangoAppConfig(AppConfig):
    name = 'geogateway_django_app'
    label = name
    verbose_name = 'GeoGateway Django-Vue App'
    fa_icon_class = 'fa-comment'
    settings = Settings()
