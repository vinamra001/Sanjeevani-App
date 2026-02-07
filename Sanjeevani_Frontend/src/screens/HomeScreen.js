import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, Dimensions, StatusBar, ActivityIndicator, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { translations } from '../utils/translations';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const HomeScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('User');
  const [dosha, setDosha] = useState('Unknown');
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [lastDiagnosis, setLastDiagnosis] = useState({ name: "General", remedies: [] });

  const fetchUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const savedLang = await AsyncStorage.getItem('userLang') || 'en';
      const savedHistory = await AsyncStorage.getItem('last_diagnosis');

      if (savedHistory) {
        setLastDiagnosis(JSON.parse(savedHistory));
      }

      setLang(savedLang);

      if (name) {
        setDisplayName(name);

        // ✅ FIXED: Changed 10.21.69.216 to 10.0.2.2 for Android Emulator
        const response = await axios.get(`http://10.0.2.2:8000/api/v1/get-profile/?username=${name}`, {
          timeout: 8000 // Increased timeout slightly for slower emulators
        });

        if (response.data.prakriti && response.data.prakriti !== "Not Analyzed") {
          setDosha(response.data.prakriti);
        }
      }
    } catch (error) {
      console.error("Home Data Fetch Error:", error);
      // Fallback: If network fails, at least the app doesn't stay stuck on loading
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
      </View>
    );
  }

  const t = translations[lang];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.namasteText}>{t.namaste},</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
          <TouchableOpacity
            style={styles.langToggle}
            onPress={async () => {
              const newLang = lang === 'en' ? 'hi' : 'en';
              setLang(newLang);
              await AsyncStorage.setItem('userLang', newLang);
            }}
          >
            <Text style={styles.langText}>{lang === 'en' ? 'हिन्दी' : 'EN'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.wellnessCard, dosha !== 'Unknown' && styles.wellnessActive]}>
          <View style={styles.wellnessHeader}>
            <Text style={styles.heartIcon}>❤️</Text>
            <Text style={styles.wellnessTitle}>{t.wellness_profile}</Text>
          </View>
          <Text style={styles.doshaType}>{t.dominant_dosha}: <Text style={{fontWeight: '900'}}>{dosha}</Text></Text>
          <Text style={styles.doshaQuote}>
            {dosha === 'Unknown'
              ? t.prakriti_desc
              : `Your ${dosha} nature is currently being tracked. Stay balanced!`}
          </Text>
        </View>

        <TouchableOpacity style={[styles.quizActionCard, styles.shadow]} onPress={() => navigation.navigate('DoshaQuiz')}>
          <View style={styles.quizInner}>
            <Text style={styles.quizEmoji}>🧭</Text>
            <View style={{flex: 1}}>
              <Text style={styles.quizTitle}>{t.analyze_prakriti}</Text>
              <Text style={styles.quizSubtitle}>{t.prakriti_desc}</Text>
            </View>
            <Text style={styles.arrowIcon}>➔</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t.quick_actions}</Text>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <ActionCard
              icon="🔍"
              label={t.diagnosis}
              color="#E8F5E9"
              onPress={() => navigation.navigate('Input')}
            />
            <ActionCard
              icon="🥗"
              label={t.diet_plan}
              color="#FFF3E0"
              onPress={() => navigation.navigate('DietRecommendations')}
            />
          </View>
          <View style={styles.gridRow}>
            <ActionCard
              icon="🌅"
              label={t.routine}
              color="#E3F2FD"
              onPress={() => navigation.navigate('MorningRoutine')}
            />

            <ActionCard
              icon="🩹"
              label={lastDiagnosis.name === "General" ? t.remedies : lastDiagnosis.name}
              color="#F3E5F5"
              onPress={() => navigation.navigate('AyurvedicRemedies', {
                remedies: lastDiagnosis.remedies,
                diseaseName: lastDiagnosis.name
              })}
            />
          </View>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home" active />
        <NavItem icon="📋" label="Blogs" onPress={() => navigation.navigate('Blog')} />
        <NavItem icon="💬" label={t.chat} onPress={() => navigation.navigate('Chat')} />
        <NavItem icon="👤" label={t.profile} onPress={() => navigation.navigate('Profile')} />
      </View>
    </View>
  );
};

// ... (Rest of ActionCard, NavItem components and Styles remain the same)

const ActionCard = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={[styles.actionCard, styles.shadow]} onPress={onPress}>
    <View style={[styles.actionIconCircle, { backgroundColor: color }]}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
    </View>
    <Text style={styles.actionLabel} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

const NavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Text style={{ fontSize: 22, color: active ? THEME_COLOR : '#9E9E9E' }}>{icon}</Text>
    <Text style={[styles.navText, active && { color: THEME_COLOR, fontWeight: 'bold' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  shadow: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  namasteText: { fontSize: 16, color: '#666' },
  userName: { fontSize: 28, fontWeight: 'bold', color: THEME_COLOR },
  langToggle: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: THEME_COLOR },
  langText: { color: THEME_COLOR, fontWeight: 'bold', fontSize: 13 },
  wellnessCard: { backgroundColor: '#78909C', borderRadius: 24, padding: 22, marginBottom: 25, elevation: 5 },
  wellnessActive: { backgroundColor: THEME_COLOR },
  wellnessHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  heartIcon: { fontSize: 20, marginRight: 8 },
  wellnessTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  doshaType: { color: '#fff', fontSize: 18, marginBottom: 8 },
  doshaQuote: { color: '#E8F5E9', fontSize: 13, fontStyle: 'italic', lineHeight: 18, opacity: 0.9 },
  quizActionCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 20, marginBottom: 25, borderLeftWidth: 6, borderLeftColor: THEME_COLOR },
  quizInner: { flexDirection: 'row', alignItems: 'center' },
  quizEmoji: { fontSize: 30, marginRight: 15 },
  quizTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  quizSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  arrowIcon: { fontSize: 18, color: THEME_COLOR, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 18, color: '#1B5E20' },
  gridContainer: { marginBottom: 10 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  actionCard: { width: width * 0.43, backgroundColor: '#fff', borderRadius: 18, paddingVertical: 22, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  actionIconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', color: '#444', paddingHorizontal: 5 },
  bottomNav: { position: 'absolute', bottom: 0, width: width, height: 85, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: Platform.OS === 'ios' ? 25 : 15 },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 10, marginTop: 4, color: '#9E9E9E' }
});

export default HomeScreen;