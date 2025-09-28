// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLogin, onNavigateBack }) => {
  const [role, setRole] = useState('patient'); // Default to patient
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!role) {
      Alert.alert("Select Role", "Please choose a role to log in.");
      return;
    }
    if (!email || !password) {
      Alert.alert("Error", "Please enter both your email and password.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Sign in with Firebase
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Step 2: Check if the user has verified their email
      if (!user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please check your inbox and click the verification link before logging in."
        );
        setLoading(false);
        return;
      }

      // Step 3: Get the Firebase ID Token
      const idToken = await user.getIdToken();

      // Store the email for the PatientFormScreen to use
      await AsyncStorage.setItem("userEmail", user.email);
      
      Alert.alert("Success", `${role} logged in!`);

      // Step 4: Call the onLogin function in App.js to start the session
      onLogin(idToken, role);

    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          onPress={() => setRole("patient")}
          style={[styles.roleButton, role === "patient" && styles.activeRole]}
        >
          <Text style={[styles.roleButtonText, role === "patient" && styles.activeRoleText]}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("doctor")}
          style={[styles.roleButton, role === "doctor" && styles.activeRole]}
        >
          <Text style={[styles.roleButtonText, role === "doctor" && styles.activeRoleText]}>Doctor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole("pharmacist")}
          style={[styles.roleButton, role === "pharmacist" && styles.activeRole]}
        >
          <Text style={[styles.roleButtonText, role === "pharmacist" && styles.activeRoleText]}>Pharmacist</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eef2ff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  roleContainer: { flexDirection: "row", marginBottom: 20, justifyContent: 'center' },
  roleButton: { paddingVertical: 10, paddingHorizontal: 15, marginHorizontal: 5, backgroundColor: "#e0e7ff", borderRadius: 8, borderWidth: 1, borderColor: '#c7d2fe' },
  activeRole: { backgroundColor: "#4f46e5" },
  roleButtonText: { color: '#4338ca', fontWeight: '500' },
  activeRoleText: { color: '#ffffff', fontWeight: '700' },
  input: { width: "90%", padding: 12, marginVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: "#fff" },
  button: { backgroundColor: "#4f46e5", paddingVertical: 14, borderRadius: 8, marginTop: 20, width: '90%', alignItems: 'center' },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default LoginScreen;