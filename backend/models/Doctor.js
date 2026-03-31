const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  dayOfWeek: { type: String, required: true }, // e.g. "Monday"
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true }    // e.g. "17:00"
});

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  specialization: { type: String, required: true },
  contactNumber: { type: String, required: true },
  availability: [availabilitySchema]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
