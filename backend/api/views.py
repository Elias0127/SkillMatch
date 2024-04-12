from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, ProfileSerializer, WorkerProfileSerializer, EmployerProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly, IsWorkerAndOwner, IsEmployerAndOwner
from .models import User, Profile, WorkerProfile, EmployerProfile
from django.shortcuts import get_object_or_404



class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        """
        Override the default get_object method to retrieve the profile
        based on the username passed in the URL.
        """
        username = self.kwargs.get('username')
        return get_object_or_404(Profile, user__username=username)


class WorkerProfileView(generics.RetrieveUpdateAPIView):
    queryset = WorkerProfile.objects.all()
    serializer_class = WorkerProfileSerializer
    lookup_field = 'user__username'
    permission_classes = [IsWorkerAndOwner]


class EmployerProfileView(generics.RetrieveUpdateAPIView):
    queryset = EmployerProfile.objects.all()
    serializer_class = EmployerProfileSerializer
    lookup_field = 'user__username'
    permission_classes = [IsEmployerAndOwner]

