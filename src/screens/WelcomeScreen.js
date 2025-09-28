import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// NOTE: Assuming you have installed the community package for Picker: 
// npm install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker'; 
import { languageOptions } from '../i18n/translations';

// --- 2. Welcome Screen Component ---
const WelcomeScreen = ({ onContinue, languageText, selectedLanguage, setSelectedLanguage }) => {

    // The 'selectedLanguage' prop is managed by the parent (App.js)
    const isButtonDisabled = !selectedLanguage;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                
                <Text style={styles.title}>
                    {languageText.welcome_title}
                </Text>
                
                <Text style={styles.prompt}>
                    {languageText.select_language_prompt}
                </Text>

                {/* Language Picker/Dropdown */}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label={languageText.language_selection} value="" enabled={false} />
                        {languageOptions.map(lang => (
                            <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
                        ))}
                    </Picker>
                </View>

                {/* Continue Button */}
                <TouchableOpacity 
                    onPress={onContinue}
                    disabled={isButtonDisabled}
                    style={[
                        styles.button, 
                        isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {languageText.continue_button}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef2ff', // indigo-50
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8, // Android shadow
        gap: 20, // spacing for elements
    },
    title: {
        fontSize: 28,
        fontWeight: '800', // extrabold
        textAlign: 'center',
        color: '#4f46e5', // indigo-700
        marginBottom: 8,
    },
    prompt: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 10,
    },
    pickerContainer: {
        borderColor: '#a5b4fc', // indigo-300
        borderWidth: 2,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333',
    },
    pickerItem: {
        fontSize: 16,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonEnabled: {
        backgroundColor: '#4f46e5', // indigo-600
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af', // gray-400
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WelcomeScreen;