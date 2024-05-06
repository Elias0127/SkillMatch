from django.contrib.auth import authenticate, get_user_model
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsEmployer
from .models import Contract, Profile, Skill, WorkerProfile, EmployerProfile, WorkerSkill
from .serializers import ContractSerializer, SkillSerializer, UserRegistrationSerializer, ProfileSerializer, WorkerProfileSerializer, EmployerProfileSerializer, WorkerSkillSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from tokenize import TokenError
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.gis.measure import D  # Distance measurement
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point



# User Registration
class UserRegistrationView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            user = get_user_model().objects.get(
                username=response.data['username'])
            refresh = RefreshToken.for_user(user)
            return Response({
                'username': user.username,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return response


# Login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': user.role
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# Logout
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token is None:
                return Response({'error': 'Refresh token is missing'}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            try:
                token.blacklist()
            except TokenError as e:
                # Handle already blacklisted token
                return Response({'error': str(e)}, status=status.HTTP_409_CONFLICT)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# General Profile Management
class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Profile, user__username=self.kwargs['username'])


# Worker Profile Management
class WorkerProfileView(generics.RetrieveUpdateAPIView):
    queryset = WorkerProfile.objects.all()
    serializer_class = WorkerProfileSerializer
    lookup_field = 'user__username'
    permission_classes = [permissions.IsAuthenticated]
    # Allow the view to handle FormData including files
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_object(self):
        return get_object_or_404(WorkerProfile, user__username=self.kwargs['username'])


# Employer Profile Management
class EmployerProfileView(generics.RetrieveUpdateAPIView):
    queryset = EmployerProfile.objects.all()
    serializer_class = EmployerProfileSerializer
    lookup_field = 'user__username'
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(EmployerProfile, user__username=self.kwargs['username'])


class NearbyWorkersView(generics.ListAPIView):
    serializer_class = WorkerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Setup to find nearby workers using geographic coordinates and radius
        latitude = float(self.request.query_params.get('latitude', 0))
        longitude = float(self.request.query_params.get('longitude', 0))
        radius = float(self.request.query_params.get(
            'radius', 5))  # Default radius 5 km

        employer_location = Point(longitude, latitude, srid=4326)
        radius = D(km=radius)

        # Find nearby workers and order by distance
        return WorkerProfile.objects.annotate(
            distance=Distance('location', employer_location)
        ).filter(distance__lte=radius).order_by('distance')


# View for managing skills (Admin level)
class SkillListView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAdminUser]

class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAdminUser]

# Views for managing WorkerSkill
class WorkerSkillViewSet(viewsets.ModelViewSet):
    serializer_class = WorkerSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs.get('username')
        if not username:
            # Handle the case where username is not provided
            raise Http404("Username not provided")

        try:
            user = get_user_model().objects.get(username=username)
            return WorkerSkill.objects.filter(worker_profile__user=user)
        except get_user_model().DoesNotExist:
            # Handle the case where user does not exist
            raise Http404("User does not exist")


    def create(self, request, *args, **kwargs):
        username = self.kwargs['username']
        user = get_user_model().objects.get(username=username)
        worker_profile = WorkerProfile.objects.get(user=user)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            worker_skill = serializer.save(worker_profile=worker_profile)
            return Response(WorkerSkillSerializer(worker_skill).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUES)
        
class CreateContractView(generics.CreateAPIView):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployer]

    def post(self, request, *args, **kwargs):
        # Assume that the request includes worker_profile_id and other necessary details
        worker_profile_id = request.data.get('worker_profile_id')
        employer_profile = EmployerProfile.objects.get(user=request.user)

        # You might want to validate that the employer can indeed hire the worker (e.g., check if the worker is available)
        worker_profile = WorkerProfile.objects.get(pk=worker_profile_id)

        # Create the contract
        contract = Contract.objects.create(
            worker_profile=worker_profile,
            employer_profile=employer_profile,
            start_time=timezone.now(),  # Example, you might want to get this from request
            end_time=timezone.now() + timezone.timedelta(days=1),  # Example end time
            status=Contract.PENDING
        )

        return Response({
            "message": "Contract created successfully",
            "contract": ContractSerializer(contract).data
        }, status=status.HTTP_201_CREATED)
