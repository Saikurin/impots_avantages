from django.urls import include, path

urlpatterns = [
    path("", include("apps.common.urls")),
    path(
        "api/bundles/frais-kilometriques/",
        include("apps.bundles.frais_kilometriques.api.urls"),
    ),
]
