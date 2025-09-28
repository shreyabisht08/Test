const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firebaseUid: { // This links the profile to the Firebase user
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String, default: '' },
  age: { type: String, default: '' },
  gender: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  medicalHistory: { type: String, default: '' },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;