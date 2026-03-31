const Bill = require('../models/Bill');

// @desc    Create a new bill
// @route   POST /api/bills
// @access  Private/Admin
const createBill = async (req, res) => {
  try {
    const { patient, appointment, consultationFee, medicineCharges, otherCharges, status } = req.body;
    
    const totalAmount = (consultationFee || 0) + (medicineCharges || 0) + (otherCharges || 0);

    const bill = await Bill.create({
      patient,
      appointment,
      consultationFee,
      medicineCharges,
      otherCharges,
      totalAmount,
      status
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({}).populate('patient', 'firstName lastName');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bill status
// @route   PUT /api/bills/:id/pay
// @access  Private
const markBillPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      bill.status = 'paid';
      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBill, getBills, markBillPaid };
