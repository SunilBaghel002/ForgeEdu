const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  bio: { type: String, default: '' },
  experience: { type: Number, required: true },
  photoUrl: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
