const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');

// GET all receipts
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { receiptNo: { $regex: search, $options: 'i' } }
      ];
    }
    const receipts = await Receipt.find(filter).sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single receipt
router.get('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
