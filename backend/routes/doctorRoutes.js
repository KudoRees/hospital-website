const express = require('express');
const router = express.Router();
const { addDoctor, getDoctors, updateAvailability } = require('../controllers/doctorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, addDoctor)
  .get(getDoctors); // Public to view doctors

router.route('/:id/availability')
  .put(protect, updateAvailability);

module.exports = router;
