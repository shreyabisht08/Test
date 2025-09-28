import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

const DoctorSignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const registerDoctor = async () => {
    if (!email || !password || !licenseNumber) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // basic license format check
    if (!/^[A-Z0-9]{6,12}$/.test(licenseNumber)) {
      Alert.alert("Invalid License", "Please enter a valid license number.");
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // send email verification
      await userCredential.user.sendEmailVerification();

      Alert.alert(
        "Signup Successful",
        "Please check your email inbox and verify before logging in."
      );
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Doctor Signup</Text>

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
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Doctor License Number"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
      />

      <TouchableOpacity style={styles.button} onPress={registerDoctor}>
        <Text style={styles.buttonText}>Register Doctor</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
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
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
