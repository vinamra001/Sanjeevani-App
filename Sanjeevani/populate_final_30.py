import os
import django

# 1. SETUP DJANGO ENVIRONMENT
# Ensure this matches the folder name containing your settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AyurRecSys.settings')
django.setup()

# 2. IMPORT MODELS FROM YOUR CORRECT APP NAME
from recommender_api.models import Disease, Symptom, Remedy

def bulk_import():
    print("🌿 Starting Bulk Import of 30 Ayurvedic Conditions into MongoDB...")

    data = [
        # --- DIGESTIVE SYSTEM ---
        {
            "name": "Hyperacidity (Amlapitta)",
            "sanskrit": "अम्लपित्त",
            "dosha": "Pitta",
            "symptoms": ["Acidity", "Indigestion", "Nausea", "Stomach Pain"],
            "diet": "Cooling foods: Coconut water, Pomegranate, Fennel seeds. Avoid: Chilies, Vinegar.",
            "remedy": {"name": "Avipattikar Churna", "dosage": "3g with water", "prep": "Herbal Powder"}
        },
        {
            "name": "Constipation (Vibandha)",
            "sanskrit": "विबन्ध",
            "dosha": "Vata",
            "symptoms": ["Constipation", "Hard Stool", "Bloating"],
            "diet": "Warm soups, high-fiber fruits (Papaya). Avoid: Dry snacks, cold salads.",
            "remedy": {"name": "Triphala Churna", "dosage": "5g at bedtime", "prep": "Powder with warm water"}
        },
        {
            "name": "Diarrhoea (Atisara)",
            "sanskrit": "अतिसार",
            "dosha": "Pitta",
            "symptoms": ["Diarrhoea", "Abdominal Cramps", "Weakness"],
            "diet": "Buttermilk with cumin, Rice water. Avoid: Spicy and oily food.",
            "remedy": {"name": "Kutaj Ghan Vati", "dosage": "2 tablets twice daily", "prep": "Tablet"}
        },
        {
            "name": "Irritable Bowel (Grahani)",
            "sanskrit": "ग्रहणी",
            "dosha": "Tridoshic",
            "symptoms": ["Irregular Bowels", "Mucus in Stool", "Fatigue"],
            "diet": "Takra (Buttermilk) processed with ginger. Avoid: Raw food, leafy greens.",
            "remedy": {"name": "Bilvadi Churna", "dosage": "2g after meals", "prep": "Powder"}
        },
        {
            "name": "Indigestion (Ajirna)",
            "sanskrit": "अजीर्ण",
            "dosha": "Kapha",
            "symptoms": ["Lethargy", "Loss of Appetite", "Heavy Stomach"],
            "diet": "Fast for one meal, ginger-lemon tea. Avoid: Dairy, heavy sweets.",
            "remedy": {"name": "Hingwashtak Churna", "dosage": "1g with first bite of meal", "prep": "Powder with Ghee"}
        },

        # --- RESPIRATORY SYSTEM ---
        {
            "name": "Common Cold (Pratishyaya)",
            "sanskrit": "प्रतिश्याय",
            "dosha": "Kapha",
            "symptoms": ["Continuous Sneezing", "Runny Nose", "Cough", "Phlegm"],
            "diet": "Warm water, Basil tea, Turmeric milk. Avoid: Curd, Cold drinks.",
            "remedy": {"name": "Sitopaladi Churna", "dosage": "2g with honey", "prep": "Powder paste"}
        },
        {
            "name": "Asthma (Tamaka Shwasa)",
            "sanskrit": "तमक श्वास",
            "dosha": "Kapha-Vata",
            "symptoms": ["Breathlessness", "Chest Tightness", "Wheezing"],
            "diet": "Light meals, warm water. Avoid: Heavy dairy, bananas.",
            "remedy": {"name": "Shwas Kuthar Ras", "dosage": "125mg", "prep": "Herbo-mineral tablet"}
        },
        {
            "name": "Sinusitis (Pinasa)",
            "sanskrit": "पीनस",
            "dosha": "Kapha",
            "symptoms": ["Sinus Pressure", "Headache", "Nasal Congestion"],
            "diet": "Spices like black pepper and cloves. Avoid: Ice cream, cold weather exposure.",
            "remedy": {"name": "Anu Taila", "dosage": "2 drops in each nostril", "prep": "Nasal Oil (Nasya)"}
        },
        {
            "name": "Bronchitis (Kasas)",
            "sanskrit": "कास",
            "dosha": "Kapha",
            "symptoms": ["Persistent Cough", "Sore Throat", "Mild Fever"],
            "diet": "Honey with Ginger juice. Avoid: Deep-fried food.",
            "remedy": {"name": "Talisadi Churna", "dosage": "2g with honey", "prep": "Powder"}
        },

        # --- MUSCULOSKELETAL ---
        {
            "name": "Arthritis (Sandhigata Vata)",
            "sanskrit": "संधिगत वात",
            "dosha": "Vata",
            "symptoms": ["Joint Pain", "Stiffness", "Knee Pain", "Restricted Movement"],
            "diet": "Sesame seeds, warm cooked grains. Avoid: Dry beans, broccoli.",
            "remedy": {"name": "Yograj Guggulu", "dosage": "2 tablets", "prep": "Tablet with warm water"}
        },
        {
            "name": "Sciatica (Gridhrasi)",
            "sanskrit": "गृध्रसी",
            "dosha": "Vata",
            "symptoms": ["Radiating Leg Pain", "Numbness", "Back Pain"],
            "diet": "Warm milk with Ghee. Avoid: Excessive travel, cold wind.",
            "remedy": {"name": "Sahacharadi Kashayam", "dosage": "15ml with water", "prep": "Liquid decoction"}
        },
        {
            "name": "Gout (Vatarakta)",
            "sanskrit": "वातरक्त",
            "dosha": "Vata-Pitta",
            "symptoms": ["Swollen Big Toe", "Burning Joint Pain", "Redness"],
            "diet": "Barley, Moong dal. Avoid: Red meat, Alcohol, High protein.",
            "remedy": {"name": "Kaishore Guggulu", "dosage": "2 tablets", "prep": "Tablet"}
        },

        # --- SKIN CONDITIONS ---
        {
            "name": "Acne (Yuvana Pidaka)",
            "sanskrit": "युवान पिडका",
            "dosha": "Pitta-Kapha",
            "symptoms": ["Pimples", "Oily Skin", "Blackheads"],
            "diet": "Neem tea, Bitter gourd. Avoid: Fermented foods, Oily food.",
            "remedy": {"name": "Khadirarishta", "dosage": "20ml with water", "prep": "Liquid tonic"}
        },
        {
            "name": "Psoriasis (Kitibha)",
            "sanskrit": "किटिभ",
            "dosha": "Vata-Kapha",
            "symptoms": ["Skin Patches", "Scaling", "Itching"],
            "diet": "Keep skin hydrated with coconut oil internally. Avoid: Incompatible foods (Fish+Milk).",
            "remedy": {"name": "Panchatikta Ghrita", "dosage": "1 tsp empty stomach", "prep": "Medicated Ghee"}
        },
        {
            "name": "Eczema (Vicharchika)",
            "sanskrit": "विचarchika",
            "dosha": "Kapha-Pitta",
            "symptoms": ["Oozing Skin", "Severe Itching", "Discoloration"],
            "diet": "Cucumber, Aloe vera juice. Avoid: Sour curds, seafood.",
            "remedy": {"name": "Mahamanjisthadi Kadha", "dosage": "15ml with water", "prep": "Liquid decoction"}
        },

        # --- METABOLIC / LIFESTYLE ---
        {
            "name": "Diabetes (Madhumeha)",
            "sanskrit": "मधुमेह",
            "dosha": "Kapha",
            "symptoms": ["Frequent Urination", "Excessive Thirst", "Slow Healing"],
            "diet": "Bitter melon, Amla, Turmeric. Avoid: Sugary fruits, White rice.",
            "remedy": {"name": "Chandraprabha Vati", "dosage": "2 tablets", "prep": "Tablet"}
        },
        {
            "name": "Obesity (Sthaulya)",
            "sanskrit": "स्थौल्य",
            "dosha": "Kapha",
            "symptoms": ["Weight Gain", "Excessive Sweat", "Shortness of Breath"],
            "diet": "Honey water in morning, Millets. Avoid: Daytime sleep, Sweets.",
            "remedy": {"name": "Triphala Guggulu", "dosage": "2 tablets", "prep": "Tablet"}
        },
        {
            "name": "Anemia (Pandu)",
            "sanskrit": "पाण्डु",
            "dosha": "Pitta",
            "symptoms": ["Pale Skin", "Dizziness", "Palpitations"],
            "diet": "Spinach, Beetroot, Dates. Avoid: Sour and salty items.",
            "remedy": {"name": "Lohasava", "dosage": "15ml after meals", "prep": "Liquid Tonic"}
        },
        {
            "name": "Jaundice (Kamala)",
            "sanskrit": "कामला",
            "dosha": "Pitta",
            "symptoms": ["Yellow Eyes", "Dark Urine", "Nausea"],
            "diet": "Sugarcane juice, Radish leaves. Avoid: All oil and fats.",
            "remedy": {"name": "Arogyavardhini Vati", "dosage": "1 tablet", "prep": "Tablet"}
        },

        # --- NERVOUS SYSTEM ---
        {
            "name": "Insomnia (Anidra)",
            "sanskrit": "अनिद्रा",
            "dosha": "Vata",
            "symptoms": ["Sleeplessness", "Anxiety", "Restlessness"],
            "diet": "Warm milk with nutmeg. Avoid: Caffeine, late-night screen time.",
            "remedy": {"name": "Ashwagandha Churna", "dosage": "3g with milk", "prep": "Powder"}
        },
        {
            "name": "Migraine (Ardhavabhedaka)",
            "sanskrit": "अर्धावभेदक",
            "dosha": "Vata-Pitta",
            "symptoms": ["One-sided Headache", "Sensitivity to Light", "Vomiting"],
            "diet": "Soaked raisins, Ghee in diet. Avoid: Skipping meals, Direct sun.",
            "remedy": {"name": "Pathyadi Kadha", "dosage": "15ml with water", "prep": "Liquid decoction"}
        },
        {
            "name": "Anxiety (Chittodvega)",
            "sanskrit": "चित्तोद्वेग",
            "dosha": "Vata",
            "symptoms": ["Palpitations", "Panic Attacks", "Overthinking"],
            "diet": "Sweet and grounding foods. Avoid: Dry and pungent spices.",
            "remedy": {"name": "Brahmi Vati", "dosage": "1 tablet at night", "prep": "Tablet"}
        },

        # --- OTHER COMMON ---
        {
            "name": "Fever (Jwara)",
            "sanskrit": "ज्वर",
            "dosha": "Tridoshic",
            "symptoms": ["High Fever", "Body Ache", "Chills"],
            "diet": "Moong dal soup, Lukewarm water. Avoid: Heavy solid food.",
            "remedy": {"name": "Mahasudarshan Vati", "dosage": "2 tablets", "prep": "Tablet"}
        },
        {
            "name": "Haemorrhoids (Arsha)",
            "sanskrit": "अर्श",
            "dosha": "Vata-Pitta",
            "symptoms": ["Rectal Bleeding", "Painful Bowels", "Lumps"],
            "diet": "Buttermilk, Suran (Yam). Avoid: Spicy food, Long sitting.",
            "remedy": {"name": "Abhayarishta", "dosage": "20ml with water", "prep": "Liquid"}
        },
        {
            "name": "Hair Fall (Khalitya)",
            "sanskrit": "खालित्य",
            "dosha": "Pitta",
            "symptoms": ["Excessive Hair Loss", "Dandruff", "Scalp Itching"],
            "diet": "Amla, Curry leaves, Coconut. Avoid: Salty food, Hot water bath for head.",
            "remedy": {"name": "Bhringraj Oil", "dosage": "Massage scalp", "prep": "Oil"}
        },
        {
            "name": "General Weakness (Daurbalya)",
            "sanskrit": "दौर्बल्य",
            "dosha": "Vata",
            "symptoms": ["Fatigue", "Muscle Weakness", "Low Energy"],
            "diet": "Dates, Milk, Ghee, Almonds. Avoid: Fasting, Over-exertion.",
            "remedy": {"name": "Chyawanprash", "dosage": "1 tsp daily", "prep": "Herbal Jam"}
        },
        {
            "name": "Gastritis (Udarashoola)",
            "sanskrit": "उदरशूल",
            "dosha": "Vata-Pitta",
            "symptoms": ["Burning Stomach", "Sharp Pain", "Belching"],
            "diet": "Cold milk, Licorice water. Avoid: Alcohol, Smoking, Spices.",
            "remedy": {"name": "Kamdudha Ras", "dosage": "250mg", "prep": "Tablet"}
        },
        {
            "name": "Urine Infection (Mutrakrichra)",
            "sanskrit": "मूत्रकृच्छ्र",
            "dosha": "Pitta",
            "symptoms": ["Burning Urination", "Frequent Urge", "Lower Abdomen Pain"],
            "diet": "Cranberry juice (if available) or Barley water. Avoid: Salty snacks.",
            "remedy": {"name": "Gokshuradi Guggulu", "dosage": "2 tablets", "prep": "Tablet"}
        },
        {
            "name": "Menstrual Cramps (Kashtaartava)",
            "sanskrit": "कष्टार्तव",
            "dosha": "Vata",
            "symptoms": ["Lower Back Pain", "Pelvic Pain", "Nausea during periods"],
            "diet": "Warm sesame oil massage on abdomen, Fenugreek water. Avoid: Cold food.",
            "remedy": {"name": "Dashmularishta", "dosage": "15ml with water", "prep": "Liquid Tonic"}
        },
        {
            "name": "Thyroid Imbalance (Galaganda)",
            "sanskrit": "गलघण्ड",
            "dosha": "Kapha",
            "symptoms": ["Swelling in Neck", "Weight Change", "Mood Swings"],
            "diet": "Iodine-rich foods, Walnut. Avoid: Cabbage, Cauliflower (Raw).",
            "remedy": {"name": "Kanchanar Guggulu", "dosage": "2 tablets", "prep": "Tablet"}
        }
    ]

    for item in data:
        # 1. Create/Get Disease
        disease, _ = Disease.objects.get_or_create(
            name=item['name'],
            defaults={
                'sanskrit_name': item['sanskrit'],
                'dosha_type': item['dosha'],
                'diet_plan': item['diet'],
                'description': f"An Ayurvedic condition involving {item['dosha']} imbalance."
            }
        )

        # 2. Create Symptoms and Link (Many-to-Many)
        for s_name in item['symptoms']:
            symptom, _ = Symptom.objects.get_or_create(name=s_name)
            disease.symptoms.add(symptom)

        # 3. Create Remedy and Link (Many-to-Many)
        r_info = item['remedy']
        remedy, _ = Remedy.objects.get_or_create(
            name=r_info['name'],
            defaults={
                'dosage': r_info['dosage'],
                'preparation': r_info['prep'],
                'description': f"Effective formulation for {item['name']}."
            }
        )
        disease.remedies.add(remedy)
        
        print(f"✅ Imported: {item['name']}")

    print("\n🎉 Success! All 30 diseases are now in your MongoDB database.")

if __name__ == "__main__":
    bulk_import()