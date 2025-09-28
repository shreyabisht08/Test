// src/screens/VerifyEmailScreen.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

const VerifyEmailScreen = ({ onVerified, onNavigateBack }) => {
    const [loading, setLoading] = useState(false);
    const userEmail = auth().currentUser?.email;

    const handleCheckVerification = async () => {
        setLoading(true);
        const currentUser = auth().currentUser;
        
        // You must reload the user's profile to get the latest status from Firebase
        await currentUser.reload();

        if (currentUser.emailVerified) {
            onVerified(); // Success, navigate to the patient form
        } else {
            Alert.alert(
                "Email Not Verified",
                "Please click the link in your email first. If you don't see it, check your spam folder."
            );
        }
        setLoading(false);
    };

    const handleResendEmail = () => {
        auth().currentUser?.sendEmailVerification()
            .then(() => {
                Alert.alert("Email Sent!", "A new verification link has been sent to your email address.");
            })
            .catch(error => {
                Alert.alert("Error", "There was a problem sending the email. Please try again.");
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.text}>
                    A verification link has been sent to:
                </Text>
                <Text style={styles.emailText}>{userEmail}</Text>
                <Text style={styles.text}>
                    Please click the link to activate your account. Once you have, press the button below.
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleCheckVerification} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>I've Verified My Email</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={handleResendEmail}>
                    <Text style={styles.linkButtonText}>Resend Verification Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={() => onNavigateBack('signup_role_select')}>
                    <Text style={styles.linkButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#eef2ff' },
    card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, elevation: 5, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    text: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 10 },
    emailText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    linkButton: { marginTop: 20 },
    linkButtonText: { color: '#4f46e5', textDecorationLine: 'underline', fontSize: 16 },
});

export default VerifyEmailScreen;