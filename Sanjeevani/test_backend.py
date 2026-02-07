import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1/"

def test_endpoint(name, method, endpoint, data=None):
    url = f"{BASE_URL}{endpoint}"
    print(f"Testing {name}...")
    try:
        if method == "GET":
            response = requests.get(url)
        else:
            response = requests.post(url, json=data)
        
        if response.status_code in [200, 201]:
            print(f"✅ SUCCESS: {name}")
            return response.json()
        else:
            print(f"❌ FAILED: {name} (Status: {response.status_code})")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"⚠️ ERROR: Could not connect to {name}. Is the server running?")
        print(str(e))
    return None

def run_all_tests():
    print("=== STARTING SYSTEM VALIDATION ===\n")

    # 1. Test Symptom List
    test_endpoint("Symptom List", "GET", "symptoms/")

    # 2. Test Prediction Algorithm (Acne Test)
    # Using Symptom IDs 1 and 3 (Pimples/Breakouts)
    predict_data = {"symptom_ids": [1, 3], "dosha": "Pitta"}
    test_endpoint("Prediction Algorithm", "POST", "predict/", predict_data)

    # 3. Test Database Sync (Offline Support)
    test_endpoint("Database Sync", "GET", "sync/")

    # 4. Test AI Chatbot
    chat_data = {"query": "Give me a simple tip for a Kapha imbalance."}
    test_endpoint("AI Chatbot", "POST", "chatbot/", chat_data)

    print("\n=== VALIDATION COMPLETE ===")

if __name__ == "__main__":
    run_all_tests()