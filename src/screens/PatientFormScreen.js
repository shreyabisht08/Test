// src/screens/PatientFormScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Props:
 *  - onNavigateBack(target)  // same as you used elsewhere in app
 *
 * Behavior:
 *  - If token exists (AsyncStorage "token"), will try to fetch existing profile and prefill form.
 *  - On submit: if token present => PUT /api/patients/profile (Authorization Bearer token)
 *             otherwise => show alert to login and navigate to login.
 *
 * NOTE:
 *  - Ensure your backend has protected PUT /api/patients/profile route that accepts JSON and updates the user's profile.
 *  - Adjust API_URL if your backend is hosted elsewhere.
 */

const API_URL = "http://10.0.2.2:5000"; // change if needed

const PatientFormScreen = ({ onNavigateBack }) => {
  const isMounted = useRef(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    history: "",
  });

  useEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        // read token and email from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");
        const storedEmail = await AsyncStorage.getItem("userEmail"); // set this at signup/login
        console.log("[PatientForm] storedToken:", !!storedToken, "storedEmail:", storedEmail);

        if (!isMounted.current) return;
        setToken(storedToken || null);
        if (storedEmail) setEmail(storedEmail);

        // if token available, try to fetch existing profile to prefill
        if (storedToken) {
          try {
            const res = await fetch(`${API_URL}/api/patients/profile`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
              },
            });

            if (res.ok) {
              const data = await res.json();
              if (isMounted.current && data) {
                // map backend fields to form fields (safe checks)
                setFormData({
                  name: data.name || "",
                  age: data.age ? String(data.age) : "",
                  gender: data.gender || "",
                  phone: data.phone || "",
                  address: data.address || "",
                  bloodGroup: data.bloodGroup || "",
                  history: data.medicalHistory || data.history || "",
                });
                if (!email && data.email) setEmail(data.email);
              }
            } else {
              // token might be invalid/expired; backend will send 401 or message
              console.warn("[PatientForm] fetch profile not ok:", res.status);
              // we don't force logout here, simply allow user to fill the form and show message on save
            }
          } catch (err) {
            console.error("[PatientForm] profile fetch error", err);
          }
        }
      } catch (err) {
        console.error("[PatientForm] AsyncStorage read error", err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (key, value) => {
    setFormData((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async () => {
    // validation
    if (!formData.name || !formData.age || !formData.phone) {
      Alert.alert("Missing Fields", "Please fill Name, Age and Phone.");
      return;
    }

    // require token (user must be logged in) — safer than anonymous updates
    if (!token) {
      Alert.alert(
        "Not logged in",
        "You must be logged in to save your profile. Please login or signup first.",
        [{ text: "OK", onPress: () => onNavigateBack && onNavigateBack("login") }]
      );
      return;
    }

    setSaving(true);
    try {
      // call backend to update profile
      // using PUT so backend knows it's update (server must support method)
      const res = await fetch(`${API_URL}/api/patients/profile`, {
        method: "PUT", // change to POST if your backend expects POST
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          phone: formData.phone,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
          medicalHistory: formData.history,
          email, // include email for server side sanity
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Profile saved successfully.", [
          {
            text: "OK",
            onPress: () => {
              // navigate to profile view or dashboard
              if (onNavigateBack) onNavigateBack("patient_profile");
            },
          },
        ]);
      } else {
        console.warn("[PatientForm] save failed:", res.status, data);
        const msg = data?.message || `Save failed (${res.status})`;
        Alert.alert("Error", msg);
        // if 401 -> token expired; prompt login
        if (res.status === 401) {
          // clear token and redirect to login
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("role");
          Alert.alert("Session expired", "Please login again.", [
            { text: "OK", onPress: () => onNavigateBack && onNavigateBack("login") },
          ]);
        }
      }
    } catch (err) {
      console.error("[PatientForm] save error", err);
      Alert.alert("Error", "Unable to reach server. Please try again.");
    } finally {
      if (isMounted.current) setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create / Edit Patient Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(t) => handleChange("name", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={formData.age}
        onChangeText={(t) => handleChange("age", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(t) => handleChange("gender", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(t) => handleChange("phone", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(t) => handleChange("address", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Group"
        value={formData.bloodGroup}
        onChangeText={(t) => handleChange("bloodGroup", t)}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Medical History"
        multiline
        value={formData.history}
        onChangeText={(t) => handleChange("history", t)}
      />

      {/* show email from signup/login (not editable) */}
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={email || ""}
        editable={false}
        placeholder="Email (from signup)"
      />

      <TouchableOpacity
        style={[styles.submitButton, saving && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.submitText}>{saving ? "Saving..." : "Save Profile"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => onNavigateBack && onNavigateBack("patient_dashboard")}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PatientFormScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#eef2ff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", minHeight: 200 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: "#fff" },
  disabledInput: { backgroundColor: "#f3f4f6", color: "#666" },
  submitButton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, marginTop: 8 },
  submitText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "600" },
  backButton: { marginTop: 12, padding: 10, alignItems: "center" },
  backText: { color: "#333", fontSize: 16 },
});
