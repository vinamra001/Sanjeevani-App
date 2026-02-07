import React from 'react';
import { View, StyleSheet } from 'react-native'; // Added View and StyleSheet
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* This View is CRITICAL for ScrollViews inside the Navigator to work */}
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // This forces the app to occupy the full screen height
    backgroundColor: '#fff',
  },
});