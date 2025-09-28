// src/screens/DoctorProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DoctorProfileScreen = ({ token, onLogout }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = token || (await AsyncStorage.getItem("token"));
        console.log("Using token:", storedToken);

        const res = await fetch("http://10.0.2.2:5000/api/doctors/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setDoctor(data);
        } else {
          // fallback demo data
          setDoctor({
            name: "Demo Doctor",
            email: "doctor@example.com",
            specialization: "Cardiology",
            experience: "10 years",
            clinic: "City Hospital",
          });
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Profile</Text>
      <Text style={styles.label}>Name: {doctor?.name}</Text>
      <Text style={styles.label}>Email: {doctor?.email}</Text>
      <Text style={styles.label}>Specialization: {doctor?.specialization}</Text>
      <Text style={styles.label}>Experience: {doctor?.experience}</Text>
      <Text style={styles.label}>Clinic: {doctor?.clinic}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default DoctorProfileScreen;
