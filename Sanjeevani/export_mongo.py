import pymongo
import pandas as pd

# 1. Connect to your local MongoDB
MONGO_URI = "mongodb://localhost:27017/" 
client = pymongo.MongoClient(MONGO_URI)

# 2. IMPORTANT: Put your actual database name here!
# (If you don't remember it, open your Django settings.py and look at the DATABASES section)
db = client["sanjeevani_db"] # <-- Change this if your DB is named something else!

# 3. The exact collections your Django app created
collections_to_extract = [
    'recommender_api_disease',
    'recommender_api_symptom',
    'recommender_api_remedy',
    'recommender_api_disease_symptoms',
    'recommender_api_remedy_treats_diseases',
    'recommender_api_patient' # Grabs your user profiles and Doshas too!
]

print("🌿 Extracting Sanjeevani Datasets from MongoDB...\n")

for col_name in collections_to_extract:
    try:
        collection = db[col_name]
        
        # Fetch all records from the collection
        cursor = collection.find()
        data = list(cursor)
        
        if data:
            df = pd.DataFrame(data)
            
            # Remove the messy MongoDB '_id' object column so it looks clean in Excel
            if '_id' in df.columns:
                df = df.drop(columns=['_id'])
                
            filename = f"{col_name}_Dataset.csv"
            df.to_csv(filename, index=False)
            print(f"✅ SUCCESS! Extracted {len(df)} records to: {filename}")
        else:
            print(f"⚠️ Collection '{col_name}' is currently empty.")
            
    except Exception as e:
        print(f"❌ Error extracting {col_name}: {e}")

print("\n🎉 All done! Check your folder for the CSV files.")