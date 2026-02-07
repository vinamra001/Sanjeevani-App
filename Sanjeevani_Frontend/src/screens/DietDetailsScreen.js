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
const THEME_COLOR = '#2D7D46'; // Unified Project Green

const DietDetailsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Nutrition Science</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>Balanced Ayurvedic Diet</Text>
          <Text style={styles.subtitle}>The Science of Six Tastes (Rasas)</Text>
        </View>



        <View style={styles.card}>
          <Text style={styles.cardTitle}>What is a Balanced Diet?</Text>
          <Text style={styles.description}>
            In Ayurveda, balance isn't just about macronutrients or calories. It’s about
            including all **six tastes** in your meals to ensure your body, mind,
            and soul are satisfied. Each taste has a specific effect on your Doshas.
          </Text>
        </View>



        <View style={styles.tasteSection}>
          <Text style={styles.sectionTitle}>The Six Tastes (Rasas)</Text>

          <TasteItem
            emoji="🍯"
            title="Sweet (Madhura)"
            desc="Grains, Fruits, Milk. Increases Kapha, Decreases Vata/Pitta. Elements: Earth & Water."
          />
          <TasteItem
            emoji="🍋"
            title="Sour (Amla)"
            desc="Citrus, Fermented foods. Increases Pitta, Decreases Vata. Elements: Earth & Fire."
          />
          <TasteItem
            emoji="🧂"
            title="Salty (Lavana)"
            desc="Sea Salt, Kelp. Increases Pitta, Decreases Vata. Elements: Water & Fire."
          />
          <TasteItem
            emoji="🌶️"
            title="Pungent (Katu)"
            desc="Ginger, Peppers, Garlic. Increases Pitta/Vata, Decreases Kapha. Elements: Fire & Air."
          />
          <TasteItem
            emoji="🥬"
            title="Bitter (Tikta)"
            desc="Leafy Greens, Turmeric. Increases Vata, Decreases Pitta/Kapha. Elements: Air & Space."
          />
          <TasteItem
            emoji="🍐"
            title="Astringent (Kashaya)"
            desc="Beans, Broccoli, Pomegranate. Increases Vata, Decreases Pitta/Kapha. Elements: Air & Earth."
          />
        </View>



        <View style={styles.infoBox}>
           <Text style={styles.infoText}>
             💡 Tip: Start your meal with Sweet tastes (digests slowest) and end with Astringent tastes (cleanses the palate and reduces cravings).
           </Text>
        </View>

        <TouchableOpacity
          style={styles.fullBackButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.fullBackButtonText}>Return to Diet Plan</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// Sub-component for Taste Items
const TasteItem = ({ emoji, title, desc }) => (
  <View style={styles.tasteItem}>
    <View style={styles.tasteHeader}>
      <Text style={styles.tasteEmoji}>{emoji}</Text>
      <Text style={styles.tasteTitle}>{title}</Text>
    </View>
    <Text style={styles.tasteDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },

  // UNIFIED GREEN HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: THEME_COLOR,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backButton: { padding: 5 },
  backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

  scrollContent: { padding: 20 },
  introSection: { marginBottom: 25 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { lineHeight: 22, color: '#555', fontSize: 15 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: THEME_COLOR, marginBottom: 15 },

  tasteItem: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tasteHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  tasteEmoji: { fontSize: 22, marginRight: 10 },
  tasteTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  tasteDesc: { fontSize: 14, color: '#666', lineHeight: 21 },

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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  fullBackButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default DietDetailsScreen;