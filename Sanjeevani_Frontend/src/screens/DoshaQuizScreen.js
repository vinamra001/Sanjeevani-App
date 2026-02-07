import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, StatusBar, Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_COLOR = '#2E7D32';

const questions = [
  { id: 1, q: "Physical Build", options: [{ l: "Thin/Bony", v: "Vata" }, { l: "Medium/Athletic", v: "Pitta" }, { l: "Solid/Large", v: "Kapha" }] },
  { id: 2, q: "Skin Texture", options: [{ l: "Dry/Rough", v: "Vata" }, { l: "Warm/Reddish", v: "Pitta" }, { l: "Oily/Smooth", v: "Kapha" }] },
  { id: 3, q: "Reaction to Stress", options: [{ l: "Anxiety/Worry", v: "Vata" }, { l: "Anger/Irritability", v: "Pitta" }, { l: "Withdrawal/Calm", v: "Kapha" }] },
  { id: 4, q: "Digestion/Appetite", options: [{ l: "Irregular/Gas", v: "Vata" }, { l: "Strong/Intense", v: "Pitta" }, { l: "Slow/Steady", v: "Kapha" }] },
  { id: 5, q: "Sleep Pattern", options: [{ l: "Light/Interrupted", v: "Vata" }, { l: "Moderate/Sound", v: "Pitta" }, { l: "Heavy/Deep", v: "Kapha" }] },
];

const DoshaQuizScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const [history, setHistory] = useState([]);

  const handleAnswer = async (dosha) => {
    setHistory([...history, scores]);

    const newScores = { ...scores, [dosha]: scores[dosha] + 1 };

    if (currentStep < questions.length - 1) {
      setScores(newScores);
      setCurrentStep(currentStep + 1);
    } else {
      const result = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      submitResult(result);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevScores = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      setScores(prevScores);
      setHistory(newHistory);
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const submitResult = async (prakriti) => {
    try {
      const username = await AsyncStorage.getItem('userName');
      // Using 10.0.2.2 bridge for Android Studio Emulator
      await axios.post('http://10.0.2.2:8000/api/v1/update-prakriti/', {
        username,
        prakriti
      }, { timeout: 8000 });

      Alert.alert("Analysis Complete", `Your dominant Dosha is ${prakriti}!`, [
        { text: "Go to Chat", onPress: () => navigation.navigate('Chat') }
      ]);
    } catch (e) {
      Alert.alert("Connection Error", "Results could not be saved to your profile.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* ✅ Fixed Header: Standard View instead of Deprecated SafeAreaView */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevious} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prakriti Analysis</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.quizContainer}>
        <View style={styles.progressWrapper}>
            <Text style={styles.progressText}>Step {currentStep + 1} of {questions.length}</Text>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${((currentStep + 1) / questions.length) * 100}%` }]} />
            </View>
        </View>

        <Text style={styles.questionLabel}>Assess your:</Text>
        <Text style={styles.questionText}>{questions[currentStep].q}</Text>

        {questions[currentStep].options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionBtn}
            onPress={() => handleAnswer(opt.v)}
            activeOpacity={0.8}
          >
            <Text style={styles.optionLabel}>{opt.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    // Manually handling status bar padding to replace SafeAreaView
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
    backgroundColor: THEME_COLOR,
    elevation: 5,
  },
  backBtn: { padding: 5 },
  backArrow: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  quizContainer: { flex: 1, padding: 25, justifyContent: 'center' },
  progressWrapper: { marginBottom: 40 },
  progressText: { color: '#888', marginBottom: 12, textAlign: 'center', fontSize: 13, fontWeight: '600' },
  progressBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: THEME_COLOR },

  questionLabel: { fontSize: 14, color: THEME_COLOR, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  questionText: { fontSize: 28, fontWeight: 'bold', color: '#222', marginBottom: 40, marginTop: 5, textAlign: 'center' },

  optionBtn: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionLabel: { fontSize: 17, textAlign: 'center', color: '#444', fontWeight: '600' }
});

export default DoshaQuizScreen;