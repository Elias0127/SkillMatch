from django.contrib import admin
from django.urls import path, include
from api.views import UserRegistrationView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),  # Include API-specific endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # JWT token endpoint
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # JWT token refresh endpoint
]