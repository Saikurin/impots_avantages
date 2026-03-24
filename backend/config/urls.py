from django.urls import path

from apps.common.views import hello_world

urlpatterns = [
    path("", hello_world, name="hello-world"),
]
