const Patient = require('../models/Patient');

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private
const registerPatient = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, contactNumber } = req.body;
    
    // Generate unique patient ID (e.g., PAT-12345)
    const patientId = `PAT-${Math.floor(10000 + Math.random() * 90000)}`;

    const patient = await Patient.create({
      user: req.user._id, // Assumes route is protected and patient user is logged in
      patientId,
      firstName,
      lastName,
      age,
      gender,
      contactNumber
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin/Doctor
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).populate('user', 'email');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'email');
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add medical history
// @route   POST /api/patients/:id/history
// @access  Private/Doctor
const addMedicalHistory = async (req, res) => {
  try {
    const { description, treatment } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      const history = {
        description,
        treatment,
        doctorId: req.user._id // Assuming req.user is the doctor
      };

      patient.medicalHistory.push(history);
      await patient.save();
      res.status(201).json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerPatient, getPatients, getPatientById, addMedicalHistory };
