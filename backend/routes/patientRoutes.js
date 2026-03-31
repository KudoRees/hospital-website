const express = require('express');
const router = express.Router();
const { registerPatient, getPatients, getPatientById, addMedicalHistory } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, registerPatient)
  .get(protect, getPatients);

router.route('/:id')
  .get(protect, getPatientById);

router.route('/:id/history')
  .post(protect, addMedicalHistory);

module.exports = router;
