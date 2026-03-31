const mongoose = require('mongoose');

const rayaPatientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, default: 0 },
  phone: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  faceDescriptor: { type: [Number], required: true },   // 128-float vector from face-api.js
  photo: { type: String, default: '' },                  // base64 encoded webcam snapshot
}, { timestamps: true });

module.exports = mongoose.model('RayaPatient', rayaPatientSchema);
