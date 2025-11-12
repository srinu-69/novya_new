from django.http import JsonResponse, HttpResponse


def health(request):
    return JsonResponse({"status": "ok", "service": "novya-backend"})


def favicon(request):
    return HttpResponse(status=204)


