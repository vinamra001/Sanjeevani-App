import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const AyurvedicRemediesScreen = ({ route, navigation }) => {
  // Destructuring remedies and disease name from navigation params
  const { remedies = [], diseaseName = 'Natural Remedies' } = route.params || {};

  const handleShare = async (remedy) => {
    try {
      await Share.share({
        message: `Sanjeevani AI Remedy for ${diseaseName}:\n\nHerb: ${remedy.name}\nPrep: ${remedy.preparation}\nUsage: ${remedy.usage_instructions || remedy.description}\nDosage: ${remedy.dosage}\n\nProcessed by Sanjeevani Ayurvedic Systems.`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the remedy.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* SOLID GREEN HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {diseaseName}
        </Text>

        <TouchableOpacity onPress={() => Alert.alert("Usage Guide", "Ayurvedic formulations (Churnas/Vatis) are most effective when taken with 'Anupana' (mediums) like warm water or honey.")}>
           <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.prakritiBanner}>
          <Text style={styles.prakritiText}>
            🌿 Classical formulations linked to your diagnosis.
            Always consult an Ayurvedic Practitioner for long-term use.
          </Text>
        </View>

        {remedies && remedies.length > 0 ? (
          remedies.map((remedy, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.herbName}>{remedy.name}</Text>
                  <Text style={styles.sanskritName}>
                    {remedy.sanskrit_name ? `Sanskrit: ${remedy.sanskrit_name}` : 'Classical Formulation'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleShare(remedy)} style={styles.shareBtn}>
                  <Text style={styles.shareIcon}>🔗</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.label}>📋 Description:</Text>
                <Text style={styles.infoText}>{remedy.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>🥣 Preparation:</Text>
                <Text style={styles.infoText}>{remedy.preparation || "Available as a ready-to-use formulation."}</Text>
              </View>

              <View style={styles.dosageContainer}>
                <View style={styles.dosageIconBox}>
                    <Text style={{fontSize: 20}}>⏳</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.dosageLabel}>RECOMMENDED DOSAGE</Text>
                    <Text style={styles.dosageValue}>{remedy.dosage}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍃</Text>
            <Text style={styles.noData}>We couldn't find specific remedies for this condition. Our AI assistant can help you further.</Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('Chat')}
            >
              <Text style={styles.chatButtonText}>Ask Sanjeevani AI Assistant</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MEDICAL DISCLAIMER - Essential for Viva */}
        <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
                Disclaimer: This information is for educational purposes. Ayurvedic treatment varies based on Prakriti and Agni. Do not self-medicate for chronic conditions.
            </Text>
        </View>

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
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  infoIcon: { fontSize: 22, color: '#FFF', paddingHorizontal: 5 },
  scrollContent: { padding: 15 },
  prakritiBanner: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  prakritiText: { color: '#1B5E20', fontSize: 13, fontWeight: '600', lineHeight: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  herbName: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20' },
  sanskritName: { fontSize: 14, fontStyle: 'italic', color: '#666', marginTop: 4 },
  shareBtn: { padding: 5 },
  shareIcon: { fontSize: 20 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  section: { marginBottom: 15 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', letterSpacing: 1 },
  infoText: { fontSize: 14, color: '#444', marginTop: 5, lineHeight: 22 },
  dosageContainer: {
    marginTop: 5,
    padding: 15,
    backgroundColor: '#F1F8E9',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dosageIconBox: { width: 30, marginRight: 10 },
  dosageLabel: { fontSize: 10, color: '#558B2F', fontWeight: 'bold' },
  dosageValue: { color: '#1B5E20', fontWeight: 'bold', fontSize: 15, marginTop: 2 },
  disclaimerBox: { marginTop: 10, padding: 15, opacity: 0.6 },
  disclaimerText: { fontSize: 11, color: '#666', textAlign: 'center', fontStyle: 'italic' },
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 30 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  noData: { textAlign: 'center', color: '#666', fontSize: 16, marginBottom: 25 },
  chatButton: { backgroundColor: THEME_COLOR, paddingHorizontal: 25, paddingVertical: 15, borderRadius: 30 },
  chatButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});

export default AyurvedicRemediesScreen;