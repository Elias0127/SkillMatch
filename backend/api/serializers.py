from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, WorkerProfile, EmployerProfile, WorkerSkill, Skill
from django.db import transaction
from django.contrib.gis.geos import Point
import logging


User = get_user_model()
logger = logging.getLogger(__name__)



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'role']

    
    # Function to validate if username is unique or not
    '''
    def validate_username(self):

        # data from the form is fetched using super function
        # super(UserRegistrationSerializer, self).clean()

        # extract the username field from the data
        username = self.cleaned_data.get('username')
        
        # check username length
        if len(username) < 4:
            self._errors['username'] = self.error_class([
                'Username is not unique'])
        
        # return any errors if found
        return self.cleaned_data
    '''
    # Automatically create a profile for the user depending on the role user selected
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        if user.role == User.WORKER:
            WorkerProfile.objects.create(user=user)
        elif user.role == User.EMPLOYER:
            EmployerProfile.objects.create(user=user)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ['phone_number', 'picture', 'user']

    def update(self, instance, validated_data):
        print("Updating profile with:", validated_data)
        user_data = validated_data.pop('user', None)
        if user_data:
            print("Updating user with:", user_data)
            user_instance = instance.user
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
                print(f"Set {attr} to {value} for user.")

        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.picture = validated_data.get('picture', instance.picture)
        print(f"Set phone_number to {instance.phone_number}, picture to {instance.picture}")

        try:
            with transaction.atomic():
                user_instance.save()
                instance.save()
            print("Save successful!")
        except Exception as e:
            print("Save failed:", str(e))
            raise serializers.ValidationError("Update failed due to an error: " + str(e))

        return instance


class WorkerProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    phone_number = serializers.CharField(source='user.profile.phone_number', required=False)
    picture = serializers.ImageField(source='user.profile.picture', required=False)
    available_time = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    rate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    latitude = serializers.FloatField(write_only=True, required=False, allow_null=True)
    longitude = serializers.FloatField(write_only=True, required=False, allow_null=True)
    distance = serializers.FloatField(read_only=True, source='distance.km')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        profile_data = user_data.pop('profile', {}) if 'profile' in user_data else {}

        # Update user fields
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)

        # Update profile fields
        if profile_data:
            for attr, value in profile_data.items():
                setattr(instance.user.profile, attr, value)

        # Handling geographic location update
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)
        if latitude is not None and longitude is not None:
            instance.location = Point(float(longitude), float(latitude), srid=4326)

        # Save all changes within a transaction
        with transaction.atomic():
            instance.user.save()
            instance.user.profile.save()
            instance.save()

        return instance

    class Meta:
        model = WorkerProfile
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'picture', 'available_time', 'location', 'rate', 'rate_type', 'latitude', 'longitude', 'distance']


class EmployerProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source='user.profile', required=False)
    latitude = serializers.FloatField(write_only=True, required=False, allow_null=True)
    longitude = serializers.FloatField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = EmployerProfile
        fields = ['profile', 'company_name', 'industry', 'description', 'latitude', 'longitude']

    def update(self, instance, validated_data):
        # Nested 'profile' under 'user'
        user_data = validated_data.pop('user', {})
        profile_data = user_data.get('profile', {})
        
        # Update profile data
        profile_serializer = ProfileSerializer(instance.user.profile, data=profile_data, partial=True)
        if profile_serializer.is_valid(raise_exception=True):
            profile_serializer.save()

        # Handle latitude and longitude for location
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)

        if latitude is not None and longitude is not None:
            try:
                instance.location = Point(float(longitude), float(latitude), srid=4326)
                logger.debug(f"Point created successfully: {instance.location.wkt}")
            except Exception as e:
                logger.error(f"Error creating Point: {e}")
                raise serializers.ValidationError(f"Error creating Point: {str(e)}")

        # Update company details
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.industry = validated_data.get('industry', instance.industry)
        instance.description = validated_data.get('description', instance.description)

        try:
            with transaction.atomic():
                instance.user.profile.save()  # Save changes in Profile
                instance.save()  # Save changes in EmployerProfile
            logger.debug("Profile and EmployerProfile updated and saved.")
        except Exception as e:
            logger.error(f"Error saving EmployerProfile or Profile: {e}")
            raise serializers.ValidationError("Update failed due to an error: " + str(e))

        return instance


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name', 'description', 'level']

class WorkerSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer()

    class Meta:
        model = WorkerSkill
        fields = ['id', 'skill']

    def create(self, validated_data):
        skill_data = validated_data.pop('skill')
        skill, created = Skill.objects.get_or_create(**skill_data)
        worker_skill = WorkerSkill.objects.create(skill=skill, **validated_data)
        return worker_skill

    def update(self, instance, validated_data):
        skill_data = validated_data.pop('skill', {})
        skill = instance.skill
        skill.name = skill_data.get('name', skill.name)
        skill.description = skill_data.get('description', skill.description)
        skill.level = skill_data.get('level', skill.level)
        skill.save()
        return instance