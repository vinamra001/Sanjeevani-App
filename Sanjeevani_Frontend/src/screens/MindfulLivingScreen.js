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

const MindfulLivingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 1. SEAMLESS STATUS BAR */}
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* 2. CONSISTENT SOLID GREEN HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mindful Living</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>Sattva & Awareness</Text>
          <Text style={styles.subtitle}>Cultivating mental balance through Ayurveda</Text>
        </View>



        {/* Meditation Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emoji}>🧘</Text>
            <View>
              <Text style={styles.cardTitle}>Dhyana (Meditation)</Text>
              <Text style={styles.doshaImpact}>Balances: Vata & Pitta</Text>
            </View>
          </View>
          <Text style={styles.cardText}>
            Practice stillness for 15 minutes daily. Focus on your breath to stabilize
            the 'Prana' (life force) and reduce the mental fluctuations of 'Rajas'.
          </Text>
        </View>

        {/* Pranayama Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emoji}>🌬️</Text>
            <View>
              <Text style={styles.cardTitle}>Pranayama (Breathing)</Text>
              <Text style={styles.doshaImpact}>Balances: All Three Doshas</Text>
            </View>
          </View>
          <Text style={styles.cardText}>
            Try 'Anulom Vilom' (Alternate Nostril Breathing) to clear energy channels
            (Nadis). This practice cools the body and centers the mind.
          </Text>
        </View>



        {/* Sleep Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emoji}>🌙</Text>
            <View>
              <Text style={styles.cardTitle}>Nidra (Restorative Sleep)</Text>
              <Text style={styles.doshaImpact}>Balances: Vata & Kapha</Text>
            </View>
          </View>
          <Text style={styles.cardText}>
            Ensure 7-8 hours of sleep starting before 10 PM (Kapha time).
            Avoid digital screens 1 hour before bed to prevent Vata aggravation.
          </Text>
        </View>

        <View style={styles.infoBox}>
           <Text style={styles.infoText}>
             💡 In Ayurveda, 'Sattva' is the quality of clarity and peace. Mindful living
             is the practice of increasing Sattva in daily life through pure diet and calm thoughts.
           </Text>
        </View>

        <TouchableOpacity
          style={styles.fullBackButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.fullBackButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

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
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

  scrollContent: { padding: 20 },
  introSection: { marginBottom: 25 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  emoji: { fontSize: 35, marginRight: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  doshaImpact: { fontSize: 12, color: THEME_COLOR, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  cardText: { fontSize: 14, color: '#555', lineHeight: 22 },

  infoBox: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 15,
    marginBottom: 30,
    borderLeftWidth: 6,
    borderLeftColor: THEME_COLOR
  },
  infoText: { color: '#1B5E20', fontSize: 14, fontWeight: '600', fontStyle: 'italic', lineHeight: 20 },

  fullBackButton: {
    backgroundColor: THEME_COLOR,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4
  },
  fullBackButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default MindfulLivingScreen;