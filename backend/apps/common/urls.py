from django.urls import path

from .views import healthcheck, hello_world

urlpatterns = [
    path("", hello_world, name="hello-world"),
    path("health/", healthcheck, name="healthcheck"),
]
