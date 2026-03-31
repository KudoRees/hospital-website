const mongoose = require('mongoose');

// Stores every token issued — used for daily sequential counter
const rayaVisitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'RayaPatient' },
  patientName: { type: String, required: true },
  token: { type: String, required: true },      // e.g. "GENE-003"
  department: { type: String, required: true }, // GENERAL | CARDIOLOGY | ORTHOPEDICS | DENTAL
  priority: { type: String, required: true },   // GREEN | YELLOW | RED
  summary: { type: String, default: '' },
  pdfPath: { type: String, default: '' },
  date: { type: String, required: true },        // YYYY-MM-DD — for daily grouping
}, { timestamps: true });

module.exports = mongoose.model('RayaVisit', rayaVisitSchema);
