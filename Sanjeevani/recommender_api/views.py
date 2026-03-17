from google import genai
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate 
from django.db.models import Count

# Models and Serializers
from .models import Disease, Symptom, UserProfile, UserHealthLog
from .serializers import (
    DiseaseSerializer, 
    SymptomSerializer, 
    UserProfileSerializer, 
    UserHealthLogSerializer
)

# --- REGISTRATION & LOGIN ---
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        username, email, password = data.get('username'), data.get('email'), data.get('password')
        age, gender = data.get('age'), data.get('gender')

        if not all([username, email, password]):
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if User.objects.filter(username=username).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create_user(username=username, email=email, password=password)
            UserProfile.objects.create(user=user, age=age, gender=gender)
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        username, password = request.data.get('username'), request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            return Response({
                "token": "sanjeevani-session-2026", 
                "username": user.username,
                "message": f"Welcome back, {user.username}!"
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# --- PROFILE & HISTORY MANAGEMENT ---
class GetProfileView(APIView):
    def get(self, request):
        username = request.query_params.get('username')
        try:
            user = User.objects.get(username=username)
            profile, _ = UserProfile.objects.get_or_create(user=user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdatePrakritiView(APIView):
    def post(self, request):
        username, result_dosha = request.data.get('username'), request.data.get('prakriti')
        try:
            profile = UserProfile.objects.get(user__username=username)
            profile.prakriti = result_dosha
            profile.save()
            return Response({"message": f"Updated to {result_dosha}"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Profile update failed"}, status=status.HTTP_400_BAD_REQUEST)

class HealthHistoryView(APIView):
    def get(self, request):
        username = request.query_params.get('username')
        try:
            logs = UserHealthLog.objects.filter(user__username=username).order_by('-timestamp')[:10]
            serializer = UserHealthLogSerializer(logs, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- INTELLIGENT CHATBOT (Sanjeevani AI) ---
class ChatBotView(APIView):
    def post(self, request):
        user_query = request.data.get('message', '')
        username = request.data.get('username', '') 
        
        user_context = "User is a guest."
        try:
            if username:
                profile = UserProfile.objects.get(user__username=username)
                user_context = f"User: {username}, Age: {profile.age}, Dosha: {profile.prakriti or 'General'}."
        except Exception:
            pass

        try:
            # ✅ THE FIX: Let the SDK handle routing naturally, no strict v1 dict
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            system_instruction = (
                f"You are Sanjeevani AI, an expert Ayurvedic health consultant. {user_context} "
                "Provide health advice based on Ayurvedic herbs and lifestyle. "
                "Keep responses structured with bullet points and end with a medical disclaimer."
            )

            # ✅ MULTI-MODEL STACK: Tries stable -latest aliases to bypass registry errors
            try:
                # Primary model
                response = client.models.generate_content(
                    model='gemini-2.5-flash', 
                    contents=f"{system_instruction}\n\nUser Question: {user_query}"
                )
            except Exception as inner_e:
                print(f"DEBUG - Primary Model Failed: {str(inner_e)}")
                # Reliable fallback to the flash-latest alias
                response = client.models.generate_content(
                    model='gemini-1.5-flash-latest', 
                    contents=f"{system_instruction}\n\nUser Question: {user_query}"
                )
            
            return Response({"response": response.text}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"DEBUG - Chat Error: {str(e)}")
            return Response({
                "response": "Namaste. I am having trouble connecting to the Vedic records. Please check your internet and try again."
            }, status=status.HTTP_200_OK)

# --- PREDICTION ENGINE & KNOWLEDGE BASE ---
class PredictionView(APIView):
    def post(self, request):
        symptom_names = request.data.get('symptom_names', [])
        username = request.data.get('username')
        
        if not symptom_names:
            return Response({"predictions": []})
        
        matched_diseases = Disease.objects.filter(symptoms__name__in=symptom_names).distinct()
        predictions = []

        for disease in matched_diseases:
            disease_symptoms = list(disease.symptoms.values_list('name', flat=True))
            common_matches = set(symptom_names) & set(disease_symptoms)
            match_count = len(common_matches)
            score = (match_count / len(disease_symptoms)) * 100
            
            serializer = DiseaseSerializer(disease)
            disease_data = serializer.data
            disease_data['confidence'] = round(min(score, 99.5), 1)
            disease_data['match_count'] = match_count
            predictions.append(disease_data)

        predictions = sorted(predictions, key=lambda x: x['confidence'], reverse=True)

        if username and predictions:
            try:
                user = User.objects.get(username=username)
                profile, _ = UserProfile.objects.get_or_create(user=user)
                top = predictions[0]
                UserHealthLog.objects.create(
                    user=user, detected_disease=top['name'],
                    confidence=top['confidence'], dosha_at_time=profile.prakriti,
                    input_symptoms=", ".join(symptom_names)
                )
            except Exception as e:
                print(f"Logging Error: {e}")

        return Response({"predictions": predictions})

class SymptomListView(APIView):
    def get(self, request):
        symptoms = Symptom.objects.all().order_by('name')
        return Response(SymptomSerializer(symptoms, many=True).data)

class DiseaseDetailView(APIView):
    def get(self, request, pk):
        try:
            disease = Disease.objects.get(pk=pk)
            return Response(DiseaseSerializer(disease).data, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

# --- PERSONALIZED PLANS ---
class GetAyurvedicPlanView(APIView):
    def get(self, request):
        username, plan_type = request.query_params.get('username'), request.query_params.get('type', 'diet')
        try:
            profile = UserProfile.objects.get(user__username=username)
            
            # ✅ THE FIX: Removed hardcoded v1 here as well
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            prompt = f"Create a detailed Ayurvedic {plan_type} for a person with {profile.prakriti or 'General'} prakriti."
            
            # Using the stable -latest identifier
            response = client.models.generate_content(model='gemini-1.5-flash-latest', contents=prompt)
            return Response({"dosha": profile.prakriti, "plan": response.text}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"DEBUG - Plan Generation Error: {str(e)}")
            return Response({"error": "Plan generation failed"}, status=status.HTTP_404_NOT_FOUND)

# --- ADMIN ANALYTICS ---
class AdminStatsView(APIView):
    def get(self, request):
        try:
            dosha_counts = UserProfile.objects.values('prakriti').annotate(count=Count('prakriti'))
            total_users = User.objects.count()
            return Response({
                "total_users": total_users,
                "dosha_distribution": list(dosha_counts)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)