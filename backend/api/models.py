from django.db import models
from django.contrib.auth.models import AbstractUser

# User Model
class User(AbstractUser):
    WORKER = 'worker'
    EMPLOYER = 'employer'
    ROLE_CHOICES = [
        (WORKER, 'Worker'),
        (EMPLOYER, 'Employer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=WORKER)

    def __str__(self):
        return self.username

# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

# WorkerProfile Model
class WorkerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile')
    available_time = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=10, decimal_places=2)

# Skill Model
class Skill(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    level = models.CharField(max_length=50)

# WorkerSkill Model (Junction Table for Many to Many relationships)
class WorkerSkill(models.Model):
    worker_profile = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

# EmployerProfile Model
class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')

# Contract Model
class Contract(models.Model):
    worker_profile = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE)
    employer_profile = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    COMPLETED = 'completed'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (COMPLETED, 'Completed'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    review = models.TextField(blank=True, null=True)

    class Meta:
        # To ensure that a worker cannot have multiple contracts at the same time
        constraints = [
            models.CheckConstraint(check=models.Q(start_time__lt=models.F('end_time')), name='start_time_before_end_time'),
        ]
