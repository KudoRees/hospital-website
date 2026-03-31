const express = require('express');
const router = express.Router();
const { addMedicine, getMedicines } = require('../controllers/pharmacyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addMedicine)
  .get(protect, getMedicines);

module.exports = router;
