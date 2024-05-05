from django.urls import path
from .views import (NearbyWorkersView, UserRegistrationView, ProfileView, WorkerProfileView, EmployerProfileView,LoginView, LogoutView, SkillListView, SkillDetailView, WorkerSkillViewSet)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile'),
    path('worker-profile/<str:username>/', WorkerProfileView.as_view(), name='worker_profile'),
    path('employer-profile/<str:username>/', EmployerProfileView.as_view(), name='employer_profile'),
    path('nearby-workers/', NearbyWorkersView.as_view(), name='nearby-workers'),
    path('login/', LoginView.as_view(), name='api_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('skills/', SkillListView.as_view(), name='skills_list'),
    path('skills/<int:pk>/', SkillDetailView.as_view(), name='skill_detail'),
    path('worker-skills/<str:username>/', WorkerSkillViewSet.as_view({'get': 'list', 'post': 'create'}), name='worker_skills'),
    path('worker-skills/<str:username>/<int:pk>/', WorkerSkillViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='worker_skill_detail'),
]
