# ⚡ UrbanServe — Urban Company–like Service Booking App

A full-stack home service booking web application built with React.js, Node.js (Express), and MySQL.

---

## 📁 Project Structure

```
urban-serve/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── schema.sql         # Database schema + seed data
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   ├── serviceController.js # CRUD for services
│   │   └── bookingController.js # Booking logic + admin ops
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly guards
│   │   └── errorHandler.js    # Global error handler + 404
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Admin/
        │   │   └── AdminLayout.js   # Sidebar layout for admin
        │   ├── Auth/
        │   │   ├── Login.js
        │   │   └── Register.js
        │   └── Common/
        │       ├── Navbar.js
        │       ├── Footer.js
        │       ├── ServiceCard.js
        │       └── ProtectedRoute.js
        ├── context/
        │   └── AuthContext.js       # Global auth state
        ├── pages/
        │   ├── Home.js
        │   ├── Services.js          # Listing + filters
        │   ├── ServiceDetail.js     # Detail + booking form
        │   ├── MyBookings.js
        │   ├── BookingDetail.js
        │   ├── Profile.js
        │   ├── NotFound.js
        │   └── Admin/
        │       ├── AdminDashboard.js
        │       ├── AdminServices.js
        │       ├── AdminBookings.js
        │       └── AdminUsers.js
        ├── styles/
        │   └── global.css           # Design system + utilities
        ├── utils/
        │   └── api.js               # Axios instance with interceptors
        ├── App.js                   # Routes + layout
        └── index.js
```

---

## 🗄️ Database Schema

### Tables

| Table      | Columns |
|------------|---------|
| `users`    | id, name, email, password, phone, role (user/admin), created_at |
| `categories` | id, name, icon |
| `services` | id, name, category_id, price, duration, description, image_url, rating, is_active |
| `bookings` | id, user_id, service_id, booking_date, booking_time, address, status, notes, total_amount |

### Booking Status Flow
`pending` → `confirmed` → `in_progress` → `completed`  
_(can also be `cancelled` at any stage before completion)_

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET  | `/api/auth/me` | Private | Get current user |
| PUT  | `/api/auth/profile` | Private | Update profile |

### Services
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/services` | Public | List all (with filters: search, category, price, sort) |
| GET | `/api/services/:id` | Public | Single service |
| GET | `/api/services/categories/all` | Public | All categories |
| POST | `/api/services` | Admin | Create service |
| PUT | `/api/services/:id` | Admin | Update service |
| DELETE | `/api/services/:id` | Admin | Delete service |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/my` | User | My bookings |
| GET | `/api/bookings/:id` | User/Admin | Single booking |
| PUT | `/api/bookings/:id/cancel` | User | Cancel booking |
| GET | `/api/bookings/admin/all` | Admin | All bookings |
| PUT | `/api/bookings/admin/:id/status` | Admin | Update status |
| GET | `/api/bookings/admin/users` | Admin | All users |
| GET | `/api/bookings/admin/stats` | Admin | Dashboard stats |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- MySQL 8.0+
- npm or yarn

---

### Step 1 — Clone / Extract the Project
```bash
cd urban-serve
```

---

### Step 2 — Set Up the Database

1. Open MySQL Workbench or your MySQL CLI:
```bash
mysql -u root -p
```

2. Run the schema file:
```bash
source /path/to/urban-serve/backend/config/schema.sql
```
Or in MySQL Workbench: **File → Open SQL Script → Run**

This will:
- Create the `urbanserve` database
- Create all 4 tables
- Insert 8 categories and 24 sample services
- Create an admin user

---

### Step 3 — Configure the Backend

```bash
cd backend
```

Edit `.env` and fill in your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=urbanserve
JWT_SECRET=urbanserve_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Install dependencies:
```bash
npm install
```

Start the backend:
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

✅ Backend runs on: `http://localhost:5000`  
✅ Test it: `http://localhost:5000/api/health`

---

### Step 4 — Start the Frontend

Open a **new terminal**:
```bash
cd frontend
npm install
npm start
```

✅ Frontend runs on: `http://localhost:3000`

---

### Step 5 — Create the Admin Account

The schema seeds an admin user with a placeholder password hash.  
**Create a fresh admin by registering normally, then manually update the role:**

```sql
USE urbanserve;
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Or you can re-insert with a fresh bcrypt hash:
```bash
# Generate a hash for "Admin@123" using node
node -e "const b=require('bcryptjs'); b.hash('Admin@123',10).then(h=>console.log(h))"
```

Then in MySQL:
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@urbanserve.com', '<paste_hash_here>', 'admin');
```

---

## 🔑 Demo Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@urbanserve.com | Admin@123 |
| User | Register a new account | — |

---

## ✨ Features Implemented

### User Features
- [x] Register & Login with JWT authentication
- [x] Browse all services with category filter, search, price range, and sort
- [x] View service detail with ratings and description
- [x] Book a service with date picker, time slot selection, and address
- [x] View all personal bookings with status tabs
- [x] View booking details with status progress tracker
- [x] Cancel pending/confirmed bookings
- [x] User profile management

### Admin Features
- [x] Admin-only dashboard with stats (users, bookings, revenue)
- [x] Add / Edit / Delete services via modal
- [x] View and filter all bookings
- [x] Update booking status (pending → confirmed → in_progress → completed)
- [x] View all registered users

### Technical Features
- [x] JWT authentication with protected routes
- [x] Axios interceptors for token injection + 401 redirect
- [x] Form validation on both frontend and backend
- [x] Toast notifications for all actions
- [x] Loading spinners and empty states
- [x] Mobile-responsive design
- [x] MVC pattern on backend
- [x] Global error handling middleware
- [x] MySQL connection pooling

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Pure CSS with CSS Variables |
| HTTP Client | Axios |
| Toast | react-hot-toast |
| Backend | Node.js, Express.js |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| Database | MySQL 8.0 (mysql2/promise) |

---

## 📸 Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Services | `/services` | Public |
| Service Detail + Booking | `/services/:id` | Public (booking needs login) |
| Login | `/login` | Public |
| Register | `/register` | Public |
| My Bookings | `/bookings` | User |
| Booking Detail | `/bookings/:id` | User |
| Profile | `/profile` | User |
| Admin Dashboard | `/admin` | Admin |
| Admin Services | `/admin/services` | Admin |
| Admin Bookings | `/admin/bookings` | Admin |
| Admin Users | `/admin/users` | Admin |

---

## 🛠️ Common Issues & Fixes

**"Cannot connect to MySQL"**  
→ Check `.env` DB credentials. Ensure MySQL service is running.

**"ER_NOT_SUPPORTED_AUTH_MODE"**  
→ Run: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';`

**CORS errors**  
→ Ensure `CLIENT_URL` in `.env` matches your frontend URL exactly (`http://localhost:3000`)

**Port already in use**  
→ Change `PORT` in `.env` and update the `proxy` field in `frontend/package.json`

---

*Built for college submission — UrbanServe Full Stack Project*
