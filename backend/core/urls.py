from django.http import HttpResponse
from django.urls import path, include

def home(request):
    return HttpResponse("Backend is running 🚀")

urlpatterns = [
    path('', home),
    path('api/', include('api.urls')),
]