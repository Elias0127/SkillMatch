from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import Group, Permission

# User Model
class User(AbstractUser):
    WORKER = 'worker'
    EMPLOYER = 'employer'
    ROLE_CHOICES = [
        (WORKER, 'Worker'),
        (EMPLOYER, 'Employer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=WORKER)

    # Add related_name in groups and user_permissions with a unique format
    groups = models.ManyToManyField(
        Group,
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="%(app_label)s_%(class)s_groups",
        related_query_name="%(app_label)s_user",
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="%(app_label)s_%(class)s_user_permissions",
        related_query_name="%(app_label)s_user",
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username

# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return self.user.username

# WorkerProfile Model
class WorkerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile')
    available_time = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    rate_type = models.CharField(max_length=10, choices=[(
        'fixed', 'Fixed'), ('per_hour', 'Per Hour'), ('negotiable', 'Negotiable')], default='fixed')
    rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

# EmployerProfile Model
class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

# Skill Model
class Skill(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    level = models.CharField(max_length=50)

# WorkerSkill Model (Junction Table for Many to Many relationships)
class WorkerSkill(models.Model):
    worker_profile = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

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

class JobPost(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)
    employer = models.ForeignKey(User, related_name='job_posts', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
