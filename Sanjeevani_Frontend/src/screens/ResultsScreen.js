import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar'; // ✅ Import the global navbar

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';
const THEME_COLOR = '#2D7D46';

const ResultsScreen = ({ route, navigation }) => {
  const { symptoms, dosha, userName, isGuest } = route.params || {
      symptoms: [],
      dosha: 'Unknown',
      userName: '',
      isGuest: false
  };

  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/predict/`, {
        symptom_names: symptoms,
        username: userName,
        dosha: dosha
      }, { timeout: 15000 });

      if (response.data && Array.isArray(response.data.predictions)) {
        setPredictions(response.data.predictions);
      }
    } catch (error) {
      console.error("Prediction API Error:", error.message);
      Alert.alert(
        "Connection Issue",
        "Sanjeevani could not reach the diagnosis engine. Please ensure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewRemedies = async (item) => {
    try {
      if (!isGuest) {
          const historyData = {
            name: item.name,
            remedies: item.remedies || [],
            diet: item.diet_plan
          };
          await AsyncStorage.setItem('last_diagnosis', JSON.stringify(historyData));
      }

      navigation.navigate('AyurvedicRemedies', {
        remedies: item.remedies || [],
        diseaseName: item.name
      });
    } catch (e) {
      console.error("History Save Error:", e);
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
            {isGuest ? "Family Diagnosis" : "Diagnosis Results"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
          <Text style={styles.loaderText}>Consulting Vedic Records...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.infoBanner}>
            <Text style={styles.bannerText}>
                {predictions.length > 0
                  ? `Found ${predictions.length} matching Ayurvedic conditions`
                  : "Analysis Complete"}
            </Text>
          </View>

          {predictions.map((item, index) => (
            <View key={index} style={styles.conditionCard}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.conditionMainTitle}>{item.name}</Text>
                  <Text style={styles.conditionSanskrit}>{item.sanskrit_name}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.dosha_type || 'General'}</Text>
                </View>
              </View>

              <View style={styles.confidenceSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.confLabel}>Match Confidence</Text>
                  <Text style={[styles.confValue, { color: item.confidence > 70 ? THEME_COLOR : '#FBC02D' }]}>
                    {item.confidence}%
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${item.confidence}%`,
                        backgroundColor: item.confidence > 70 ? THEME_COLOR : '#FBC02D'
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.dietCard}>
                <View style={styles.dietHeaderRow}>
                  <Text style={styles.dietEmoji}>🥗</Text>
                  <Text style={styles.dietTitle}>Dietary Recommendation</Text>
                </View>
                <Text style={styles.dietText}>{item.diet_plan || "Consult an expert for a specific diet."}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.matchTag}>📍 Based on {item.match_count} symptoms</Text>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                activeOpacity={0.8}
                onPress={() => handleViewRemedies(item)}
              >
                <Text style={styles.detailsButtonText}>View Natural Remedies</Text>
              </TouchableOpacity>
            </View>
          ))}

          {predictions.length === 0 && (
            <View style={styles.emptyContainer}>
               <Text style={styles.emptyEmoji}>🍃</Text>
               <Text style={styles.emptyText}>No specific Ayurvedic conditions matched these symptoms.</Text>
               <TouchableOpacity onPress={handleGoBack} style={styles.retryBtn}>
                  <Text style={styles.retryText}>Try Refining Symptoms</Text>
               </TouchableOpacity>
            </View>
          )}

          {/* ✅ Increased padding to ensure bottom cards aren't hidden behind the floating navbar */}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      {/* ✅ Add the global Bottom Nav Bar here */}
      <BottomNavBar navigation={navigation} activeScreen={isGuest ? "Family" : ""} />

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
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 15, color: THEME_COLOR, fontWeight: '600' },
  infoBanner: {
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  bannerText: { color: THEME_COLOR, fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  conditionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  conditionMainTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20', letterSpacing: -0.5 },
  conditionSanskrit: { fontSize: 14, color: '#666', fontStyle: 'italic', marginTop: 2 },
  badge: {
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E7D0'
  },
  badgeText: { color: THEME_COLOR, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  confidenceSection: { marginTop: 18, marginBottom: 10 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  confLabel: { fontSize: 12, color: '#888', fontWeight: 'bold', textTransform: 'uppercase' },
  confValue: { fontSize: 15, fontWeight: 'bold' },
  progressBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  dietCard: {
    backgroundColor: '#F1F8E9',
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  dietHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dietEmoji: { fontSize: 18, marginRight: 8 },
  dietTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32' },
  dietText: { fontSize: 13, color: '#444', lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  matchTag: { fontSize: 12, color: '#777', fontWeight: '500' },
  detailsButton: {
    marginTop: 20,
    backgroundColor: THEME_COLOR,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  detailsButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 50, marginBottom: 20 },
  emptyText: { color: '#666', textAlign: 'center', lineHeight: 22, fontSize: 15, marginBottom: 30 },
  retryBtn: { paddingVertical: 15, paddingHorizontal: 30, backgroundColor: THEME_COLOR, borderRadius: 12 },
  retryText: { color: '#FFF', fontWeight: 'bold' }
});

export default ResultsScreen;