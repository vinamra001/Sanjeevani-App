import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, StatusBar, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar'; // ✅ Import the global navbar

const THEME_COLOR = '#2E7D32';

const questions = [
  { id: 1, q: "Physical Build", options: [{ l: "Thin/Bony", v: "Vata" }, { l: "Medium/Athletic", v: "Pitta" }, { l: "Solid/Large", v: "Kapha" }] },
  { id: 2, q: "Skin Texture", options: [{ l: "Dry/Rough", v: "Vata" }, { l: "Warm/Reddish", v: "Pitta" }, { l: "Oily/Smooth", v: "Kapha" }] },
  { id: 3, q: "Reaction to Stress", options: [{ l: "Anxiety/Worry", v: "Vata" }, { l: "Anger/Irritability", v: "Pitta" }, { l: "Withdrawal/Calm", v: "Kapha" }] },
  { id: 4, q: "Digestion/Appetite", options: [{ l: "Irregular/Gas", v: "Vata" }, { l: "Strong/Intense", v: "Pitta" }, { l: "Slow/Steady", v: "Kapha" }] },
  { id: 5, q: "Sleep Pattern", options: [{ l: "Light/Interrupted", v: "Vata" }, { l: "Moderate/Sound", v: "Pitta" }, { l: "Heavy/Deep", v: "Kapha" }] },
];

const DoshaQuizScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    const checkGuestStatus = async () => {
      const guestFlag = await AsyncStorage.getItem('isGuest');
      if (guestFlag === 'true') {
        setIsGuestMode(true);
      }
    };
    checkGuestStatus();
  }, []);

  const handleSelect = (questionId, doshaValue) => {
    setAnswers({ ...answers, [questionId]: doshaValue });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      Alert.alert("Incomplete", "Please answer all 5 questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;

    Object.values(answers).forEach((val) => {
      if (val === 'Vata') vataCount++;
      if (val === 'Pitta') pittaCount++;
      if (val === 'Kapha') kaphaCount++;
    });

    let dominantDosha = 'Vata';
    let maxCount = vataCount;

    if (pittaCount > maxCount) { dominantDosha = 'Pitta'; maxCount = pittaCount; }
    if (kaphaCount > maxCount) { dominantDosha = 'Kapha'; }

    try {
      const isGuest = await AsyncStorage.getItem('isGuest');
      const username = await AsyncStorage.getItem('userName');

      if (isGuest === 'true') {
        Alert.alert("Family Member's Analysis", `The dominant Dosha is ${dominantDosha}!`, [
          { text: "Done", onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        await axios.post('http://10.0.2.2:8000/api/v1/update-prakriti/', {
          username: username || 'Guest',
          prakriti: dominantDosha
        }, { timeout: 3000 });

        Alert.alert("Analysis Complete", `Your dominant Dosha is ${dominantDosha}!`, [
          { text: "Go to Home", onPress: () => navigation.navigate('Home') }
        ]);
      }
    } catch (e) {
      Alert.alert(
        "Analysis Complete (Offline)",
        `The dominant Dosha is ${dominantDosha}!\n\n(Could not sync to cloud.)`,
        [
          { text: "Go to Home", onPress: () => navigation.navigate('Home') }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isGuestMode ? "Family Prakriti" : "Prakriti Analysis"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.instructions}>
          {isGuestMode
            ? "Select the options that best describe your family member to discover their Ayurvedic Dosha."
            : "Select the option that best describes you for each category below to discover your Ayurvedic Dosha."}
        </Text>

        {questions.map((q) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>{q.id}. {q.q}</Text>

            <View style={styles.optionsRow}>
              {q.options.map((opt, index) => {
                const isSelected = answers[q.id] === opt.v;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionBtn,
                      isSelected && styles.optionBtnSelected
                    ]}
                    onPress={() => handleSelect(q.id, opt.v)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected
                    ]}>
                      {opt.l}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <Text style={styles.submitBtnText}>Calculate Dosha</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* ✅ Add the global Bottom Nav Bar here */}
      <BottomNavBar navigation={navigation} activeScreen={isGuestMode ? "Family" : ""} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
    backgroundColor: THEME_COLOR,
    elevation: 5,
  },
  backBtn: { padding: 5 },
  backArrow: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  // ✅ Increased paddingBottom to 120 so the submit button doesn't hide behind the navbar
  scrollContent: { padding: 20, paddingBottom: 120 },

  instructions: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },

  questionBlock: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  questionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },

  optionsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  optionBtnSelected: {
    borderColor: THEME_COLOR,
    backgroundColor: '#E8F5E9',
  },
  optionLabel: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: THEME_COLOR,
    fontWeight: 'bold',
  },

  submitBtn: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});

export default DoshaQuizScreen;