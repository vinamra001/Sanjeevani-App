import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Platform,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomNavBar from '../components/BottomNavBar'; // ✅ Import global navbar

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const DietRecommendationsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState({ username: '', prakriti: 'General' });

  const fetchDietData = async () => {
    try {
      const username = await AsyncStorage.getItem('userName');

      // ✅ FIXED: Changed 10.21.69.216 to 10.0.2.2 for Android Emulator bridge
      const response = await axios.get(`http://10.0.2.2:8000/api/v1/get-profile/?username=${username}`, {
        timeout: 10000
      });

      setProfile(response.data);
    } catch (e) {
      console.error("Diet Fetch Error:", e);
      // Fallback: Use stored username if server is unreachable to keep the UI personalized
      const storedName = await AsyncStorage.getItem('userName');
      setProfile(prev => ({ ...prev, username: storedName || 'User' }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDietData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDietData();
  };

  // Diet data mapping based on Ayurvedic Prakriti
  const diets = useMemo(() => ({
    Pitta: {
      icon: '🔥',
      theme: '#E8F5E9',
      beneficial: ['Cucumber', 'Coconut Water', 'Sweet Fruits', 'Ghee', 'Coriander', 'Basmati Rice', 'Mint'],
      avoid: ['Red Chilies', 'Caffeine', 'Fried Foods', 'Vinegar', 'Garlic', 'Fermented Foods'],
      meals: {
        breakfast: ['Oatmeal with milk & raisins', 'Sweet ripe fruits'],
        lunch: ['Basmati rice with Moong dal', 'Cucumber raita', 'Steamed zucchini'],
        dinner: ['Light khichdi', 'Asparagus soup']
      },
      tips: ['Avoid skipping meals', 'Prefer room temp water', 'Eat in a cool environment']
    },
    Vata: {
      icon: '💨',
      theme: '#E3F2FD',
      beneficial: ['Warm Soups', 'Avocado', 'Cooked Grains', 'Sesame Oil', 'Ginger', 'Nuts', 'Dates'],
      avoid: ['Raw Salads', 'Cold Drinks', 'Dry Crackers', 'Beans', 'Cabbage', 'Frozen Foods'],
      meals: {
        breakfast: ['Warm rice pudding', 'Stewed apples'],
        lunch: ['Whole wheat roti', 'Root vegetable curry', 'Lentil soup'],
        dinner: ['Creamy vegetable soup', 'Pasta with olive oil']
      },
      tips: ['Eat at regular intervals', 'Favor warm/oily foods', 'Avoid stimulants']
    },
    Kapha: {
      icon: '💧',
      theme: '#FFF3E0',
      beneficial: ['Spicy Foods', 'Quinoa', 'Leafy Greens', 'Honey', 'Apples', 'Pumpkin Seeds', 'Turmeric'],
      avoid: ['Dairy Products', 'Cold Sweets', 'Wheat', 'Salt', 'Bananas', 'Heavy Oils'],
      meals: {
        breakfast: ['Baked fruit', 'Rye toast with honey'],
        lunch: ['Steamed veggies with ginger', 'Spiced chickpeas'],
        dinner: ['Millet roti', 'Clear vegetable broth']
      },
      tips: ['Eat only when hungry', 'Light exercise after meals', 'Favor dry/warm cooking']
    },
    General: {
      icon: '🌿',
      theme: '#F5F5F5',
      beneficial: ['Warm Water', 'Fresh Vegetables', 'Whole Grains', 'Honey'],
      avoid: ['Processed Foods', 'Excessive Sugar', 'Heavy Oils', 'Leftovers'],
      meals: {
        breakfast: ['Fresh fruits', 'Porridge'],
        lunch: ['Whole grain roti', 'Mixed vegetable'],
        dinner: ['Vegetable soup', 'Steamed rice']
      },
      tips: ['Eat mindfully', 'Stay hydrated', 'Eat with the sun']
    }
  }), []);

  // Make sure we select a valid diet profile, default to General if undefined
  const currentDietProfile = profile?.prakriti && diets[profile.prakriti] ? profile.prakriti : 'General';
  const currentDiet = diets[currentDietProfile];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
        <Text style={styles.loadingText}>Fetching your personalized plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dietary Recommendations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME_COLOR]} />
        }
      >
        <View style={[styles.doshaCard, { backgroundColor: currentDiet.theme }]}>
          <Text style={styles.doshaLabel}>Personalized for {profile.username}</Text>
          <View style={styles.doshaRow}>
            <Text style={styles.doshaIcon}>{currentDiet.icon}</Text>
            <Text style={styles.doshaValue}>{currentDietProfile}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.checkIco}>✓</Text>
            <Text style={styles.sectionTitle}>Foods to Favor</Text>
          </View>
          <View style={styles.chipContainer}>
            {currentDiet.beneficial.map((food) => (
              <View key={food} style={styles.chipBeneficial}>
                <Text style={styles.chipText}>{food}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.crossIco}>×</Text>
            <Text style={styles.sectionTitle}>Foods to Reduce</Text>
          </View>
          <View style={styles.chipContainer}>
            {currentDiet.avoid.map((food) => (
              <View key={food} style={styles.chipAvoid}>
                <Text style={styles.chipText}>{food}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.mainSectionTitle}>Suggested Meals</Text>
                <MealCard title="BREAKFAST" items={currentDiet.meals.breakfast} />
        <MealCard title="LUNCH" items={currentDiet.meals.lunch} />
        <MealCard title="DINNER" items={currentDiet.meals.dinner} />

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.lightIco}>💡</Text>
            <Text style={styles.sectionTitle}>Wellness Guidelines</Text>
          </View>
          <View style={styles.tipsList}>
            {currentDiet.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ✅ Increased padding to prevent overlap with the bottom navigation bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ✅ Add the global Bottom Nav Bar here */}
      <BottomNavBar navigation={navigation} activeScreen="" />
    </View>
  );
};

const MealCard = ({ title, items }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.mealIco}>🍴</Text>
      <Text style={[styles.sectionTitle, { color: '#2D7D46' }]}>{title}</Text>
    </View>
    <View style={styles.mealList}>
      {items.map((item, index) => (
        <View key={index} style={styles.mealItemRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.mealItemText}>{item}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAF8' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15, backgroundColor: THEME_COLOR, elevation: 8,
  },
  backBtn: { padding: 5 },
  backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitle: { fontSize: 19, fontWeight: 'bold', color: '#FFF' },
  scrollContent: { padding: 15 },
  doshaCard: { padding: 25, borderRadius: 20, marginBottom: 20, alignItems: 'center', elevation: 4 },
  doshaLabel: { color: '#4D7C59', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  doshaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  doshaIcon: { fontSize: 32, marginRight: 10 },
  doshaValue: { fontSize: 36, fontWeight: 'bold', color: '#1B5E20' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 18, marginBottom: 15, elevation: 3, borderWidth: 1, borderColor: '#F0F0F0' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', textTransform: 'uppercase', letterSpacing: 1 },
  checkIco: { color: '#2D7D46', fontSize: 20, marginRight: 10, fontWeight: 'bold' },
  crossIco: { color: '#D32F2F', fontSize: 22, marginRight: 10, fontWeight: 'bold' },
  mealIco: { fontSize: 18, marginRight: 10 },
  lightIco: { fontSize: 18, marginRight: 10 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipBeneficial: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#C8E6C9' },
  chipAvoid: { backgroundColor: '#FFEBEE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  chipText: { fontSize: 12, color: '#444', fontWeight: '600' },
  mainSectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B5E20', marginBottom: 15, marginTop: 10, marginLeft: 5 },
  mealItemRow: { flexDirection: 'row', marginBottom: 8, paddingLeft: 5 },
  bullet: { fontSize: 18, color: '#2D7D46', marginRight: 10 },
  mealItemText: { fontSize: 15, color: '#444' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  tipBullet: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#2D7D46', marginRight: 12, marginTop: 7 },
  tipText: { fontSize: 14, color: '#444', flex: 1, lineHeight: 21 }
});

export default DietRecommendationsScreen;