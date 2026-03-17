
---

# 🌿 Sanjeevani AI: Ayurvedic Recommender System

Sanjeevani AI is a full-stack health platform designed to bridge ancient Ayurvedic wisdom with modern Artificial Intelligence. The system identifies a user's **Prakriti** (Body Constitution), predicts potential Ayurvedic conditions based on symptoms, and provides personalized lifestyle and dietary recommendations.

---

## 🚀 Key Features

* **Prakriti Analysis:** A 5-step diagnostic quiz to identify dominant Doshas (**Vata, Pitta, Kapha**).
* **Intelligent Chatbot:** Powered by **Gemini 1.5 Flash**, providing context-aware Ayurvedic consultations.
* **Disease Predictor:** A logic engine mapping symptoms to **30+ traditional Ayurvedic diseases** (Amlapitta, Sandhigata Vata, etc.).
* **Dinacharya (Daily Routine):** Personalized morning routines and task tracking based on identified Prakriti.
* **Dietary Guidance:** Dynamic meal plans and "Foods to Avoid/Favor" lists.
* **Health Reports:** Ability to export health summaries as PDF reports.

---

## 🛠️ Technical Stack

### **Frontend**

* **Framework:** React Native (Expo)
* **State Management:** React Hooks (useState, useEffect)
* **Navigation:** React Navigation (Stack & Bottom Tabs)
* **Communication:** Axios (REST API)

### **Backend**

* **Framework:** Django REST Framework (Python)
* **AI Integration:** Google GenAI (Gemini SDK)
* **Database:** MongoDB (via Djongo)

---

## 📂 Project Structure

```text
Sanjeevani_FullStack/
├── Sanjeevani/            # Django Backend
│   ├── AyurRecSys/        # Project Settings & Config
│   ├── recommender_api/   # Core Logic (Views, Models, Serializers)
│   └── requirements.txt   # Backend Python dependencies
└── Sanjeevani_Frontend/   # React Native Mobile App
    ├── src/               # Components, Screens, and Navigation
    ├── assets/            # App Icons and Splash Screens
    ├── App.js             # Main Entry Point
    └── package.json       # Frontend JS dependencies

```

---

## ⚙️ Installation & Setup

### **1. Backend Setup**

1. Navigate to the folder: `cd Sanjeevani`
2. Create a virtual environment: `python -m venv env`
3. Activate environment: `env\Scripts\activate` (Windows)
4. Install libraries: `pip install -r requirements.txt`
5. Run server: `python manage.py runserver 0.0.0.0:8000`

### **2. Frontend Setup**

1. Navigate to the folder: `cd Sanjeevani_Frontend`
2. Install dependencies: `npm install`
3. Start the app: `npx expo start`
4. Use **Android Studio Emulator** to test (Note: App connects via `10.0.2.2`).

---

## 🔬 Methodology & Logic

The system utilizes a **Symptom-to-Disease Mapping Algorithm**. When a user inputs symptoms, the backend queries the MongoDB database to find the closest match among 30+ Ayurvedic conditions.

1. **Input:** User selects symptoms from the UI.
2. **Processing:** Django identifies the matching disease and calculates a confidence score.
3. **Advice:** Gemini AI generates a context-specific remedy based on the user's Dosha and the detected disease.

---

## 🛡️ Medical Disclaimer

This application is for educational and informational purposes only. The recommendations provided by Sanjeevani AI are based on traditional Ayurvedic principles and AI-generated content. Always consult a certified Ayurvedic practitioner or medical doctor before starting any treatment or diet.

---
