# Urban Nest — PG Finder for Chhattisgarh

A full-featured PG (Paying Guest) & hostel finder website for Chhattisgarh, India.

**Web Owner:** Saiyam Chopda | 9755376105 | enggsaiyam@gmail.com

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Backend API | Node.js + Express.js |
| Database | MySQL 8.x (schema) / PostgreSQL (live Replit instance) |
| API Design | OpenAPI 3.1 + Orval code generation |
| Auth | Custom HMAC token (no external dependency) |
| i18n | React Context — English, Hindi, Bengali, Tamil, Telugu, Punjabi |

---

## Color Palette

| Name | Hex |
|------|-----|
| Magma Orange | `#E84B1A` |
| Sunrise Orange | `#F5A623` |
| Oak Wood Brown | `#5C3D2E` |
| Cream Background | `#FDF6EC` |

---

## Features

- **Landing page** with 3D animated floating shapes background
- **Separate login & registration** for Tenants and PG Owners
- **PG/Hostel listings** page with:
  - City search + keyword search (top right)
  - Filter by type (PG/Hostel), gender, rent range
  - Sort by rent, rooms, availability
  - Real images from 28+ seeded listings across Chhattisgarh
- **PG detail page** with image carousel (up to 5 photos)
- **Tenant dashboard** — stats, recent listings, complaints
- **Owner dashboard** — listing management table, room stats
- **List a PG** — 4-step form, supports up to 5 images (max 20MB each)
- **Complaints page** — file a complaint, track status, contact web owner
- **Multi-language switcher** — English, हिन्दी, বাংলা, தமிழ், తెలుగు, ਪੰਜਾਬੀ
- **40 cities/towns** of Chhattisgarh pre-loaded

---

## Project Structure

```
urban-nest-download/
├── README.md                  ← This file
├── mysql/
│   ├── schema.sql             ← MySQL table definitions
│   └── seed.sql               ← Sample data (cities + PGs + users)
├── backend/                   ← Node.js Express API
│   ├── src/
│   │   ├── index.ts           ← Server entry point
│   │   ├── app.ts             ← Express app setup
│   │   ├── middlewares/
│   │   │   └── auth.ts        ← Token-based auth middleware
│   │   ├── routes/
│   │   │   ├── auth.ts        ← /api/auth/* endpoints
│   │   │   ├── pgs.ts         ← /api/pgs/* endpoints
│   │   │   ├── complaints.ts  ← /api/complaints/* endpoints
│   │   │   ├── dashboard.ts   ← /api/dashboard/* endpoints
│   │   │   └── cities.ts      ← /api/cities endpoint
│   │   └── data/
│   │       └── cities.ts      ← Chhattisgarh cities data
│   └── package.json
└── frontend/                  ← React + Vite app
    ├── src/
    │   ├── App.tsx            ← Router setup
    │   ├── contexts/
    │   │   ├── AuthContext.tsx ← Auth state management
    │   │   └── LanguageContext.tsx ← i18n/translations
    │   ├── components/
    │   │   ├── Navbar.tsx     ← Sticky nav with language switcher
    │   │   ├── Footer.tsx     ← Footer with owner contact info
    │   │   ├── Background3D.tsx ← 3D animated background
    │   │   └── ProtectedRoute.tsx ← Route guards
    │   └── pages/
    │       ├── Home.tsx       ← Landing page
    │       ├── Login.tsx      ← Login (tenant/owner tabs)
    │       ├── Register.tsx   ← Registration form
    │       ├── PgListings.tsx ← Browse PGs with filters
    │       ├── PgDetail.tsx   ← Single PG detail + gallery
    │       ├── TenantDashboard.tsx
    │       ├── OwnerDashboard.tsx
    │       ├── ListPg.tsx     ← Multi-step PG listing form
    │       └── Complaints.tsx ← Complaint management
    └── package.json
```

---

## Setup Instructions

### 1. Database (MySQL)

```bash
mysql -u root -p < mysql/schema.sql
mysql -u root -p urban_nest < mysql/seed.sql
```

### 2. Backend (Node.js)

```bash
cd backend
npm install
# Create .env file:
echo "DATABASE_URL=mysql://root:password@localhost:3306/urban_nest" > .env
echo "SESSION_SECRET=your-secret-key-here" >> .env
echo "PORT=5000" >> .env
npm run dev
```

### 3. Frontend (React)

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

Visit: http://localhost:5173

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | tenant@demo.com | password123 |
| Owner | owner@demo.com | password123 |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register (role: tenant or owner) |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/cities | List all CG cities |
| GET | /api/pgs | List PGs (filters: city, search, sortBy, pgType, gender, minRent, maxRent) |
| POST | /api/pgs | Create PG listing (owner only) |
| GET | /api/pgs/:id | Get PG details |
| PUT | /api/pgs/:id | Update PG (owner only) |
| DELETE | /api/pgs/:id | Delete PG (owner only) |
| GET | /api/pgs/owner/mine | Get my PG listings |
| GET | /api/complaints | List my complaints |
| POST | /api/complaints | Submit a complaint |
| PUT | /api/complaints/:id | Update complaint status |
| GET | /api/dashboard/tenant | Tenant dashboard data |
| GET | /api/dashboard/owner | Owner dashboard data |

---

## Contact / Support

**Web Owner:** Saiyam Chopda  
**Phone:** 9755376105  
**Email:** enggsaiyam@gmail.com
