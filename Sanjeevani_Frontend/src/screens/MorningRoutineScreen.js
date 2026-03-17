import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert, Dimensions, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { translations } from '../utils/translations';
import BottomNavBar from '../components/BottomNavBar'; // ✅ Import global navbar

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const MorningRoutineScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [profile, setProfile] = useState({ username: '', prakriti: '' });
  const [checkedTasks, setCheckedTasks] = useState({});
  const [isGuestMode, setIsGuestMode] = useState(false); // ✅ Guest mode state

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const username = await AsyncStorage.getItem('userName');
      const savedLang = await AsyncStorage.getItem('userLang') || 'en';
      const savedProgress = await AsyncStorage.getItem(`routine_progress_${username}`);
      const guestFlag = await AsyncStorage.getItem('isGuest');

      setLang(savedLang);
      if (guestFlag === 'true') setIsGuestMode(true);

      if (!username) {
        navigation.replace('Login');
        return;
      }

      // ✅ FIXED: Using 10.0.2.2 for Android Emulator stability
      const response = await axios.get(`http://10.0.2.2:8000/api/v1/get-profile/?username=${username}`, {
        timeout: 10000
      });

      setProfile(response.data);

      if (savedProgress) setCheckedTasks(JSON.parse(savedProgress));
    } catch (e) {
      console.error("Routine Init Error:", e);
      const storedName = await AsyncStorage.getItem('userName');
      setProfile(prev => ({ ...prev, username: storedName || 'User' }));
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (index) => {
    const newProgress = { ...checkedTasks, [index]: !checkedTasks[index] };
    setCheckedTasks(newProgress);
    const username = await AsyncStorage.getItem('userName');
    await AsyncStorage.setItem(`routine_progress_${username}`, JSON.stringify(newProgress));
  };

  const resetRoutine = () => {
    Alert.alert(
      lang === 'hi' ? "प्रगति रीसेट करें?" : "Reset Progress?",
      lang === 'hi' ? "क्या आप आज की प्रगति को हटाना चाहते हैं?" : "Clear all checked tasks for today?",
      [
        { text: lang === 'hi' ? "रद्द करें" : "Cancel", style: "cancel" },
        {
          text: lang === 'hi' ? "रीसेट" : "Reset",
          style: "destructive",
          onPress: async () => {
            setCheckedTasks({});
            const username = await AsyncStorage.getItem('userName');
            await AsyncStorage.removeItem(`routine_progress_${username}`);
          }
        }
      ]
    );
  };

  const getRoutine = () => {
    const isPitta = profile.prakriti === 'Pitta';
    const isKapha = profile.prakriti === 'Kapha';
    const t = translations[lang];

    return [
      { id: 'wake', t: isKapha ? '5:00 AM' : '6:00 AM', a: t.routine_wake, b: t.desc_wake },
      { id: 'water', t: '6:15 AM', a: t.routine_water, b: isPitta ? t.desc_water_pitta : t.desc_water_gen },
      { id: 'detox', t: '6:30 AM', a: t.routine_detox, b: t.desc_detox },
      { id: 'move', t: '6:45 AM', a: t.routine_move, b: isPitta ? t.desc_move_pitta : t.desc_move_gen },
      { id: 'med', t: '7:15 AM', a: t.routine_med, b: t.desc_med },
    ];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </View>
    );
  }

  const t = translations[lang];
  const routineData = getRoutine();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t.routine_title}</Text>

        <TouchableOpacity
          style={styles.langBadge}
          onPress={async () => {
            const newLang = lang === 'en' ? 'hi' : 'en';
            setLang(newLang);
            await AsyncStorage.setItem('userLang', newLang);
          }}
        >
           <Text style={styles.langToggle}>{lang === 'en' ? 'हिन्दी' : 'EN'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>🌅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>
               {profile.prakriti ? `${profile.prakriti} ` : ''}{t.dinacharya}
            </Text>
            {/* ✅ Dynamic subtitle for Guest/Family mode */}
            <Text style={styles.introSubtitle}>
                {isGuestMode ? "Viewing plan for family member" : `${t.custom_for} ${profile.username}`}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.daily_schedule}</Text>
          <TouchableOpacity onPress={resetRoutine}>
            <Text style={styles.resetText}>{lang === 'hi' ? 'रीसेट' : 'Reset'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.routineBox}>
          {routineData.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleTask(i)}
              activeOpacity={0.7}
              style={[styles.row, i === routineData.length - 1 && { borderBottomWidth: 0 }]}
            >
              <View style={[styles.checkCircle, checkedTasks[i] && styles.checkedCircle]}>
                {checkedTasks[i] && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.timeLabel}>{item.t}</Text>
                <Text style={[styles.taskName, checkedTasks[i] && styles.strikeText]}>{item.a}</Text>
                <Text style={styles.descriptionText}>{item.b}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>⚠️ {t.disclaimer_title}</Text>
          <Text style={styles.disclaimerBody}>{t.disclaimer_body}</Text>
        </View>

        {/* ✅ Extra space for navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ✅ Added the global Bottom Nav Bar */}
      <BottomNavBar navigation={navigation} activeScreen={isGuestMode ? "Family" : ""} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    alignItems: 'center',
    backgroundColor: THEME_COLOR,
    elevation: 8,
  },
  backButton: { padding: 5 },
  backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  langBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)'
  },
  langToggle: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  content: { padding: 20, paddingBottom: 100 }, // ✅ Added paddingBottom
  introCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR
  },
  introEmoji: { fontSize: 35, marginRight: 15 },
  introTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  introSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  resetText: { color: '#D32F2F', fontSize: 14, fontWeight: '700' },
  routineBox: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    elevation: 3,
    marginBottom: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  row: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', alignItems: 'center' },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    borderColor: THEME_COLOR,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  checkedCircle: { backgroundColor: THEME_COLOR },
  checkMark: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  taskInfo: { flex: 1 },
  timeLabel: { fontSize: 11, fontWeight: 'bold', color: THEME_COLOR, marginBottom: 3, letterSpacing: 0.8 },
  taskName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  strikeText: { textDecorationLine: 'line-through', color: '#AAA' },
  descriptionText: { fontSize: 12, color: '#666', marginTop: 5, lineHeight: 18 },
  disclaimerCard: {
    backgroundColor: '#FFF1F0',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFA39E'
  },
  disclaimerTitle: { color: '#CF1322', fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  disclaimerBody: { color: '#5C0011', fontSize: 12, lineHeight: 18 }
});

export default MorningRoutineScreen;