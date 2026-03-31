const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
