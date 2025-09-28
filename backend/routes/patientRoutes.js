const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new patient profile after Firebase signup
// @route   POST /api/patients/register
// @access  Protected
router.post('/register', protect, async (req, res) => {
  try {
    const { email, uid } = req.user; // Get from verified token

    // Check if patient already exists
    const patientExists = await Patient.findOne({ firebaseUid: uid });
    if (patientExists) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    // Create new patient profile
    const patient = new Patient({
      firebaseUid: uid,
      email: email,
    });
    await patient.save();

    res.status(201).json({ message: 'Patient profile created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Protected
router.get('/profile', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ firebaseUid: req.user.uid });
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Protected
router.put('/profile', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ firebaseUid: req.user.uid });

    if (patient) {
      patient.name = req.body.name || patient.name;
      patient.age = req.body.age || patient.age;
      patient.gender = req.body.gender || patient.gender;
      patient.phone = req.body.phone || patient.phone;
      patient.address = req.body.address || patient.address;
      patient.bloodGroup = req.body.bloodGroup || patient.bloodGroup;
      patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory;

      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;