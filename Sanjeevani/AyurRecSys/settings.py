import os
from pathlib import Path

# 1. BASE PATHS
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. SECURITY
SECRET_KEY = 'django-insecure-^54&77&**gvh6a-1qv)x_6pyb88$j36=ss)xxisjo-0am@d479'
DEBUG = True
ALLOWED_HOSTS = ['10.0.2.2', 'localhost', '127.0.0.1', '*']

# 3. APP DEFINITION
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third Party Apps
    'corsheaders', 
    'rest_framework',
    'rest_framework.authtoken',
    
    # Your App
    'recommender_api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST BE AT TOP
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 4. CORS CONFIGURATION (Crucial for Mobile App Connection)
CORS_ALLOW_ALL_ORIGINS = True 

ROOT_URLCONF = 'AyurRecSys.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'AyurRecSys.wsgi.application'

# 5. DATABASE (MongoDB via Djongo)
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'ayur_online_db',
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'mongodb://localhost:27017/',
        }
    }
}

# 6. AI CONFIGURATION (Gemini)
# We will use the hardcoded key for now to ensure the chatbot is "Online"
GEMINI_API_KEY = 'AIzaSyCBmm5Qtx1CC5DnhE0s3bx4Kp3soAuuUwg'

# 7. OTHER DEFAULTS
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'