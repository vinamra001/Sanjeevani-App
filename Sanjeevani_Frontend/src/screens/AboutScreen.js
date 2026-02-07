import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 1. SEAMLESS STATUS BAR */}
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* 2. SOLID GREEN HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>About Sanjeevani</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 3. PROJECT VISION */}
        <View style={styles.section}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.brandName}>Sanjeevani AI</Text>
          <Text style={styles.version}>Version 1.0.2 • 2026 Build</Text>
          <Text style={styles.description}>
            Sanjeevani is an intelligent health companion that bridges
            ancient Vedic wisdom with modern Generative Artificial Intelligence.
            By analyzing your unique Prakriti, we provide personalized guidance
            for a balanced, holistic life.
          </Text>
        </View>

        {/* 4. CORE ARCHITECTURE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Core Features</Text>
          <BulletPoint text="Prakriti Analysis: Real-time assessment of Vata, Pitta, and Kapha balance." />
          <BulletPoint text="AI Health Chat: Intelligent Ayurvedic consultations via Gemini 1.5." />
          <BulletPoint text="Symptom Mapping: Diagnosis of 30+ classical Ayurvedic conditions." />
          <BulletPoint text="Digital Dinacharya: Lifestyle routines tailored to your body clock." />
        </View>

        {/* 5. TECHNICAL STACK */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Technical Stack</Text>
          <View style={styles.techGrid}>
            <TechTag label="React Native" />
            <TechTag label="Django REST" />
            <TechTag label="Google Gemini" />
            <TechTag label="SQLite3" />
            <TechTag label="Axios" />
            <TechTag label="Expo Print" />
          </View>
        </View>

        {/* 6. MEDICAL DISCLAIMER */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Text style={styles.disclaimerEmoji}>⚠️</Text>
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            The insights provided by Sanjeevani AI are for educational and wellness
            purposes only. This application does not provide clinical medical diagnosis.
            {"\n\n"}
            Please consult with a qualified Ayurvedic practitioner or medical doctor
            before starting any new health regimen.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Developed for Final Year Project 2026</Text>
          <Text style={styles.footerText}>Built with ❤️ by Team Sanjeevani</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// --- SUB-COMPONENTS ---

const BulletPoint = ({ text }) => (
  <View style={styles.bulletRow}>
    <View style={styles.bulletDot} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const TechTag = ({ label }) => (
  <View style={styles.techTag}>
    <Text style={styles.techTagText}>{label}</Text>
  </View>
);

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: THEME_COLOR,
    elevation: 8,
  },
  backButton: { padding: 5 },
  backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  scrollContent: { padding: 20 },

  section: { alignItems: 'center', marginBottom: 30 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2
  },
  logoEmoji: { fontSize: 45 },
  brandName: { fontSize: 28, fontWeight: 'bold', color: THEME_COLOR },
  version: { fontSize: 13, color: '#AAA', marginBottom: 15, fontWeight: '600' },
  description: { textAlign: 'center', color: '#555', lineHeight: 22, fontSize: 15, paddingHorizontal: 10 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginBottom: 18 },
  bulletRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  bulletDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME_COLOR, marginTop: 6, marginRight: 12 },
  bulletText: { flex: 1, color: '#444', fontSize: 14, lineHeight: 21 },

  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techTag: {
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DCEDC8'
  },
  techTagText: { color: THEME_COLOR, fontSize: 12, fontWeight: 'bold' },

  disclaimerCard: {
    backgroundColor: '#FFF1F0',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFA39E'
  },
  disclaimerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  disclaimerEmoji: { fontSize: 20, marginRight: 10 },
  disclaimerTitle: { color: '#CF1322', fontWeight: 'bold', fontSize: 16 },
  disclaimerText: { color: '#5C0011', fontSize: 13, lineHeight: 20 },

  footer: { marginTop: 25, alignItems: 'center' },
  footerText: { textAlign: 'center', color: '#CCC', fontSize: 11, marginBottom: 5, fontWeight: '600' }
});

export default AboutScreen;