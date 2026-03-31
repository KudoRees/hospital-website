const express = require('express');
const router = express.Router();
const { addLabReport, getLabReports } = require('../controllers/labController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addLabReport)
  .get(protect, getLabReports);

module.exports = router;
