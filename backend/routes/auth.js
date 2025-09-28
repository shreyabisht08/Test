const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // ⚠️ move to .env in production

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, gender, address, bloodGroup, phone, medicalHistory } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name, email, password: hashedPassword, age, gender, address, bloodGroup, phone, medicalHistory
    });

    await patient.save();

    res.json({ message: "Patient registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: patient._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
