const LabReport = require('../models/LabReport');

// @desc    Add a lab report
// @route   POST /api/labs
// @access  Private/Doctor/Admin
const addLabReport = async (req, res) => {
  try {
    const { patient, doctor, testName, result, documentUrl } = req.body;
    const report = await LabReport.create({
      patient, doctor, testName, result, documentUrl
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lab reports
// @route   GET /api/labs
// @access  Private
const getLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find({})
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addLabReport, getLabReports };
