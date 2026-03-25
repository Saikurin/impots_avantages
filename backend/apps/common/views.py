from django.http import JsonResponse


def hello_world(request):
    return JsonResponse({"message": "Hello world"})


def healthcheck(request):
    return JsonResponse({"status": "ok"})
