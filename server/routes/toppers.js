const express = require('express');
const router = express.Router();
const Topper = require('../models/Topper');

router.get('/', async (req, res) => {
  try {
    const toppers = await Topper.find().sort({ year: -1 });
    res.json(toppers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const topper = new Topper(req.body);
    await topper.save();
    res.status(201).json(topper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const topper = await Topper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topper) return res.status(404).json({ error: 'Topper not found' });
    res.json(topper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Topper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Topper deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
