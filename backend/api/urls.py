from django.urls import path
from .views import UserRegistrationView, ProfileView, WorkerProfileView, EmployerProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile'),
    path('worker-profile/<str:username>/', WorkerProfileView.as_view(), name='worker_profile'),
    path('employer-profile/<str:username>/', EmployerProfileView.as_view(), name='employer_profile'),
]
