// App.js (Updated)

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Screens ---
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import PatientAuthScreen from './src/screens/PatientAuthScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import PatientFormScreen from './src/screens/PatientFormScreen';
import PatientDashboardScreen from './src/screens/PatientDashboardScreen';
import PharmacistAuthScreen from './src/screens/PharmacistAuthScreen';
import PharmacistVerifyEmailScreen from './src/screens/PharmacistVerifyEmailScreen';
import PharmacistDashboardScreen from './src/screens/PharmacistDashboardScreen';
import DoctorAuthScreen from './src/screens/DoctorAuthScreen';
import DoctorVerifyEmailScreen from './src/screens/DoctorVerifyEmailScreen';
import DoctorDashboardScreen from './src/screens/DoctorDashboardScreen';
import PatientProfileScreen from "./src/screens/PatientProfileScreen";
// ✨ NOTE: You will need to create these two new form screen files
// import DoctorFormScreen from './src/screens/DoctorFormScreen';
// import PharmacistFormScreen from './src/screens/PharmacistFormScreen';


// --- Translations ---
import { translations } from './src/i18n/translations';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const languageText = translations[selectedLanguage] || translations.en;

  // --- Auth states ---
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // --- Navigation function ---
  const navigate = (screen) => setCurrentScreen(screen);

  // --- Handle login success ---
  const handleLoginSuccess = async (token, role) => {
    setAuthToken(token);
    setUserRole(role);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("role", role);

    if (role === "patient") setCurrentScreen("patient_dashboard");
    else if (role === "doctor") setCurrentScreen("doctor_dashboard");
    else if (role === "pharmacist") setCurrentScreen("pharmacist_dashboard");
  };

  // --- Auto login on app start ---
  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      if (token && role) {
        setAuthToken(token);
        setUserRole(role);

        if (role === "patient") setCurrentScreen("patient_dashboard");
        else if (role === "doctor") setCurrentScreen("doctor_dashboard");
        else if (role === "pharmacist") setCurrentScreen("pharmacist_dashboard");
      }
    };
    loadAuth();
  }, []);

  // --- Android back button handler ---
  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'signup_role_select' || currentScreen === 'login') {
        navigate('home');
        return true;
      }
      if (currentScreen === 'patient_profile') {
        navigate('patient_dashboard');
        return true;
      }
      if (currentScreen === 'pharmacist_dashboard' || currentScreen === 'patient_dashboard' || currentScreen === 'doctor_dashboard') {
        Alert.alert("Exit App", "Do you want to exit the app?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      if (currentScreen === 'patient_auth' || currentScreen === 'doctor_auth' || currentScreen === 'pharmacist_auth') {
        navigate('signup_role_select');
        return true;
      }
      // ✨ ADDED: Back handler for new forms
      if (currentScreen === 'doctor_form') {
        navigate('doctor_verify_email');
        return true;
      }
      if (currentScreen === 'pharmacist_form') {
        navigate('pharmacist_verify_email');
        return true;
      }
      // ---
      if (currentScreen === 'patient_form') {
        navigate('verify_email');
        return true;
      }
      if (currentScreen === 'verify_email' || currentScreen === 'doctor_verify_email' || currentScreen === 'pharmacist_verify_email') {
        navigate('signup_role_select');
        return true;
      }
      if (currentScreen === 'home') {
        navigate('welcome');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  // --- Screen Rendering ---
  let ScreenComponent;
  switch (currentScreen) {
    case 'welcome':
      ScreenComponent = <WelcomeScreen onContinue={() => navigate('home')} languageText={languageText} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />;
      break;
    case 'home':
      ScreenComponent = <HomeScreen languageText={languageText} onNavigate={(screen) => { if (screen === 'signupSelectRole') navigate('signup_role_select'); else if (screen === 'login') navigate('login'); }} />;
      break;
    case 'signup_role_select':
      ScreenComponent = <SignUpScreen languageText={languageText} onNavigateBack={navigate} />;
      break;
    case 'login':
      ScreenComponent = <LoginScreen onLogin={handleLoginSuccess} />;
      break;

    // --- Patient Flow ---
    case 'patient_auth':
      ScreenComponent = <PatientAuthScreen onAccountCreated={() => navigate('verify_email')} onNavigateBack={navigate} />;
      break;
    case 'verify_email':
      ScreenComponent = <VerifyEmailScreen onVerified={() => navigate('patient_form')} onNavigateBack={navigate} />;
      break;
    case 'patient_form':
      ScreenComponent = <PatientFormScreen onNavigateBack={navigate} />;
      break;
    
    case 'patient_dashboard':
      ScreenComponent = (
        <PatientDashboardScreen
          token={authToken}
          user={{ name: "Patient User" }}
          onNavigate={(screen) => navigate(screen)}
          // ✨ ADD THIS onLogout PROP
          onLogout={async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("role");
            setAuthToken(null);
            setUserRole(null);
            navigate('login');
          }}
        />
      );
      break;
    case 'patient_profile':
      ScreenComponent = <PatientProfileScreen token={authToken} onLogout={async () => { await AsyncStorage.clear(); setAuthToken(null); setUserRole(null); navigate('login'); }} />;
      break;

    // --- Doctor Flow ---
    case 'doctor_auth':
      ScreenComponent = <DoctorAuthScreen onAccountCreated={() => navigate('doctor_verify_email')} onNavigateBack={navigate} />;
      break;
    case 'doctor_verify_email':
      // ✅ UPDATED: Navigate to the new form screen after verification
      ScreenComponent = <DoctorVerifyEmailScreen onVerified={() => navigate('doctor_form')} onNavigateBack={navigate} />;
      break;
    // ✨ ADDED: Placeholder for the new Doctor Form screen
    case 'doctor_form':
      // ScreenComponent = <DoctorFormScreen onNavigateBack={navigate} />;
      // For now, we'll just go to the dashboard until you create the form screen
      ScreenComponent = <DoctorDashboardScreen token={authToken} user={{ name: "Doctor User" }} onNavigate={navigate} />;
      break;
    case 'doctor_dashboard':
      ScreenComponent = <DoctorDashboardScreen token={authToken} user={{ name: "Doctor User" }} onNavigate={navigate} />;
      break;

    // --- Pharmacist Flow ---
    case 'pharmacist_auth':
      ScreenComponent = <PharmacistAuthScreen onAccountCreated={() => navigate('pharmacist_verify_email')} onNavigateBack={navigate} />;
      break;
    case 'pharmacist_verify_email':
      // ✅ UPDATED: Navigate to the new form screen after verification
      ScreenComponent = <PharmacistVerifyEmailScreen onVerified={() => navigate('pharmacist_form')} onNavigateBack={navigate} />;
      break;
    // ✨ ADDED: Placeholder for the new Pharmacist Form screen
    case 'pharmacist_form':
      // ScreenComponent = <PharmacistFormScreen onNavigateBack={navigate} />;
      // For now, we'll just go to the dashboard until you create the form screen
      ScreenComponent = <PharmacistDashboardScreen token={authToken} user={{ name: "Pharmacist User" }} onNavigate={navigate} />;
      break;
    case 'pharmacist_dashboard':
      ScreenComponent = <PharmacistDashboardScreen token={authToken} user={{ name: "Pharmacist User" }} onNavigate={navigate} />;
      break;

    default:
      ScreenComponent = <WelcomeScreen onContinue={() => navigate('home')} languageText={languageText} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#eef2ff" />
      {ScreenComponent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2ff' },
});

export default App;