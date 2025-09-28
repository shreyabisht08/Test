// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

// 🔴 IMPORTANT: Change this IP if you are testing on a REAL PHONE
const API_BASE_URL = "http://192.168.1.9"; 

const LoginScreen = ({ onLogin }) => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!role) {
      Alert.alert("Select Role", "Please choose Patient, Doctor or Pharmacist");
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
      return;
    }

    const loginUrl = `${API_BASE_URL}/api/${role}s/login`;

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.token;
        Alert.alert("Success", `${role} logged in!`);
        onLogin(token, role);
      } else {
        Alert.alert("Login Error", data.message || "Login failed");
      }
    } catch (err) {
      console.error("Network request failed:", err);
      Alert.alert("Connection Error", "Server not reachable. Please check your network and IP address settings.");
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
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
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