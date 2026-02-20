require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const Student = require('./models/Student');
const Receipt = require('./models/Receipt');
const Faculty = require('./models/Faculty');
const Topper = require('./models/Topper');
const SiteConfig = require('./models/SiteConfig');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/forgeedu';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear all
  await Promise.all([
    Lead.deleteMany({}),
    Student.deleteMany({}),
    Receipt.deleteMany({}),
    Faculty.deleteMany({}),
    Topper.deleteMany({}),
    SiteConfig.deleteMany({})
  ]);
  console.log('Cleared existing data');

  // Seed Leads
  const leads = await Lead.insertMany([
    { studentName: 'Aarav Patel', class: '11', parentName: 'Rajesh Patel', phone: '9876543210', course: 'IIT-JEE', city: 'Kota', status: 'New' },
    { studentName: 'Sneha Gupta', class: '12', parentName: 'Vikram Gupta', phone: '9876543211', course: 'NEET', city: 'Jaipur', status: 'Contacted' },
    { studentName: 'Rohit Sharma', class: '10', parentName: 'Anil Sharma', phone: '9876543212', course: 'Foundation', city: 'Delhi', status: 'Interested' },
    { studentName: 'Priya Singh', class: '11', parentName: 'Suresh Singh', phone: '9876543213', course: 'IIT-JEE', city: 'Lucknow', status: 'Converted' },
    { studentName: 'Arjun Reddy', class: '12', parentName: 'Venkat Reddy', phone: '9876543214', course: 'NEET', city: 'Hyderabad', status: 'Converted' },
    { studentName: 'Kavya Nair', class: '9', parentName: 'Sunil Nair', phone: '9876543215', course: 'Foundation', city: 'Kochi', status: 'New' },
    { studentName: 'Ishaan Malhotra', class: '12', parentName: 'Deepak Malhotra', phone: '9876543216', course: 'Crash Course', city: 'Chandigarh', status: 'Contacted' },
    { studentName: 'Ananya Joshi', class: '11', parentName: 'Prakash Joshi', phone: '9876543217', course: 'IIT-JEE', city: 'Pune', status: 'Interested' },
    { studentName: 'Dev Kapoor', class: '10', parentName: 'Sanjay Kapoor', phone: '9876543218', course: 'Foundation', city: 'Mumbai', status: 'Not Interested' },
    { studentName: 'Riya Verma', class: '12', parentName: 'Amit Verma', phone: '9876543219', course: 'NEET', city: 'Bhopal', status: 'New' }
  ]);
  console.log('Seeded 10 leads');

  // Seed Students (from converted leads)
  const now = new Date();
  const students = await Student.insertMany([
    {
      name: 'Priya Singh', course: 'IIT-JEE', batch: 'JEE-2026-A', startDate: new Date(2025, 3, 1),
      totalFees: 150000, paidAmount: 100000, paymentSchedule: 'Quarterly', parentName: 'Suresh Singh', phone: '9876543213',
      leadId: leads[3]._id,
      payments: [
        { amount: 50000, date: new Date(2025, 3, 5), mode: 'NEFT' },
        { amount: 25000, date: new Date(2025, 6, 10), mode: 'UPI' },
        { amount: 25000, date: new Date(2025, 9, 15), mode: 'UPI' }
      ]
    },
    {
      name: 'Arjun Reddy', course: 'NEET', batch: 'NEET-2026-B', startDate: new Date(2025, 4, 1),
      totalFees: 120000, paidAmount: 80000, paymentSchedule: 'Monthly', parentName: 'Venkat Reddy', phone: '9876543214',
      leadId: leads[4]._id,
      payments: [
        { amount: 40000, date: new Date(2025, 4, 5), mode: 'Cash' },
        { amount: 20000, date: new Date(2025, 7, 10), mode: 'Cheque' },
        { amount: 20000, date: new Date(2025, 10, 12), mode: 'UPI' }
      ]
    },
    {
      name: 'Meera Iyer', course: 'IIT-JEE', batch: 'JEE-2026-A', startDate: new Date(2025, 3, 15),
      totalFees: 150000, paidAmount: 150000, paymentSchedule: 'Lump Sum', parentName: 'Ramesh Iyer', phone: '9876543220',
      payments: [
        { amount: 150000, date: new Date(2025, 3, 15), mode: 'NEFT' }
      ]
    },
    {
      name: 'Vikash Kumar', course: 'Foundation', batch: 'FND-2026-A', startDate: new Date(2025, 5, 1),
      totalFees: 80000, paidAmount: 40000, paymentSchedule: 'Quarterly', parentName: 'Rajiv Kumar', phone: '9876543221',
      payments: [
        { amount: 20000, date: new Date(2025, 5, 5), mode: 'Cash' },
        { amount: 20000, date: new Date(2025, 8, 10), mode: 'UPI' }
      ]
    },
    {
      name: 'Nisha Agarwal', course: 'NEET', batch: 'NEET-2026-A', startDate: new Date(2025, 4, 15),
      totalFees: 120000, paidAmount: 60000, paymentSchedule: 'Monthly', parentName: 'Pankaj Agarwal', phone: '9876543222',
      payments: [
        { amount: 30000, date: new Date(2025, 4, 15), mode: 'NEFT' },
        { amount: 30000, date: new Date(2025, 7, 20), mode: 'UPI' }
      ]
    }
  ]);
  console.log('Seeded 5 students');

  // Seed Receipts for existing payments
  let receiptCount = 0;
  for (const student of students) {
    for (const payment of student.payments) {
      receiptCount++;
      const receipt = new Receipt({
        receiptNo: `FE-2025-${String(receiptCount).padStart(4, '0')}`,
        studentId: student._id,
        studentName: student.name,
        course: student.course,
        batch: student.batch,
        amountPaid: payment.amount,
        amountInWords: payment.amount.toLocaleString() + ' Rupees Only',
        paymentDate: payment.date,
        paymentMode: payment.mode,
        balanceRemaining: student.totalFees - student.paidAmount
      });
      await receipt.save();
      payment.receiptId = receipt._id;
    }
    await student.save();
  }
  console.log(`Seeded ${receiptCount} receipts`);

  // Seed Faculty
  await Faculty.insertMany([
    { name: 'Dr. Rakesh Sharma', subject: 'Physics', bio: 'IIT Delhi Alumni with a passion for simplifying complex concepts. Has mentored 500+ IIT selections.', experience: 12, order: 1 },
    { name: 'Prof. Sunita Desai', subject: 'Chemistry', bio: 'Former CSIR scientist. Known for her organic chemistry mastery and innovative teaching methods.', experience: 15, order: 2 },
    { name: 'Mr. Arun Mehta', subject: 'Mathematics', bio: 'IIT Bombay gold medalist. Specializes in calculus and algebra for JEE Advanced preparation.', experience: 10, order: 3 },
    { name: 'Dr. Priyanka Verma', subject: 'Biology', bio: 'AIIMS graduate with extensive NEET coaching experience. 200+ AIIMS selections under her guidance.', experience: 8, order: 4 }
  ]);
  console.log('Seeded 4 faculty');

  // Seed Toppers
  await Topper.insertMany([
    { name: 'Priya Mehta', exam: 'IIT-JEE', score: '310/360', rank: 'AIR 234', year: 2025 },
    { name: 'Rahul Krishnan', exam: 'NEET', score: '695/720', rank: 'AIR 56', year: 2025 },
    { name: 'Aditi Sharma', exam: 'IIT-JEE', score: '298/360', rank: 'AIR 512', year: 2025 },
    { name: 'Karan Singhania', exam: 'NEET', score: '680/720', rank: 'AIR 128', year: 2024 },
    { name: 'Sneha Das', exam: 'IIT-JEE', score: '285/360', rank: 'AIR 890', year: 2024 }
  ]);
  console.log('Seeded 5 toppers');

  // Seed Site Config
  await SiteConfig.create({
    heroTitle: 'Admissions Open 2026',
    heroSubtitle: 'Where Toppers Are Made — IIT-JEE | NEET | Class 9–12',
    stats: { students: '2000+', successRate: '95%', experience: '15+' },
    address: '123 Education Lane, Kota, Rajasthan 324001',
    phone: '+91 99999 99999',
    email: 'info@forgeedu.in',
    whatsappNumber: '919999999999',
    galleryImages: []
  });
  console.log('Seeded site config');

  console.log('\n✅ Seeding complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
