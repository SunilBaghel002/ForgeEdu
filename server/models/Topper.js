const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  exam: { type: String, required: true },
  score: { type: String, default: '' },
  rank: { type: String, required: true },
  year: { type: Number, required: true },
  photoUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Topper', topperSchema);
