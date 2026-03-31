const Appointment = require('../models/Appointment');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot, symptoms } = req.body;

    // Check for existing appointment at same time
    const existing = await Appointment.findOne({ doctor, date, timeSlot });
    if (existing) {
      return res.status(400).json({ message: 'Time slot is already booked for this doctor.' });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      timeSlot,
      symptoms
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    // Return all populated
    const appointments = await Appointment.find({})
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialization');
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookAppointment, getAppointments };
