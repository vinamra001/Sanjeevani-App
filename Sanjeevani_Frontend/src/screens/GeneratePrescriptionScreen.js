import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46'; // Unified Project Green

const GeneratePrescriptionScreen = ({ navigation, route }) => {
  const [notes, setNotes] = useState('');

  // Data passed from previous results/diagnostics
  const {
    condition = 'General Wellness',
    ayurvedicName = 'Swasthavritta',
    date = new Date().toLocaleDateString()
  } = route.params || {};

  const checklistItems = [
    "Classical Ayurvedic Herbology",
    "Home Remedies & Lifestyle Modifiers",
    "Prakriti-based Diet Plan",
    "Pathya (Beneficial) Foods",
    "Apathya (Foods to Avoid)",
    "Mental Wellness & Sattva Tips"
  ];

  const handleGenerate = () => {
    Alert.alert(
      "Success",
      "Digital Prescription has been generated and saved to your health profile.",
      [{ text: "View Profile", onPress: () => navigation.navigate('Profile') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. STATUS BAR SYNC */}
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* 2. CONSISTENT GREEN HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Prescription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Prescription Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
             <Text style={styles.bannerIcon}>📋</Text>
             <Text style={styles.bannerTitle}>Diagnostic Summary</Text>
          </View>

          <View style={styles.dividerLight} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{date}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Condition:</Text>
            <Text style={styles.summaryValue}>{condition}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sanskrit ID:</Text>
            <Text style={styles.summaryValue}>{ayurvedicName}</Text>
          </View>
        </View>

        {/* Components Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Prescription Components</Text>
          <Text style={styles.sectionSubtitle}>
            Your final E-PDF will include the following personalized modules:
          </Text>

          <View style={styles.checklistCard}>
            {checklistItems.map((item, index) => (
              <View key={index} style={styles.checkItemRow}>
                <View style={styles.checkbox}>
                    <Text style={styles.checkTick}>✓</Text>
                </View>
                <Text style={styles.checkItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Vaidya/User Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add specific observations, e.g., 'Feeling better after 2 days' or 'Note about pulse'."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
        >
          <Text style={styles.generateButtonText}>Generate Health Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },

  // UNIFIED GREEN HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 70,
    backgroundColor: THEME_COLOR,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  backButton: { padding: 5 },
  backArrow: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 19, fontWeight: 'bold' },

  scrollContent: { padding: 15 },

  // Summary Card
  summaryCard: {
    backgroundColor: THEME_COLOR,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 25,
  },
  summaryHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bannerIcon: { fontSize: 24, marginRight: 10 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  dividerLight: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
  summaryRow: { flexDirection: 'row', marginBottom: 10 },
  summaryLabel: { color: '#E8F5E9', fontSize: 14, width: 110 },
  summaryValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold', flex: 1 },

  // Details Section
  detailsSection: { paddingHorizontal: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  sectionSubtitle: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 18 },

  checklistCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
  },
  checkItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME_COLOR
  },
  checkTick: { color: THEME_COLOR, fontWeight: 'bold', fontSize: 14 },
  checkItemText: { color: '#444', fontSize: 14, fontWeight: '500' },

  // Notes Section
  notesSection: { paddingHorizontal: 5, marginTop: 25 },
  notesTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  notesInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    height: 110,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#333',
    elevation: 1
  },

  // Bottom Button
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  generateButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GeneratePrescriptionScreen;