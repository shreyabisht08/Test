// src/screens/PatientAuthScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const PatientAuthScreen = ({ onAccountCreated, onNavigateBack }) => {
    const [Fullname, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        setLoading(true);
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => { // ✅ Made this function async
                console.log('User account created successfully!');
                
                // ✅ We now handle the email sending more carefully
                try {
                    await userCredential.user.sendEmailVerification();
                    console.log('Verification email sent successfully.');
                } catch (emailError) {
                    // If sending fails, we alert the user but DON'T stop them.
                    console.error("Failed to send verification email:", emailError);
                    Alert.alert(
                        "Account Created",
                        "We couldn't send a verification email. You can try resending it on the next screen."
                    );
                }

                // ✅ IMPORTANT: We navigate to the next screen no matter what.
                onAccountCreated();
            })
            .catch(error => {
                // This now correctly handles only the account creation errors
                let errorMessage = "An error occurred. Please try again.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'That email address is already in use! Please try logging in or resetting your password.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'That email address is invalid!';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Password should be at least 6 characters!';
                }
                Alert.alert("Sign Up Error", errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create Patient Account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={Fullname}
                    onChangeText={setName}
                    keyboardType="Fullname"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Create a Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreateAccount}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => onNavigateBack('signup_role_select')}
                >
                    <Text style={styles.backButtonText}>Back to Signup Options</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#eef2ff' },
    card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    backButton: { marginTop: 15, alignItems: 'center' },
    backButtonText: { color: '#4f46e5', textDecorationLine: 'underline' },
});

export default PatientAuthScreen;