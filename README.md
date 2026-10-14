# WITH YOU — Platonic Companionship & Support Platform (Kerala, India)

WITH YOU is a production-ready Next.js web application built to connect **Members** (people needing company, emotional listening, or practical outing help) with verified **Supporters** in Kerala, India.

> **STRICT PLATONIC GUARANTEE:** Any romantic, escort, or sexual solicitations are strictly prohibited and monitored.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions & Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Lucide Icons, Custom CSS tokens
- **Database & ORM:** SQLite (dev) / PostgreSQL, Prisma ORM 5.22.0
- **Auth:** JWT HTTP-only Cookies & Bcrypt password hashing
- **Testing & Tooling:** Vitest, tsx runner

---

## 🔑 Test Credentials (Dev / Mock Mode)

All external integrations (Payments, SMS OTP, Aadhaar KYC) run in **MOCK MODE** (`PROVIDER_MODE=mock`).

- **Dev Phone OTP:** `123456` (for any phone number)

| Role | Email | Password | Phone |
| :--- | :--- | :--- | :--- |
| **Member** (Anjali Menon) | `member@withyou.test` | `Member@123` | `9000000001` |
| **Supporter** (Arjun Nair) | `supporter@withyou.test` | `Supporter@123` | `9000000002` |
| **Admin** | `admin@withyou.test` | `Admin@123` | `9000000000` |

---

## 🛠️ Quick Start Instructions

1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Setup Database & Push Schema:**
   ```bash
   npx prisma db push
   ```

3. **Seed Database with Initial Data:**
   ```bash
   npm run db:seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Key Routes Overview

### Public Pages
- `/` — Homepage (Hero, How It Works, Services, Pricing, FAQ)
- `/login` — Login with Email/Password or Phone OTP (`123456`)
- `/register/member` — Member Registration
- `/register/supporter` — Supporter Application
- `/terms` — Terms of Service & Platonic Policy
- `/privacy` — Privacy Policy & DPDP Compliance
- `/guidelines` — Community Code of Conduct
- `/pricing` — Platform Fees & Pricing
- `/safety` — Trust & Safety Center

### Member Portal (`/app/member/*`)
- `/app/member/home` — Member Dashboard & Active Bookings
- `/app/member/explore` — Discover & Filter Supporters by District & Service
- `/app/member/supporter/[id]` — Supporter Details & Reviews
- `/app/member/book/[supporterId]` — Booking & Price Calculation Form
- `/app/member/bookings` — Booking History & Status
- `/app/member/messages` — Supporter Chat & Video Call Room
- `/app/member/payments` — Receipts & Escrow Transactions
- `/app/member/profile` — Member Profile & Emergency Contact
- `/app/member/safety` — SOS Helpline & Report Form

### Supporter Portal (`/app/supporter/*`)
- `/app/supporter/home` — Supporter Dashboard, Status Toggle & Requests
- `/app/supporter/requests` — Accept / Decline Booking Requests
- `/app/supporter/schedule` — Weekly Availability Hours
- `/app/supporter/earnings` — Earnings & Net Payout Breakdown
- `/app/supporter/messages` — Member Chat & Video Room
- `/app/supporter/profile` — Supporter Bio & Services
- `/app/supporter/membership` — Supporter Partner Pass

### Admin Console (`/admin/*`)
- `/admin` — Overview Dashboard & Pending KYC Verification Queue
- `/admin/users` — User Directory & Role Management
- `/admin/bookings` — Platform Bookings Audit

---

## ⚖️ License & Ownership

Developed for WITH YOU Platonic Support Network.
