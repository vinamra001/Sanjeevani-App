import os
import django

# 1. Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AyurRecSys.settings')
django.setup()

from recommender_api.models import Disease, Symptom, Remedy

def populate():
    print("--- 🔄 Synchronizing MongoDB with Ayurvedic Knowledge Base ---")

    # Clear existing data to prevent duplicates and ensure clean matching
    # Note: Use this during development to reset schema changes
    print("🧹 Cleaning old records...")
    Disease.objects.all().delete()
    Symptom.objects.all().delete()
    Remedy.objects.all().delete()

    # 2. Define the Symptoms (Must match Frontend Button Labels exactly)
    symptoms_list = [
        "Itching", "Skin Rash", "Nodal Skin Eruptions", "Continuous Sneezing",
        "Shivering", "Chills", "Stomach Pain", "Acidity", "Ulcers on Tongue",
        "Vomiting", "Fatigue", "Weight Loss", "High Fever"
    ]
    
    symptom_objs = {}
    for name in symptoms_list:
        s_obj, created = Symptom.objects.get_or_create(name=name)
        symptom_objs[name] = s_obj
    print(f"✅ Synced {len(symptom_objs)} Symptoms.")

    # 3. Define the Remedies
    remedies_data = [
        {
            "name": "Neem and Turmeric Paste",
            "sanskrit_name": "Nimba-Haridra Lepa",
            "preparation": "Grind fresh Neem leaves with 1 tsp of turmeric powder.",
            "usage_instructions": "Apply to skin and wash after 20 mins.",
            "dosage": "Apply 2 times daily"
        },
        {
            "name": "Ginger and Tulsi Tea",
            "sanskrit_name": "Ardraka-Tulsi Kwath",
            "preparation": "Boil crushed ginger and Tulsi leaves in water.",
            "usage_instructions": "Sip slowly while warm.",
            "dosage": "Drink 3 times daily"
        }
    ]

    remedy_objs = {}
    for r in remedies_data:
        r_obj, created = Remedy.objects.get_or_create(**r)
        remedy_objs[r['name']] = r_obj
    print(f"✅ Synced {len(remedy_objs)} Remedies.")

    # 4. Create Diseases and Fetch Links from MongoDB
    # This structure links everything together so the API can find it
    diseases_to_create = [
        {
            "name": "Fungal Infection",
            "sanskrit_name": "Kushtha",
            "description": "Fungal growth on skin causing irritation.",
            "dosha": "Kapha-Pitta",
            "symptoms": ["Itching", "Skin Rash", "Nodal Skin Eruptions"],
            "remedies": ["Neem and Turmeric Paste"]
        },
        {
            "name": "Common Cold",
            "sanskrit_name": "Pratishyaya",
            "description": "Viral upper respiratory infection.",
            "dosha": "Kapha-Vata",
            "symptoms": ["Continuous Sneezing", "Shivering", "Chills", "Fatigue"],
            "remedies": ["Ginger and Tulsi Tea"]
        }
    ]

    for d_data in diseases_to_create:
        disease = Disease.objects.create(
            name=d_data["name"],
            sanskrit_name=d_data["sanskrit_name"],
            description=d_data["description"],
            dosha_type=d_data["dosha"]
        )
        # Link Symptoms dynamically
        for s_name in d_data["symptoms"]:
            disease.symptoms.add(symptom_objs[s_name])
        
        # Link Remedies dynamically
        for r_name in d_data["remedies"]:
            disease.remedies.add(remedy_objs[r_name])
            
        print(f"🔗 Linked {d_data['name']} with its symptoms and remedies.")

    print("\n🚀 SUCCESS: MongoDB is now fully populated and linked!")

if __name__ == "__main__":
    populate()