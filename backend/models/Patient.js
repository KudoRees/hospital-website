const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: String,
  treatment: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
});

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  medicalHistory: [medicalHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
