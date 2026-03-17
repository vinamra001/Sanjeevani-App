import sqlite3
import pandas as pd 

# 1. Connect to your local Django database
conn = sqlite3.connect('db.sqlite3')

# 2. These are the exact tables your terminal just found!
tables_to_extract = [
    'recommender_api_disease',
    'recommender_api_symptom',
    'recommender_api_remedy'
]

print("Extracting your Sanjeevani Ayurvedic Datasets...\n")

# 3. Loop through and extract all of them into separate Excel-ready files
for table in tables_to_extract:
    try:
        df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
        filename = f"{table}_Dataset.csv"
        df.to_csv(filename, index=False)
        print(f"✅ SUCCESS! Extracted to: {filename}")
    except Exception as e:
        print(f"⚠️ Error extracting {table}: {e}")

conn.close()
print("\n🎉 All done! Check your folder for the CSV files.")