from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, WorkerProfile, EmployerProfile, WorkerSkill, Skill

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'role']

    # Automatically create a profile for the user depending on the role user selected
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        if user.role == User.WORKER:
            WorkerProfile.objects.create(user=user)
        elif user.role == User.EMPLOYER:
            EmployerProfile.objects.create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'phone_number', 'picture', 'first_name', 'last_name', 'email']
        extra_kwargs = {'user': {'read_only': True}}


class WorkerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = ['available_time', 'location', 'rate', 'rate_type']


class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = []


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name', 'description', 'level']


class WorkerSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer()
    class Meta:
        model = WorkerSkill
        fields = ['skill']

    def create(self, validated_data):
        skill_data = validated_data.pop('skill')
        skill, created = Skill.objects.get_or_create(**skill_data)
        worker_skill = WorkerSkill.objects.create(
            skill=skill, **validated_data)
        return worker_skill
