const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  consultationFee: { type: Number, default: 0 },
  medicineCharges: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
