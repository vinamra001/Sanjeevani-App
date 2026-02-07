import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const SYMPTOM_CATEGORIES = [
  { title: 'General & Fever', data: ['Fatigue', 'Weight Loss', 'Restlessness', 'Lethargy', 'High Fever', 'Chills', 'Mild Fever', 'Malaise', 'Phlegm', 'Sweating'] },
  { title: 'Digestive & Abdominal', data: ['Vomiting', 'Indigestion', 'Constipation', 'Abdominal Pain', 'Diarrhoea', 'Nausea', 'Acidity', 'Stomach Pain', 'Distention of Abdomen', 'Swelling of Stomach'] },
  { title: 'Skin & External', data: ['Itching', 'Skin Rash', 'Nodal Skin Eruptions', 'Dischromic Patches', 'Yellowish Skin', 'Bruising', 'Brittle Nails', 'Pus Filled Pimples', 'Blackheads', 'Scurrying', 'Inflammatory Nails'] },
  { title: 'Respiratory', data: ['Continuous Sneezing', 'Cough', 'Breathlessness', 'Throat Irritation', 'Fast Heart Rate', 'Chest Pain', 'Sinus Pressure', 'Runny Nose', 'Congestion'] },
  { title: 'Pain & Muscles', data: ['Joint Pain', 'Headache', 'Back Pain', 'Neck Pain', 'Muscle Pain', 'Stiff Neck', 'Knee Pain', 'Hip Joint Pain', 'Muscle Weakness', 'Muscle Wasting'] }
];

const InputScreen = ({ navigation }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [contentHeight, setContentHeight] = useState(1);
  const [visibleHeight, setVisibleHeight] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  const toggleSymptom = (name) => {
    if (selectedSymptoms.includes(name)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== name));
    } else {
      setSelectedSymptoms([...selectedSymptoms, name]);
    }
  };

  const handleAnalysis = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert("No Selection", "Please select at least one symptom to run the analysis.");
      return;
    }
    navigation.navigate('Results', { symptoms: selectedSymptoms });
  };

  const scrollIndicatorSize = visibleHeight > 0 ? (visibleHeight * visibleHeight) / contentHeight : 0;
  const scrollIndicatorPosition = Animated.multiply(
    scrollY,
    visibleHeight / contentHeight
  ).interpolate({
    inputRange: [0, Math.max(0, contentHeight - visibleHeight)],
    outputRange: [0, Math.max(0, visibleHeight - scrollIndicatorSize)],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* UNIFIED SOLID GREEN HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Symptom Selection</Text>
            {selectedSymptoms.length > 0 && (
                <Text style={styles.headerSubtitle}>{selectedSymptoms.length} Selected</Text>
            )}
        </View>
        <TouchableOpacity onPress={() => setSelectedSymptoms([])}>
            <Text style={styles.clearText}>{selectedSymptoms.length > 0 ? 'Clear' : ''}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onContentSizeChange={(w, h) => setContentHeight(h)}
          onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <Text style={styles.subHeading}>Tap symptoms to begin your Ayurvedic diagnosis</Text>

          {SYMPTOM_CATEGORIES.map((category) => (
            <View key={category.title} style={styles.catSection}>
              <Text style={styles.sectionTitle}>{category.title}</Text>
              <View style={styles.grid}>
                {category.data.map((item) => {
                  const isSelected = selectedSymptoms.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.7}
                      style={[styles.commonChip, isSelected && styles.commonChipActive]}
                      onPress={() => toggleSymptom(item)}
                    >
                      <Text style={[styles.commonChipText, isSelected && styles.commonChipTextActive]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
          <View style={{ height: 160 }} />
        </ScrollView>

        {/* CUSTOM SIDEBAR SCROLLBAR */}
        <View style={styles.scrollbarTrack}>
          <Animated.View
            style={[
              styles.scrollbarThumb,
              {
                height: Math.max(20, scrollIndicatorSize),
                transform: [{ translateY: scrollIndicatorPosition }],
              },
            ]}
          />
        </View>
      </View>

      {/* BOTTOM ACTION BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.predictButton, selectedSymptoms.length === 0 && styles.disabledButton]}
          onPress={handleAnalysis}
          activeOpacity={0.8}
        >
          <Text style={styles.predictButtonText}>Run Ayurvedic Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8FAF8' },
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
  backButton: { width: 40 },
  backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitleContainer: { alignItems: 'center', flex: 1 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#E8F5E9', fontSize: 12, fontWeight: '600' },
  clearText: { color: '#FFF', fontSize: 14, width: 40, textAlign: 'right' },

  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 15 },
  subHeading: { fontSize: 14, color: '#666', marginBottom: 25, fontStyle: 'italic', lineHeight: 20 },
  catSection: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: THEME_COLOR, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  commonChip: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  commonChipActive: { backgroundColor: THEME_COLOR, borderColor: THEME_COLOR },
  commonChipText: { color: '#444', fontSize: 13, fontWeight: '500' },
  commonChipTextActive: { color: '#FFF', fontWeight: 'bold' },

  scrollbarTrack: { width: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginVertical: 20, marginRight: 2 },
  scrollbarThumb: { width: 4, backgroundColor: THEME_COLOR, borderRadius: 2, opacity: 0.5 },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  predictButton: { backgroundColor: THEME_COLOR, padding: 18, borderRadius: 15, alignItems: 'center', elevation: 4 },
  disabledButton: { backgroundColor: '#A5D6A7' },
  predictButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default InputScreen;