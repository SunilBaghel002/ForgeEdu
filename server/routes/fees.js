const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Receipt = require('../models/Receipt');

// GET fee summary
router.get('/summary', async (req, res) => {
  try {
    const students = await Student.find();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalCollected = 0;
    let totalPending = 0;
    let thisMonthCollection = 0;

    students.forEach(s => {
      totalCollected += s.paidAmount;
      totalPending += (s.totalFees - s.paidAmount);
      s.payments.forEach(p => {
        if (new Date(p.date) >= startOfMonth) {
          thisMonthCollection += p.amount;
        }
      });
    });

    // Monthly data for chart (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let monthTotal = 0;
      students.forEach(s => {
        s.payments.forEach(p => {
          const pDate = new Date(p.date);
          if (pDate >= date && pDate <= endDate) {
            monthTotal += p.amount;
          }
        });
      });
      monthlyData.push({
        month: monthNames[date.getMonth()],
        amount: monthTotal
      });
    }

    const overdue = students.filter(s => s.totalFees - s.paidAmount > 0).length;

    res.json({
      totalCollected,
      totalPending,
      overdueCount: overdue,
      thisMonthCollection,
      monthlyData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET overdue students
router.get('/overdue', async (req, res) => {
  try {
    const students = await Student.find();
    const overdue = students
      .filter(s => s.totalFees - s.paidAmount > 0)
      .map(s => ({
        _id: s._id,
        name: s.name,
        course: s.course,
        dueAmount: s.totalFees - s.paidAmount,
        dueSince: s.payments.length > 0
          ? s.payments[s.payments.length - 1].date
          : s.startDate,
        parentName: s.parentName,
        phone: s.phone
      }));
    res.json(overdue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
