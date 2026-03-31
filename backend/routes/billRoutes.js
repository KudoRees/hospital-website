const express = require('express');
const router = express.Router();
const { createBill, getBills, markBillPaid } = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBill)
  .get(protect, getBills);

router.route('/:id/pay')
  .put(protect, markBillPaid);

module.exports = router;
