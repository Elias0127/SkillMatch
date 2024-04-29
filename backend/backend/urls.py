from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),  # Include API-specific endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # JWT token endpoint
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # JWT token refresh endpoint
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
