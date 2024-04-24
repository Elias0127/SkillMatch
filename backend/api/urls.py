from django.urls import path
from .views import SkillDetailView, SkillListView, UserRegistrationView, ProfileView, WorkerProfileView, EmployerProfileView, LoginView, LogoutView, WorkerSkillView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile'),
    path('worker-profile/<str:username>/', WorkerProfileView.as_view(), name='worker_profile'),
    path('employer-profile/<str:username>/', EmployerProfileView.as_view(), name='employer_profile'),
    path('login/', LoginView.as_view(), name='api_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('skills/', SkillListView.as_view(), name='skills_list'),
    path('skills/<int:pk>/', SkillDetailView.as_view(), name='skill_detail'),
    path('worker-skills/<str:username>/', WorkerSkillView.as_view(), name='worker_skills'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
