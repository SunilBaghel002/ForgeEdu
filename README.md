# 🔥 ForgeEdu — Coaching Growth & Management System

A premium coaching institute management platform with a stunning public website, admin dashboard, lead/student management, fee tracking, receipt generation, and content management.

**Tech Stack:** React.js + Express.js + MongoDB

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://localhost:27017`

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Seed Demo Data

```bash
cd server
npm run seed
```

This populates: 10 leads, 5 students with payments, 4 faculty, 5 toppers, receipts, and site config.

### 3. Start the Application

**Terminal 1 — Server:**
```bash
cd server
npm start
```
> API runs on http://localhost:5000

**Terminal 2 — Client:**
```bash
cd client
npm run dev
```
> App runs on http://localhost:3000

---

## 📁 Project Structure

```
forgeedu/
├── client/                    # React.js (Vite)
│   └── src/
│       ├── components/        # Navbar, Footer, WhatsApp, AdminLayout, AdminAuth
│       ├── pages/
│       │   ├── Home.jsx       # Public marketing website
│       │   ├── Apply.jsx      # Admission form
│       │   └── admin/         # Admin dashboard pages
│       │       ├── Dashboard.jsx
│       │       ├── Leads.jsx
│       │       ├── Students.jsx
│       │       ├── StudentProfile.jsx
│       │       ├── Fees.jsx
│       │       ├── Receipts.jsx
│       │       └── Controls.jsx
│       ├── index.css          # Design system
│       ├── App.jsx            # Routing
│       └── main.jsx           # Entry point
│
├── server/                    # Express.js
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route handlers
│   ├── seed.js                # Demo data seeder
│   ├── index.js               # Server entry
│   └── .env                   # Environment config
│
└── README.md
```

---

## 🔑 Admin Access

Navigate to `/admin` and enter password: **`admin123`**

### Admin Modules:
- **Dashboard** — Stats, lead temperature, activity feed, revenue chart
- **Lead Management** — Table with filters, slide-out detail panel, status tracking
- **Student Management** — Profiles, fee progress, payment recording
- **Fee Tracking** — Collection stats, overdue tracking, WhatsApp reminders
- **Receipt Generator** — Auto-generated receipts, PDF download, WhatsApp/email sharing
- **Admin Controls** — Manage faculty, toppers, gallery images, and website content

---

## 🎨 Design

- **Colors:** Deep navy (#0a0e1a) + Amber/Gold (#f59e0b)
- **Typography:** Playfair Display (headings) + Sora (body)
- **Style:** Premium dark theme with subtle gold accents and animations

---

## 📡 API Endpoints

| Endpoint | Methods | Description |
|---|---|---|
| `/api/leads` | GET, POST | List/create leads |
| `/api/leads/:id` | PATCH | Update lead |
| `/api/students` | GET, POST | List/create students |
| `/api/students/:id` | GET | Student profile |
| `/api/students/:id/payments` | POST | Add payment |
| `/api/receipts` | GET | List receipts |
| `/api/receipts/:id` | GET | Single receipt |
| `/api/fees/summary` | GET | Fee stats |
| `/api/fees/overdue` | GET | Overdue list |
| `/api/faculty` | GET, POST, PUT, DELETE | Faculty CRUD |
| `/api/toppers` | GET, POST, PUT, DELETE | Toppers CRUD |
| `/api/site-config` | GET, POST, PATCH | Site config |
