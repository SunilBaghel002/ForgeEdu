const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Receipt = require('../models/Receipt');

// Number to words helper
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWords(-num);

  let words = '';
  if (Math.floor(num / 10000000) > 0) {
    words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += numberToWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num > 0) {
    if (words !== '') words += 'and ';
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) words += ' ' + ones[num % 10];
    }
  }
  return words.trim();
}

// Generate receipt number
async function generateReceiptNo() {
  const year = new Date().getFullYear();
  const count = await Receipt.countDocuments();
  const num = String(count + 1).padStart(4, '0');
  return `FE-${year}-${num}`;
}

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add payment to student
router.post('/:id/payments', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const { amount, date, mode } = req.body;
    const newPaid = student.paidAmount + amount;
    const balance = student.totalFees - newPaid;

    // Generate receipt
    const receiptNo = await generateReceiptNo();
    const receipt = new Receipt({
      receiptNo,
      studentId: student._id,
      studentName: student.name,
      course: student.course,
      batch: student.batch,
      amountPaid: amount,
      amountInWords: numberToWords(amount) + ' Rupees Only',
      paymentDate: new Date(date),
      paymentMode: mode,
      balanceRemaining: balance
    });
    await receipt.save();

    // Update student
    student.payments.push({ amount, date: new Date(date), mode, receiptId: receipt._id });
    student.paidAmount = newPaid;
    await student.save();

    res.status(201).json({ student, receipt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
