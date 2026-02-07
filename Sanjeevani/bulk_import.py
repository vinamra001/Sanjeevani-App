import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AyurRecSys.settings')
django.setup()

from recommender_api.models import Symptom, Disease, Remedy

def bulk_ingest():
    # Complete Dataset: 30 Diseases, Symptoms, and Remedies
    data = {
        "Asthma": {
            "dosha": "Kapha",
            "symptoms": ["Shortness of breath", "Wheezing", "Chest tightness"],
            "remedy": {"title": "Licorice Ginger Tea", "cat": "Herbal", "det": "Boil 1/2 tsp licorice and 1/2 tsp ginger in water."}
        },
        "Arthritis": {
            "dosha": "Vata",
            "symptoms": ["Joint pain", "Stiffness", "Swelling"],
            "remedy": {"title": "Warm Sesame Oil Massage", "cat": "Lifestyle", "det": "Apply warm sesame oil to joints every morning."}
        },
        "Gastritis": {
            "dosha": "Pitta",
            "symptoms": ["Burning sensation", "Nausea", "Indigestion"],
            "remedy": {"title": "Aloe Vera Cooling Therapy", "cat": "Dietary", "det": "Drink 1/4 cup of pure Aloe Vera juice twice daily."}
        },
        "Anxiety": {
            "dosha": "Vata",
            "symptoms": ["Restlessness", "Insomnia", "Fear"],
            "remedy": {"title": "Ashwagandha Milk", "cat": "Herbal", "det": "Take 1 tsp Ashwagandha powder in warm milk at night."}
        },
        "Hypertension": {
            "dosha": "Pitta",
            "symptoms": ["Dizziness", "Headache", "Heart palpitations"],
            "remedy": {"title": "Garlic Milk Decoction", "cat": "Dietary", "det": "Boil 1 crushed garlic clove in 1/2 cup milk and 1/2 cup water."}
        },
        "Diabetes Type 2": {
            "dosha": "Kapha",
            "symptoms": ["Frequent urination", "Excessive thirst", "Fatigue"],
            "remedy": {"title": "Turmeric and Amla mix", "cat": "Herbal", "det": "Mix 1 tsp Turmeric with 1 tsp Amla powder daily."}
        },
        "Common Cold": {
            "dosha": "Kapha",
            "symptoms": ["Runny nose", "Congestion", "Sneezing"],
            "remedy": {"title": "Ginger Tulsi Tea", "cat": "Herbal", "det": "Boil fresh ginger and 5-10 Tulsi leaves in water."}
        },
        "Constipation": {
            "dosha": "Vata",
            "symptoms": ["Bloating", "Hard stools", "Straining"],
            "remedy": {"title": "Triphala Powder", "cat": "Herbal", "det": "Take 1 tsp Triphala powder with warm water before sleep."}
        },
        "Migraine": {
            "dosha": "Pitta",
            "symptoms": ["Severe headache", "Sensitivity to light", "Nausea"],
            "remedy": {"title": "Brahmi Ghee Nasya", "cat": "Lifestyle", "det": "Put 2 drops of warm Brahmi ghee in each nostril."}
        },
        "Eczema": {
            "dosha": "Pitta",
            "symptoms": ["Itchy skin", "Red patches", "Inflammation"],
            "remedy": {"title": "Neem Oil Application", "cat": "Lifestyle", "det": "Apply Neem oil to affected areas 2-3 times daily."}
        },
        "Psoriasis": {
            "dosha": "Vata-Kapha",
            "symptoms": ["Scaly skin", "Dryness", "Thick patches"],
            "remedy": {"title": "Coconut Neem Blend", "cat": "Lifestyle", "det": "Mix Coconut oil with Neem and apply after bathing."}
        },
        "IBS": {
            "dosha": "Vata",
            "symptoms": ["Diarrhea", "Abdominal cramps", "Gas"],
            "remedy": {"title": "Buttermilk with Cumin", "cat": "Dietary", "det": "Drink fresh buttermilk with roasted cumin powder after lunch."}
        },
        "Anemia": {
            "dosha": "Pitta",
            "symptoms": ["Pale skin", "Weakness", "Dizziness"],
            "remedy": {"title": "Pomegranate Juice", "cat": "Dietary", "det": "Drink 1 glass of fresh Pomegranate juice daily with a pinch of black pepper."}
        },
        "Obesity": {
            "dosha": "Kapha",
            "symptoms": ["Excessive weight", "Lethargy", "Slow metabolism"],
            "remedy": {"title": "Honey Cinnamon Water", "cat": "Dietary", "det": "1 tsp honey and a pinch of cinnamon in warm water every morning."}
        },
        "Insomnia": {
            "dosha": "Vata",
            "symptoms": ["Difficulty falling asleep", "Mental exhaustion", "Irritability"],
            "remedy": {"title": "Nutmeg Milk", "cat": "Dietary", "det": "Add a pinch of nutmeg powder to warm milk before bed."}
        },
        "Hyperacidity": {
            "dosha": "Pitta",
            "symptoms": ["Heartburn", "Acid reflux", "Sour taste"],
            "remedy": {"title": "Fennel Water", "cat": "Dietary", "det": "Soak 1 tsp fennel seeds in water overnight and drink in the morning."}
        },
        "Sciatica": {
            "dosha": "Vata",
            "symptoms": ["Lower back pain", "Leg numbness", "Burning leg sensation"],
            "remedy": {"title": "Garlic Milk", "cat": "Dietary", "det": "Take 4 cloves of garlic boiled in milk daily."}
        },
        "Bronchitis": {
            "dosha": "Kapha",
            "symptoms": ["Persistent cough", "Mucus", "Chest discomfort"],
            "remedy": {"title": "Turmeric Honey Paste", "cat": "Herbal", "det": "Mix 1/2 tsp turmeric with 1 tsp honey and take 3 times daily."}
        },
        "Sinusitis": {
            "dosha": "Kapha",
            "symptoms": ["Facial pressure", "Loss of smell", "Thick discharge"],
            "remedy": {"title": "Eucalyptus Steam", "cat": "Lifestyle", "det": "Inhale steam with 2 drops of Eucalyptus oil."}
        },
        "Chronic Fatigue": {
            "dosha": "Vata-Kapha",
            "symptoms": ["Unexplained exhaustion", "Muscle pain", "Brain fog"],
            "remedy": {"title": "Chyawanprash Tonic", "cat": "Dietary", "det": "Take 1 tsp of Chyawanprash twice daily with warm water."}
        },
        "Hemorrhoids": {
            "dosha": "Pitta-Vata",
            "symptoms": ["Rectal bleeding", "Anal itching", "Pain during movements"],
            "remedy": {"title": "Castor Oil Therapy", "cat": "Lifestyle", "det": "Apply castor oil locally for lubrication and cooling."}
        },
        "Fever": {
            "dosha": "Pitta",
            "symptoms": ["Body temperature", "Chills", "Loss of appetite"],
            "remedy": {"title": "Coriander Sandalwood Drink", "cat": "Dietary", "det": "Mix coriander powder and sandalwood powder in water."}
        },
        "Thyroid Issue": {
            "dosha": "Kapha-Vata",
            "symptoms": ["Weight changes", "Mood swings", "Hair loss"],
            "remedy": {"title": "Coriander Seed Water", "cat": "Dietary", "det": "Drink water soaked with coriander seeds overnight."}
        },
        "Dermatitis": {
            "dosha": "Pitta",
            "symptoms": ["Skin rash", "Blisters", "Burning skin"],
            "remedy": {"title": "Tikta Ghrita", "cat": "Herbal", "det": "Take 1 tsp of Bitter Ghee on an empty stomach."}
        },
        "UTI": {
            "dosha": "Pitta",
            "symptoms": ["Burning urination", "Cloudy urine", "Pelvic pain"],
            "remedy": {"title": "Cranberry Gokhshura blend", "cat": "Herbal", "det": "Take Gokhshura powder with water or cranberry juice."}
        },
        "Indigestion": {
            "dosha": "Kapha",
            "symptoms": ["Fullness", "Nausea", "Upper abdominal pain"],
            "remedy": {"title": "Trikatu Powder", "cat": "Herbal", "det": "Take a pinch of Trikatu powder with honey before meals."}
        },
        "Vertigo": {
            "dosha": "Vata",
            "symptoms": ["Spinning sensation", "Loss of balance", "Tinnitus"],
            "remedy": {"title": "Sariva Root Tea", "cat": "Herbal", "det": "Drink Sariva root decoction to balance Vata in the ears."}
        },
        "Gout": {
            "dosha": "Vata-Pitta",
            "symptoms": ["Sudden joint pain", "Redness in toe", "Heat in joints"],
            "remedy": {"title": "Guduchi Tea", "cat": "Herbal", "det": "Drink Guduchi (Giloy) juice or tea daily to purify blood."}
        },
        "Allergic Rhinitis": {
            "dosha": "Kapha",
            "symptoms": ["Watery eyes", "Itchy nose", "Constant sneezing"],
            "remedy": {"title": "Anu Taila Nasya", "cat": "Lifestyle", "det": "Daily administration of 2 drops of Anu Taila in each nostril."}
        },
        "Low BP": {
            "dosha": "Vata",
            "symptoms": ["Fainting", "Blurred vision", "Cold skin"],
            "remedy": {"title": "Raisin Water", "cat": "Dietary", "det": "Soak 30 raisins in water overnight and eat them on an empty stomach."}
        }
    }

    print("--- Starting FINAL Bulk Ingestion ---")
    for d_name, info in data.items():
        # 1. Create Disease
        disease, _ = Disease.objects.get_or_create(
            name=d_name, 
            dosha_imbalance=info['dosha'],
            defaults={'description': f"Traditional Ayurvedic treatment for {d_name}."}
        )
        # 2. Add Symptoms
        for s_name in info['symptoms']:
            symptom, _ = Symptom.objects.get_or_create(name=s_name, defaults={'body_system': 'General'})
            disease.symptoms.add(symptom)
        # 3. Add Remedy
        rem = info['remedy']
        remedy, _ = Remedy.objects.get_or_create(
            title=rem['title'],
            defaults={'category': rem['cat'], 'details': rem['det']}
        )
        remedy.treats_diseases.add(disease)
        print(f"[OK] {d_name} synced with Remedy: {rem['title']}")

    print(f"\nCOMPLETED. Total Diseases: {Disease.objects.count()}")

if __name__ == '__main__':
    bulk_ingest()