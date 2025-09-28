// src/screens/PharmacistVerifyEmailScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

const PharmacistVerifyEmailScreen = ({ onVerified, onNavigateBack }) => {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (code === "123456") { // 🔹 Replace with backend verification logic
      Alert.alert("Success", "Email verified successfully!");
      onVerified();
    } else {
      Alert.alert("Error", "Invalid verification code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.text}>A verification code was sent to your email. Enter it below:</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Verification Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => onNavigateBack("pharmacist_auth")}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#eef2ff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 10, marginBottom: 15, width: "100%", backgroundColor: "#fff" },
  verifyButton: { backgroundColor: "#f97316", padding: 15, borderRadius: 10, width: "100%" },
  verifyText: { color: "#fff", fontSize: 18, textAlign: "center", fontWeight: "600" },
  backButton: { marginTop: 15, padding: 10 },
  backText: { color: "#555", fontSize: 16, textAlign: "center" },
});

export default PharmacistVerifyEmailScreen;
