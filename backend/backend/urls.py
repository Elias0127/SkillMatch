from django.contrib import admin
from django.urls import path, include
from api.views import UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),  # The application-specific API endpoints
    path("api/user/register/", UserRegistrationView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # JWT token endpoint
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # JWT token refresh endpoint
]
