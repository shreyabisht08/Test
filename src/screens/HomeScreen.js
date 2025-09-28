import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ languageText, onNavigate }) => {
    
    // Function to handle navigation for all buttons on the Home Screen
    const handleNavigation = (action) => {
        // --- CRITICAL FIX: Direct navigation for 'Sign Up' ---
        if (action === 'signup') {
            // This string ('signupSelectRole') maps to the handler logic in App.js
            onNavigate('signupSelectRole'); 
        } else if (action === 'login') {
            // Placeholder: Replace with actual navigation to the Login screen
            onNavigate('login');
        } else if (action === 'dashboard') {
            // Placeholder: Replace with actual navigation to the Dashboard
            onNavigate('dashboard');
        } else {
            // Placeholder for the 'Home' button itself (or general navigation)
            onNavigate('home');
        }
    };

    const navButtons = [
        { label: languageText.home_button, action: 'home', color: '#6366f1' },       // Indigo
        { label: languageText.login_button, action: 'login', color: '#10b981' },     // Emerald
        { label: languageText.signup_button, action: 'signup', color: '#f59e0b' },   // Amber
        { label: languageText.dashboard_button, action: 'dashboard', color: '#0ea5e9' }// Sky
    ];

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{languageText.home_title}</Text>
                <Text style={styles.text}>{languageText.home_text}</Text>
                
                <View style={styles.buttonGrid}>
                    {navButtons.map((button) => (
                        <TouchableOpacity
                            key={button.action}
                            style={[styles.button, { backgroundColor: button.color }]}
                            onPress={() => handleNavigation(button.action)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>{button.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef2ff', // Indigo-50
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
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#1e40af', // Indigo-800
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: '#4b5563', // Gray-600
        marginBottom: 24,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    button: {
        width: '48%', // Allows two buttons per row with space
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default HomeScreen;
