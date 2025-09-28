import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// --- Sign Up Role Selection Screen Component ---
const SignUpScreen = ({ languageText, onNavigateBack }) => {

    // Placeholder function for doctor & pharmacist
    const handleRoleSelection = (role) => {
        Alert.alert(
            languageText.signup_select_role_title || "Role Selected",
            `Navigating to the ${role.toUpperCase()} Sign Up Form!`
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {languageText.signup_select_role_title}
                </Text>
                <Text style={styles.text}>
                    {languageText.signup_select_role_text}
                </Text>

                {/* Patient Button */}
                <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: '#3b82f6' }]}
            // ✅ CHANGED: Navigate to the new email auth screen
            onPress={() => onNavigateBack('patient_auth')}
            activeOpacity={0.8}
        >
            <Text style={styles.roleButtonText}>{languageText.role_patient_button}</Text>
        </TouchableOpacity>

                {/* Doctor Button */}
                <TouchableOpacity 
                    style={[styles.roleButton, { backgroundColor: '#22c55e' }]}
                    onPress={() => onNavigateBack('doctor_auth')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.roleButtonText}>{languageText.role_doctor_button}</Text>
                </TouchableOpacity>

                {/* Pharmacist Button */}
                <TouchableOpacity 
                    style={[styles.roleButton, { backgroundColor: '#f97316' }]}
                    onPress={() => onNavigateBack('pharmacist_auth')}
>
                    <Text style={styles.roleButtonText}>{languageText.role_pharmacist_button}</Text>
                </TouchableOpacity>
                
                {/* Back Button */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => onNavigateBack('home')}
                >
                    <Text style={styles.backButtonText}>{languageText.back_button}</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f3f4f6', // gray-100
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        marginTop: 50,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        color: '#1f2937', // gray-800
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: '#4b5563', // gray-600
        marginBottom: 24,
    },
    roleButton: {
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    roleButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#4b5563', // gray-600
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});

export default SignUpScreen;
