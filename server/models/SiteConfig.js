const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Admissions Open 2026' },
  heroSubtitle: { type: String, default: 'Where Toppers Are Made — IIT-JEE | NEET | Class 9–12' },
  stats: {
    students: { type: String, default: '2000+' },
    successRate: { type: String, default: '95%' },
    experience: { type: String, default: '15+' }
  },
  address: { type: String, default: '123 Education Lane, Kota, Rajasthan 324001' },
  phone: { type: String, default: '+91 99999 99999' },
  email: { type: String, default: 'info@forgeedu.in' },
  whatsappNumber: { type: String, default: '919999999999' },
  galleryImages: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
