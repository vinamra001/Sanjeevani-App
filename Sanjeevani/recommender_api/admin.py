from django.contrib import admin
from .models import Symptom, Disease, Remedy, UserHealthLog

# Register your models here.
admin.site.register(Symptom)
admin.site.register(Remedy)
admin.site.register(Disease)
admin.site.register(UserHealthLog)