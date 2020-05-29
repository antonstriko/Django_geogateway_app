import setuptools

setuptools.setup(
    name="geogateway-django-app",
    version="0.0.1",
    description="GeoGateway Django app",
    packages=setuptools.find_packages(),
    install_requires=[
        'django>=1.11.16'
    ],
    entry_points="""
[airavata.djangoapp]
geogateway_django_app = geogateway_django_app.apps:GeogatewayDjangoAppConfig
""",
)
