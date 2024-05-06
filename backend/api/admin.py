from django.contrib import admin
from django.utils.html import mark_safe  # Allows safe HTML rendering
from .models import User, Profile, WorkerProfile, Skill, WorkerSkill, EmployerProfile, Contract, JobPost

# Custom admin for the Profile model to show pictures
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'picture_preview')
    readonly_fields = ('picture_preview',)

    def picture_preview(self, obj):
        if obj.picture:
            return mark_safe(f'<img src="{obj.picture.url}" width="150" />')
        return "No Image Uploaded"
    picture_preview.short_description = "Picture Preview"


# Register models
admin.site.register(User)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(WorkerProfile)
admin.site.register(Skill)
admin.site.register(WorkerSkill)
admin.site.register(EmployerProfile)
admin.site.register(Contract)
admin.site.register(JobPost)
