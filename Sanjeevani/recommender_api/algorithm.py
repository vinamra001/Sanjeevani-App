import numpy as np
from .ml_engine import AyurvedicML
from .models import Disease, UserHealthLog

def calculate_prediction(symptom_names, patient_dosha, user=None):
    """
    Receives symptom names (formatted as lowercase_with_underscores),
    calculates ML probability, adjusts scores based on Dosha and History,
    and returns a structured hybrid recommendation.
    """
    ml_engine = AyurvedicML()
    
    # Update: Passing symptom_names instead of IDs to the engine
    ml_predictions = ml_engine.predict(symptom_names)
    
    past_detected_names = []
    if user and not user.is_anonymous:
        past_detected_names = list(
            UserHealthLog.objects.filter(user=user)
            .values_list('detected_disease', flat=True)[:3]
        )

    hybrid_recommendations = []

    for disease_id, ml_prob in ml_predictions:
        try:
            # disease_id here is the string ID stored in MongoDB
            disease = Disease.objects.get(id=disease_id)
            db_dosha = getattr(disease, 'dosha_type', getattr(disease, 'dosha', 'Tridoshic'))
            
            # --- HYBRID SCORING LOGIC ---
            # 1. Base ML Probability (60% weight)
            score = float(ml_prob) * 0.6
            
            # 2. Dosha Alignment (Up to 30% bonus)
            if str(db_dosha).lower() == str(patient_dosha).lower():
                score += 0.3
            elif str(db_dosha).lower() == "tridoshic":
                score += 0.15
            
            # 3. Recurring History (10% bonus)
            is_recurring = False
            if disease.name in past_detected_names:
                score += 0.1
                is_recurring = True
            
            # Calculate final percentage cap at 99.9%
            confidence_percentage = min(round(score * 100, 2), 99.9)

            # --- LOGGING TO DATABASE ---
            if user and not user.is_anonymous:
                UserHealthLog.objects.create(
                    user=user,
                    detected_disease=disease.name,
                    confidence=confidence_percentage,
                    dosha_at_time=patient_dosha,
                    input_symptoms=str(symptom_names) # Storing names for record
                )

            # --- REMEDY & DATA FETCHING ---
            remedies_data = []
            if hasattr(disease, 'remedies'):
                for r in disease.remedies.all():
                    remedies_data.append({
                        "title": getattr(r, 'name', 'Unnamed Remedy'),
                        "description": getattr(r, 'description', 'No description available.')
                    })

            hybrid_recommendations.append({
                "disease_id": str(disease.id),
                "disease_name": getattr(disease, 'name', 'Unknown Disease'),
                "confidence": confidence_percentage,
                "is_recurring": is_recurring,
                "dosha_match": db_dosha,
                "remedies": remedies_data,
                "diet_plan": getattr(disease, 'diet_plan', "Maintain a balanced Ayurvedic diet.")
            })
            
        except Disease.DoesNotExist:
            continue

    # Sort results so the highest confidence appears first for ResultsScreen.js
    return sorted(hybrid_recommendations, key=lambda x: x['confidence'], reverse=True)