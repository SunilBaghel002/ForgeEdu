const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptNo: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  batch: { type: String, default: '' },
  amountPaid: { type: Number, required: true },
  amountInWords: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  paymentMode: { type: String, required: true },
  balanceRemaining: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
