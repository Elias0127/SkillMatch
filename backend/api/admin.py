from django.contrib import admin
from .models import User, Profile, WorkerProfile, Skill, WorkerSkill, EmployerProfile, Contract

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(WorkerProfile)
admin.site.register(Skill)
admin.site.register(WorkerSkill)
admin.site.register(EmployerProfile)
admin.site.register(Contract)
