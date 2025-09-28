import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import auth from "@react-native-firebase/auth";

const DoctorVerifyEmailScreen = ({ onVerified, onNavigateBack }) => {
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth().currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          setEmailVerified(true);
          onVerified(); // Navigate to Doctor Dashboard
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const resendVerification = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
        Alert.alert("Email Sent", "Please check your inbox.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please verify your email to continue.</Text>

      <TouchableOpacity style={styles.button} onPress={resendVerification}>
        <Text style={styles.buttonText}>Resend Verification Email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigateBack("doctor_auth")}>
        <Text style={styles.link}>Back to Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorVerifyEmailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  text: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#4A90E2", padding: 15, borderRadius: 8, marginVertical: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#4A90E2", marginTop: 15 },
});
