import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this

const API_URL = 'http://10.0.2.2:8000/api/v1/login/';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState(''); // Changed from email to username
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        if (!cleanUsername || !cleanPassword) {
            Alert.alert("Error", "Please enter both username and password.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    password: cleanPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login Success! Token:", data.token);

                // --- PERSISTENCE LOGIC ---
                // Save the token and username locally on the phone
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userName', cleanUsername);

                // Navigate to the next screen (Home or Main)
                navigation.replace('Home');
            } else {
                Alert.alert("Login Failed", data.error || "Invalid username or password.");
            }
        } catch (error) {
            console.error("Network Error:", error);
            Alert.alert(
                "Connection Error",
                "Cannot reach the server. Make sure Django is running."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>SANJEEVANI</Text>
                    <Text style={styles.subtitle}>Smart Health Assistant</Text>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.welcomeText}>Welcome Back</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={styles.footerLink}
                    >
                        <Text style={styles.linkText}>
                            Don't have an account? <Text style={styles.boldGreen}>Register</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#fff', padding: 30 },
    headerSection: { marginTop: 60, marginBottom: 40, alignItems: 'center' },
    title: { fontSize: 36, fontWeight: '900', color: '#2E7D32', letterSpacing: 3 },
    subtitle: { fontSize: 14, color: '#666', fontWeight: '500', letterSpacing: 1 },
    formSection: { flex: 1 },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 30 },
    inputContainer: { marginBottom: 25 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginLeft: 4 },
    input: { height: 55, borderColor: '#f0f0f0', borderWidth: 2, borderRadius: 14, marginBottom: 20, paddingHorizontal: 15, backgroundColor: '#fafafa', fontSize: 16, color: '#000' },
    loginButton: { backgroundColor: '#2E7D32', height: 55, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    disabledButton: { backgroundColor: '#A5D6A7' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    footerLink: { marginTop: 30 },
    linkText: { textAlign: 'center', fontSize: 15, color: '#666' },
    boldGreen: { color: '#2E7D32', fontWeight: 'bold' }
});

export default LoginScreen;