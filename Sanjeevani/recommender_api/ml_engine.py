import pandas as pd
import numpy as np
import joblib
import os
from .models import Symptom, Disease
from sklearn.ensemble import RandomForestClassifier

class AyurvedicML:
    def __init__(self):
        self.model_path = 'ayurveda_model.pkl'
        self.model = None
        # Use Symptom NAMES for consistent vectorization instead of IDs
        # We sort them to ensure the column order never changes
        self.symptom_list = list(
            Symptom.objects.all().values_list('name', flat=True).order_by('name')
        )

    def format_name(self, name):
        """Helper to convert 'High Fever' to 'high_fever'"""
        return name.lower().replace(" ", "_").strip()

    def generate_training_data(self):
        """
        Creates a synthetic training dataset based on Disease-Symptom 
        relationships defined in your MongoDB.
        """
        data = []
        diseases = Disease.objects.all()
        
        if not diseases.exists():
            print("⚠️ No disease data found in MongoDB to train on.")
            return pd.DataFrame()

        # Create normalized column headers
        all_features = [self.format_name(name) for name in self.symptom_list]

        for disease in diseases:
            # Get real symptom names associated with this disease
            real_symptoms = [self.format_name(s.name) for s in disease.symptoms.all()]
            
            if not real_symptoms:
                continue

            # Create 50 synthetic patient profiles per disease
            for _ in range(50):
                row = {feat: 0 for feat in all_features}
                
                # Randomly select a subset (80-100%) of symptoms to simulate variation
                num_to_pick = np.random.randint(max(1, int(len(real_symptoms)*0.8)), len(real_symptoms)+1)
                selected = np.random.choice(real_symptoms, min(num_to_pick, len(real_symptoms)), replace=False)
                
                for feat in selected:
                    if feat in row:
                        row[feat] = 1
                    
                row['target_disease'] = str(disease.id)
                data.append(row)
        
        return pd.DataFrame(data)

    def train(self):
        """Trains the Random Forest model and saves it to disk."""
        df = self.generate_training_data()
        if df.empty:
            print("❌ Training failed: No data available.")
            return

        X = df.drop('target_disease', axis=1)
        y = df['target_disease']
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        joblib.dump(self.model, self.model_path)
        print(f"✅ ML Model Trained successfully on {len(df)} records.")

    def predict(self, input_symptom_names):
        """
        Receives symptom names from frontend, converts to vector, 
        and returns top 3 disease probabilities.
        """
        if not self.model:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            else:
                self.train()

        # 1. Normalize input names from mobile
        formatted_inputs = [self.format_name(name) for name in input_symptom_names]
        
        # 2. Create the binary vector matching the trained feature order
        all_features = [self.format_name(name) for name in self.symptom_list]
        input_vector = [1 if feat in formatted_inputs else 0 for feat in all_features]
        
        # --- CRITICAL DEBUG LOGS ---
        print("\n=== ML PREDICTION DEBUG ===")
        print(f"Names from Mobile: {input_symptom_names}")
        print(f"Normalized Inputs: {formatted_inputs}")
        print(f"Vector Sum: {sum(input_vector)}")
        
        if sum(input_vector) == 0:
            print("❌ ERROR: Vector is all ZEROS. Input names don't match Database names.")
        # ---------------------------

        # 3. Predict probabilities
        probabilities = self.model.predict_proba([input_vector])[0]
        results = zip(self.model.classes_, probabilities)
        
        return sorted(results, key=lambda x: x[1], reverse=True)[:3]

    def get_relevant_context(self, query):
        """RAG-Lite Knowledge Retriever for Chatbot."""
        keywords = query.split()
        context = ""
        
        if keywords:
            related_diseases = Disease.objects.filter(name__icontains=keywords[0])[:1]
            for d in related_diseases:
                remedies_list = ", ".join([r.name for r in d.remedies.all()])
                context += (
                    f"Knowledge for '{d.name}': "
                    f"Dosha: {d.dosha_type}. "
                    f"Remedies: {remedies_list}. "
                    f"Diet: {d.diet_plan}. "
                )
        return context if context else "Apply general Ayurvedic principles."