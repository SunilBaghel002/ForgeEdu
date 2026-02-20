const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  mode: { type: String, enum: ['Cash', 'UPI', 'Cheque', 'NEFT'], required: true },
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  batch: { type: String, required: true },
  startDate: { type: Date, required: true },
  totalFees: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  paymentSchedule: { type: String, enum: ['Monthly', 'Quarterly', 'Lump Sum'], default: 'Monthly' },
  payments: [paymentSchema],
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  parentName: { type: String, default: '' },
  phone: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
