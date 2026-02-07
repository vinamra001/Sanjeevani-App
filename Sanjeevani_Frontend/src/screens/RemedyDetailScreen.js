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

const RemedyDetailScreen = ({ navigation, route }) => {
  const { remedy } = route.params || {};

  if (!remedy) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />
        <Text style={styles.errorEmoji}>🍃</Text>
        <Text style={styles.errorText}>Remedy details not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* UNIFIED SOLID GREEN HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Remedy Guide</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.headerIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{remedy.title}</Text>
          <Text style={styles.sanskritTitle}>{remedy.sanskrit}</Text>
        </View>



        {/* Benefits Overview */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardIcon}>✨</Text>
            <Text style={styles.cardLabel}>Primary Benefits</Text>
          </View>
          <Text style={styles.cardText}>{remedy.benefit}</Text>
        </View>

        {/* Ingredients List */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Required Ingredients</Text>
        </View>
        <View style={styles.ingredientsContainer}>
          {remedy.ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.greenDot} />
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}
        </View>

        [Image showing the measurement of raw Ayurvedic ingredients in traditional units]

        {/* Preparation Steps */}
        <View style={styles.highlightCard}>
          <View style={styles.row}>
            <Text style={styles.cardIcon}>🥣</Text>
            <Text style={[styles.cardLabel, { color: '#1B5E20' }]}>Preparation Method</Text>
          </View>
          <Text style={styles.prepText}>{remedy.preparation}</Text>
        </View>



        {/* Usage & Dosage */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardIcon}>🕒</Text>
            <Text style={styles.cardLabel}>Usage Instructions</Text>
          </View>
          <Text style={styles.cardText}>{remedy.usage}</Text>

          <View style={styles.dosageBadge}>
            <Text style={styles.dosageLabel}>RECOMMENDED DOSAGE: </Text>
            <Text style={styles.dosageValue}>{remedy.dose}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.fullBackButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.fullBackButtonText}>Back to All Remedies</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
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
  headerIcon: { fontSize: 22, color: '#FFF' },
  iconButton: { padding: 5 },

  scrollContent: { padding: 20 },
  titleSection: { marginBottom: 25 },
  mainTitle: { fontSize: 30, fontWeight: 'bold', color: '#1B5E20', letterSpacing: -0.5 },
  sanskritTitle: { fontSize: 18, color: '#4D7C59', fontStyle: 'italic', marginTop: 4 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  highlightCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    elevation: 2
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcon: { fontSize: 22, marginRight: 12 },
  cardLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: 1 },
  cardText: { fontSize: 15, color: '#444', lineHeight: 24 },
  prepText: { fontSize: 15, color: '#1B5E20', lineHeight: 24, fontWeight: '500' },

  sectionHeader: { marginBottom: 15, borderLeftWidth: 5, borderLeftColor: THEME_COLOR, paddingLeft: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  ingredientsContainer: { marginBottom: 25, paddingLeft: 5 },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME_COLOR, marginRight: 15 },
  ingredientText: { fontSize: 16, color: '#444', fontWeight: '600' },

  dosageBadge: {
    marginTop: 18,
    backgroundColor: '#F1F8E9',
    padding: 14,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCEDC8'
  },
  dosageLabel: { fontSize: 12, fontWeight: 'bold', color: '#558B2F' },
  dosageValue: { fontSize: 12, fontWeight: 'bold', color: THEME_COLOR, marginLeft: 5 },

  fullBackButton: { backgroundColor: THEME_COLOR, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 4 },
  fullBackButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAF8' },
  errorEmoji: { fontSize: 60, marginBottom: 20 },
  errorText: { fontSize: 18, color: '#666', fontWeight: '500' },
  retryBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, backgroundColor: THEME_COLOR, borderRadius: 10 },
  retryBtnText: { color: '#FFF', fontWeight: 'bold' }
});

export default RemedyDetailScreen;