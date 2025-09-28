// src/screens/PharmacistAuthScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";

const PharmacistAuthScreen = ({ onAccountCreated, onNavigateBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    license: "",
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignup = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.license) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    // 🔹 TODO: send pharmacist data to backend for storage
    console.log("Pharmacist Signup Data:", formData);

    // Move to email verification
    onAccountCreated();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Pharmacist account </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Pharmacist License Number"
        value={formData.license}
        onChangeText={(text) => handleChange("license", text)}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => onNavigateBack("signup_role_select")}>
        <Text style={styles.backText}>Back to Signup Options</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#eef2ff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: "#fff" },
  signupButton: { backgroundColor: "#f97316", padding: 15, borderRadius: 10, marginTop: 10 },
  signupText: { color: "#fff", fontSize: 18, textAlign: "center", fontWeight: "600" },
  backButton: { marginTop: 15, padding: 10 },
  backText: { color: "#555", fontSize: 16, textAlign: "center" },
});

export default PharmacistAuthScreen;
