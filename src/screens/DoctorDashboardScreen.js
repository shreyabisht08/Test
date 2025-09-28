// src/screens/DoctorDashboardScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const DoctorDashboardScreen = ({ user, onNavigate }) => {
  return (
    <View style={styles.container}>
      {/* Header with Profile Icon */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user.name}!</Text>
        <TouchableOpacity onPress={() => onNavigate("doctor_profile")}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Doctor's Portal</Text>

      {/* Example Doctor Features */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => onNavigate("myPatients")}>
          <Text style={styles.cardText}>My Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => onNavigate("appointments")}>
          <Text style={styles.cardText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => onNavigate("prescriptions")}>
          <Text style={styles.cardText}>Prescriptions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f3f4f6" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 18, color: "#4b5563", marginBottom: 30 },
  profileIcon: { fontSize: 28, padding: 8, backgroundColor: "#e5e7eb", borderRadius: 50, overflow: "hidden" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%", backgroundColor: "#fff", padding: 20, borderRadius: 12,
    marginBottom: 15, alignItems: "center", justifyContent: "center",
    height: 120, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  cardText: { fontSize: 16, fontWeight: "600", color: "#374151", textAlign: "center" },
});

export default DoctorDashboardScreen;
