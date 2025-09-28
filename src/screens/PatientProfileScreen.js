// src/screens/PatientProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PatientProfileScreen = ({ navigation }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Use the same key as in LoginScreen/App.js
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Session Expired", "Please login again.");
          navigation.replace("Login");
          return;
        }

        const res = await fetch("http://10.0.2.2:5000/api/patients/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setPatient(data);
        } else {
          Alert.alert("Error", data.message || "Could not fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        Alert.alert("Error", "Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Patient Profile</Text>
      {patient ? (
        <>
          <Text style={styles.info}>Name: {patient.name}</Text>
          <Text style={styles.info}>Email: {patient.email}</Text>
          <Text style={styles.info}>Age: {patient.age}</Text>
          <Text style={styles.info}>Gender: {patient.gender}</Text>
          <Text style={styles.info}>Address: {patient.address}</Text>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>No profile data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 5 },
  logoutButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    width: "100%",
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PatientProfileScreen;
