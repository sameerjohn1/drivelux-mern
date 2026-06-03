# DriveLux — MERN Stack Car Rental Platform

A production-ready, full-stack car rental platform built with MongoDB, Express, React, and Node.js.

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# 1. Clone / extract the project
cd car-booking-2026-mern

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Environment Setup

```bash
# Copy and configure the server .env
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, Cloudinary keys, etc.
```

### Seed the Database

```bash
cd server
npm run seed
```

### Run the Application

```bash
# Terminal 1 — Backend (from server/)
npm run dev    # runs on http://localhost:5000

# Terminal 2 — Frontend (from client/)
npm run dev    # runs on http://localhost:5173
```

---

## 🔐 Admin & Demo Credentials

| Role   | Email                | Password     |
| ------ | -------------------- | ------------ |
| Admin  | admin@carbooking.com | Admin@12345  |
| Driver | ahmed@carbooking.com | Driver@12345 |
| Driver | sara@carbooking.com  | Driver@12345 |
| User   | zara@example.com     | User@12345   |
| User   | hamza@example.com    | User@12345   |

---

## 📁 Folder Structure

```
car-booking-2026-mern/
├── server/                     # Express.js Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── notificationController.js
│   │   ├── messageController.js
│   │   ├── userController.js
│   │   ├── driverController.js
│   │   ├── adminController.js
│   │   ├── wishlistController.js
│   │   └── paymentController.js
│   ├── middlewares/
│   │   ├── auth.js             # JWT protect + RBAC
│   │   ├── errorHandler.js
│   │   └── upload.js           # Cloudinary + Multer
│   ├── models/
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Car.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── Notification.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   ├── Payment.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── userRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   ├── generateToken.js    # JWT helpers
│   │   ├── sendEmail.js        # Nodemailer
│   │   └── apiFeatures.js      # Filter/Sort/Paginate
│   ├── seed.js                 # Demo data seeder
│   ├── index.js                # App entry point
│   └── package.json
│
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── Rating.jsx
│   │   │   │   └── Skeleton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state + login/logout
│   │   │   └── ThemeContext.jsx # Dark/Light mode
│   │   ├── hooks/
│   │   │   └── useSocket.js    # Socket.io connection
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Cars.jsx
│   │   │   ├── CarDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   └── dashboard/
│   │   │       ├── UserDashboard.jsx
│   │   │       ├── DriverDashboard.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── store/
│   │   │   ├── index.js        # Redux store
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── carSlice.js
│   │   │   └── api/
│   │   │       └── apiSlice.js # RTK Query
│   │   ├── utils/
│   │   │   ├── axios.js        # Axios instance + interceptors
│   │   │   └── helpers.js      # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Auth Endpoints

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| POST   | `/auth/register`              | Register new user    |
| POST   | `/auth/login`                 | Login                |
| POST   | `/auth/logout`                | Logout               |
| POST   | `/auth/refresh-token`         | Refresh access token |
| GET    | `/auth/verify-email/:token`   | Verify email         |
| POST   | `/auth/forgot-password`       | Send reset email     |
| PUT    | `/auth/reset-password/:token` | Reset password       |
| GET    | `/auth/me`                    | Get current user     |

### Cars

| Method | Endpoint         | Auth         | Description                                    |
| ------ | ---------------- | ------------ | ---------------------------------------------- |
| GET    | `/cars`          | No           | List all cars (filter, search, sort, paginate) |
| GET    | `/cars/featured` | No           | Get featured cars                              |
| GET    | `/cars/popular`  | No           | Get popular cars                               |
| GET    | `/cars/my-cars`  | Yes          | Driver's own cars                              |
| GET    | `/cars/:id`      | No           | Get single car                                 |
| POST   | `/cars`          | Driver/Admin | Create car                                     |
| PUT    | `/cars/:id`      | Driver/Admin | Update car                                     |
| DELETE | `/cars/:id`      | Driver/Admin | Delete car                                     |

### Bookings

| Method | Endpoint                | Auth | Description           |
| ------ | ----------------------- | ---- | --------------------- |
| POST   | `/bookings`             | User | Create booking        |
| GET    | `/bookings/my-bookings` | User | Get user bookings     |
| GET    | `/bookings/upcoming`    | User | Get upcoming bookings |
| GET    | `/bookings/:id`         | User | Get booking details   |
| PUT    | `/bookings/:id/status`  | Any  | Update booking status |

### Reviews

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | `/reviews/car/:carId` | Get car reviews |
| POST   | `/reviews`            | Create review   |
| PUT    | `/reviews/:id`        | Update review   |
| DELETE | `/reviews/:id`        | Delete review   |

### Admin

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| GET    | `/admin/dashboard`          | Dashboard stats |
| GET    | `/admin/users`              | All users       |
| PUT    | `/admin/users/:id`          | Update user     |
| GET    | `/admin/cars`               | All cars        |
| PUT    | `/admin/cars/:id/verify`    | Verify car      |
| GET    | `/admin/bookings`           | All bookings    |
| GET    | `/admin/drivers`            | All drivers     |
| PUT    | `/admin/drivers/:id/verify` | Verify driver   |

---

## ⚙️ Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/car-booking-2026

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@carbooking.com
FROM_NAME=CarBooking2026

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 🛠 Tech Stack

### Backend

- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database and ODM
- **Socket.io** — Real-time chat and notifications
- **JWT** — Access + Refresh token authentication
- **Bcrypt** — Password hashing
- **Cloudinary + Multer** — Image uploads
- **Helmet, CORS, Rate Limiting** — Security middleware
- **Winston + Morgan** — Logging
- **Nodemailer** — Email service

### Frontend

- **React 18 + Vite** — Frontend framework
- **Redux Toolkit + RTK Query** — State management and API caching
- **TanStack React Query** — Server state management
- **React Router DOM v6** — Client routing
- **Framer Motion** — Animations
- **Tailwind CSS** — Styling
- **React Hook Form** — Form handling
- **Axios** — HTTP client with interceptors
- **React Toastify** — Notifications
- **React Icons** — Icon library

---

## 🔒 Security Features

- JWT access + refresh tokens
- HTTP-only cookies
- Helmet security headers
- XSS protection
- MongoDB injection sanitization
- Rate limiting (200 req/15min)
- CORS configuration
- Password hashing with bcrypt (salt rounds: 12)
- Protected routes with RBAC

---

## 🎨 Features

- Light/Dark mode with local storage persistence
- Fully responsive (mobile, tablet, desktop)
- Lazy loading & code splitting
- Infinite scroll & pagination
- Debounced search
- Real-time notifications & chat (Socket.io)
- Advanced car filtering (brand, category, price, fuel, transmission)
- Booking system with status tracking
- Wishlist/Favorites
- Driver & Admin dashboards
- Payment system (mock implementation — ready for Stripe/JazzCash/EasyPaisa)
- Review & rating system
- Email verification & password reset

---

_Built with ❤️ — DriveLux_
