from django.urls import path
from .views import projects, generate_tests

urlpatterns = [
    path('projects/', projects),   # ✅ NEW
    path('generate/', generate_tests),
]