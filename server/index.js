require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const leadRoutes = require('./routes/leads');
const studentRoutes = require('./routes/students');
const receiptRoutes = require('./routes/receipts');
const feeRoutes = require('./routes/fees');
const facultyRoutes = require('./routes/faculty');
const topperRoutes = require('./routes/toppers');
const siteConfigRoutes = require('./routes/siteConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/toppers', topperRoutes);
app.use('/api/site-config', siteConfigRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forgeedu')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 ForgeEdu API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
