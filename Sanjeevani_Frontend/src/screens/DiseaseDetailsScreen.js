import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

const DiseaseDetailsScreen = ({ route, navigation }) => {
  const { diseaseId, diseaseName } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/diseases/${diseaseId}/`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [diseaseId]);

  if (loading) return <ActivityIndicator size="large" color="#2E7D32" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{data?.name}</Text>
        <Text style={styles.sanskrit}>{data?.sanskrit_name}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>{data?.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Dietary Recommendations</Text>
          <Text style={styles.text}>{data?.diet_plan}</Text>
        </View>

        <TouchableOpacity
          style={styles.remedyButton}
          onPress={() => navigation.navigate('AyurvedicRemedies', {
            remedies: data.remedies,
            diseaseName: data.name
          })}
        >
          <Text style={styles.remedyButtonText}>🌿 View Herbal Remedies</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  sanskrit: { fontSize: 18, color: '#666', fontStyle: 'italic', marginBottom: 20 },
  section: { marginBottom: 25 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  text: { fontSize: 16, color: '#555', lineHeight: 24 },
  remedyButton: { backgroundColor: '#2E7D32', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  remedyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default DiseaseDetailsScreen;