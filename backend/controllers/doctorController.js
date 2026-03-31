const Doctor = require('../models/Doctor');

// @desc    Add a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const addDoctor = async (req, res) => {
  try {
    const { user, firstName, lastName, specialization, contactNumber, availability } = req.body;

    const doctorExists = await Doctor.findOne({ user });
    if (doctorExists) return res.status(400).json({ message: 'Doctor profile already exists for this user' });

    const doctor = await Doctor.create({
      user,
      firstName,
      lastName,
      specialization,
      contactNumber,
      availability
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public or Private
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('user', 'email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private/Doctor
const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      doctor.availability = req.body.availability || doctor.availability;
      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addDoctor, getDoctors, updateAvailability };
