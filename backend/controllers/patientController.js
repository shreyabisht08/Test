const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Patient
exports.registerPatient = async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, phone, email, address, medicalHistory, password } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      name, age, gender, bloodGroup, phone, email, address, medicalHistory, password: hashedPassword,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Patient
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
