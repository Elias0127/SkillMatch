from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, ProfileSerializer, WorkerProfileSerializer, EmployerProfileSerializer
from rest_framework.permissions import AllowAny
from .permissions import IsOwnerOrReadOnly, IsWorkerAndOwner, IsEmployerAndOwner
from .models import Profile, WorkerProfile, EmployerProfile
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


import logging
logger = logging.getLogger('api')

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except InvalidToken:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

