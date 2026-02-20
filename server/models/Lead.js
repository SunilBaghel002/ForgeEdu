const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  class: { type: String, required: true },
  parentName: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  city: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Interested', 'Not Interested', 'Converted'],
    default: 'New'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
