import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- SCREEN IMPORTS ---
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import ResultsScreen from '../screens/ResultsScreen';
import BlogScreen from '../screens/BlogScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import DiseaseDetailsScreen from '../screens/DiseaseDetailsScreen';
import RemedyDetailScreen from '../screens/RemedyDetailScreen';
import GeneratePrescriptionScreen from '../screens/GeneratePrescriptionScreen';
import MorningRoutineScreen from '../screens/MorningRoutineScreen';
import DietRecommendationsScreen from '../screens/DietRecommendationsScreen';
import AyurvedicRemediesScreen from '../screens/AyurvedicRemediesScreen';
import DietDetailsScreen from '../screens/DietDetailsScreen';
import MindfulLivingScreen from '../screens/MindfulLivingScreen';
import DoshaQuizScreen from '../screens/DoshaQuizScreen';
import AboutScreen from '../screens/AboutScreen';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const Stack = createNativeStackNavigator();

// --- SPLASH SCREEN LOGIC ---
const SplashScreen = ({ navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
    }).start();

    const timer = setTimeout(() => {
        navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={splashStyles.container}>
      {/* Set status bar for splash to be clean white */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <Animated.View style={[splashStyles.content, { opacity: fadeAnim }]}>
        <View style={splashStyles.logoCircle}>
            <Text style={splashStyles.logoEmoji}>🌿</Text>
        </View>
        <Text style={splashStyles.brandName}>SANJEEVANI</Text>
        <Text style={splashStyles.tagline}>Smart Ayurvedic Assistant</Text>
      </Animated.View>
    </View>
  );
};

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        // 🔥 CRITICAL: This removes the gray system header from ALL screens
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        contentStyle: { backgroundColor: '#F8FAF8' } // Sets a consistent background for the whole app
      }}
    >
      {/* 1. AUTHENTICATION & SPLASH */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* 2. MAIN DASHBOARD */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* 3. CORE AI & DIAGNOSIS */}
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Blog" component={BlogScreen} />

      {/* 4. PROFILE & SETTINGS */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />

      {/* 5. DETAILS & REMEDIES */}
      <Stack.Screen name="AyurvedicRemedies" component={AyurvedicRemediesScreen} />
      <Stack.Screen name="RemedyDetail" component={RemedyDetailScreen} />
      <Stack.Screen name="DiseaseDetails" component={DiseaseDetailsScreen} />

      {/* 6. DIET & NUTRITION */}
      <Stack.Screen name="DietRecommendations" component={DietRecommendationsScreen} />
      <Stack.Screen name="DietDetails" component={DietDetailsScreen} />

      {/* 7. LIFESTYLE & UTILITIES */}
      <Stack.Screen name="MorningRoutine" component={MorningRoutineScreen} />
      <Stack.Screen name="MindfulLiving" component={MindfulLivingScreen} />
      <Stack.Screen name="GeneratePrescription" component={GeneratePrescriptionScreen} />

      {/* 8. DOSHA QUIZ */}
      <Stack.Screen name="DoshaQuiz" component={DoshaQuizScreen} />

    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

const splashStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logoCircle: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: '#F1F8E9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 25,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 }
    })
  },
  logoEmoji: { fontSize: 70 },
  brandName: { fontSize: 36, fontWeight: '900', color: THEME_COLOR, letterSpacing: 6 },
  tagline: { fontSize: 14, color: '#666', fontWeight: '600', marginTop: 8, letterSpacing: 1.5 },
});