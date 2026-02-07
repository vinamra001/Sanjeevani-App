import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, Alert,
    TouchableOpacity, ActivityIndicator, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Required for Gender
import axios from 'axios';

// Special IP for Android Emulator to reach your PC
const API_URL = 'http://10.0.2.2:8000/api/v1/register/';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState(''); // Use username as unique ID
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male'); // Default
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        // 1. Validation
        if (!cleanUsername || !cleanEmail || !password || !age) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            // 2. Real API Call to Django
            const response = await axios.post(API_URL, {
                username: cleanUsername,
                email: cleanEmail,
                password: password,
                age: parseInt(age), // Ensure it's a number
                gender: gender
            });

            setIsLoading(false);
            Alert.alert("Success", `Namaste ${cleanUsername}! Your Sanjeevani profile is ready.`, [
                { text: "Login Now", onPress: () => navigation.navigate('Login') }
            ]);

        } catch (error) {
            setIsLoading(false);
            console.error("Registration Error:", error.response?.data);
            const errorMsg = error.response?.data?.error || "Connection failed. Is the server running?";
            Alert.alert("Registration Failed", errorMsg);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>SANJEEVANI</Text>
            <Text style={styles.subtitle}>Create your medical profile</Text>
            <Text style={styles.ayurvedaText}>Personalize your wellness journey</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Choose a unique username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="user@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.inputLabel}>Age</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Years"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ flex: 1.5 }}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue) => setGender(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
                <Text style={styles.linkText}>
                    Already have an account? <Text style={styles.boldGreen}>Login</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: '900', textAlign: 'center', color: '#2e7d32', letterSpacing: 2 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 5 },
    ayurvedaText: { fontSize: 14, color: '#4caf50', textAlign: 'center', fontStyle: 'italic', marginBottom: 25 },
    inputContainer: { marginBottom: 20 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginLeft: 4 },
    input: { height: 50, borderColor: '#eee', borderWidth: 2, borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, backgroundColor: '#fcfcfc' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    pickerWrapper: { height: 50, borderColor: '#eee', borderWidth: 2, borderRadius: 12, backgroundColor: '#fcfcfc', justifyContent: 'center' },
    picker: { height: 50, width: '100%' },
    registerButton: { backgroundColor: '#2e7d32', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    disabledButton: { backgroundColor: '#a5d6a7' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    footerLink: { marginTop: 25 },
    linkText: { textAlign: 'center', fontSize: 15, color: '#666' },
    boldGreen: { color: '#2e7d32', fontWeight: 'bold' }
});

export default RegisterScreen;