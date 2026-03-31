const Medicine = require('../models/Medicine');

// @desc    Add new medicine
// @route   POST /api/pharmacy
// @access  Private/Admin
const addMedicine = async (req, res) => {
  try {
    const { name, description, price, stockQuantity, lowStockThreshold } = req.body;

    const medExists = await Medicine.findOne({ name });
    if (medExists) return res.status(400).json({ message: 'Medicine already exists' });

    const medicine = await Medicine.create({
      name, description, price, stockQuantity, lowStockThreshold
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all medicines
// @route   GET /api/pharmacy
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMedicine, getMedicines };
