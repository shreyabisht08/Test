import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

const DoctorAuthScreen = ({ onAccountCreated, onNavigateBack }) => {
  const [Fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !licenseNumber) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // 📌 Simple license number validation (adjust to your needs)
    if (!/^[A-Z0-9]{6,12}$/.test(licenseNumber)) {
      Alert.alert("Invalid License", "Please enter a valid license number.");
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Send email verification
      await userCredential.user.sendEmailVerification();

      Alert.alert("Signup Successful", "Please verify your email before logging in.");
      onAccountCreated(); // Navigate to verify email screen
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Doctor account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={Fullname}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Doctor License Number"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigateBack("signup_role_select")}>
        <Text style={styles.link}>Back to Signup Options</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorAuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#4A90E2", textAlign: "center", marginTop: 10 },
});
