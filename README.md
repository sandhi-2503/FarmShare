# 🌾 FARM SHARE AI

> **"Share Machinery. Grow Together."**
> Modern Agricultural Equipment-Sharing & Smart Rental Platform

FarmShare AI is a full-stack MERN agricultural machinery sharing platform designed for farmers to list, discover, request, and rent tractors, combine harvesters, seeders, sprayers, and rotavators with zero booking conflicts, transparent pricing, and direct WhatsApp connectivity.

---

## 🌟 Key Features

- **🚜 Machinery Discovery & Smart Search**: Real-time multi-filter by category, price per day/hour, city/state, availability, and sorting.
- **✨ AI Smart Recommendation Engine**: Rule-based & ML-ready matching analyzing farmer location, past rental categories, equipment ratings, and search context.
- **📅 Accurate Rental Calculation & Overlap Conflict Prevention**: Automatic server-side price calculation (daily/hourly + security deposit) and rejection of overlapping bookings.
- **💬 Direct WhatsApp Contact**: 1-click WhatsApp messaging upon booking approval with pre-filled messages.
- **🔔 Real-time Notifications & Toasts**: Instant alerts for owners on new requests and renters on approval/rejection.
- **📊 Real DB Analytics**: Owner & renter dashboards with genuine MongoDB metrics (earnings, active rentals, pending approvals).
- **🛡️ Secure JWT Authentication & Access Control**: Bcrypt password hashing, role guard protections (`owner`, `renter`, `both`).

---

## 📁 Project Structure

```
FarmShare/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with embedded fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   ├── equipmentController.js# CRUD, search, AI recommendations, stats
│   │   ├── rentalController.js   # Bookings, conflict checks, calculations, status
│   │   ├── notificationController.js # Alerts and mark-as-read
│   │   └── userController.js     # Profile & password management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   ├── uploadMiddleware.js   # Multer machinery image upload
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js               # Farmer & Owner schema
│   │   ├── Equipment.js          # Agricultural machinery schema
│   │   ├── RentalRequest.js      # Booking lifecycle schema
│   │   └── Notification.js       # User notification schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── equipmentRoutes.js
│   │   ├── rentalRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── recommendationService.js # AI matching engine
│   │   └── notificationService.js   # Push alert dispatcher
│   ├── uploads/
│   │   └── equipment/            # Uploaded machinery photos
│   ├── utils/
│   │   └── seedData.js           # Sample dataset seeder
│   ├── server.js                 # Express server & auto-seeder
│   ├── .env                      # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Sidebar, StatCard, StatusBadge, Modal, ConfirmDialog, LoadingSpinner, EmptyState, ToastContainer
│   │   │   ├── equipment/        # EquipmentCard, EquipmentGrid, SearchBar, FilterPanel, ImageUploader
│   │   │   ├── rental/           # RentalRequestModal with live calculation
│   │   │   ├── notifications/    # NotificationBell with unread badge
│   │   │   └── auth/             # ProtectedRoute wrapper
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global user state & actions
│   │   │   └── NotificationContext.jsx # Toast dispatcher & alerts
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero, live DB stats, AI recommendations, How it Works
│   │   │   ├── BrowseEquipment.jsx # Full catalog with search & filters
│   │   │   ├── EquipmentDetails.jsx # Specs, photo gallery, owner card, rent modal
│   │   │   ├── HowItWorks.jsx    # Dual-role workflow guide & FAQ
│   │   │   ├── About.jsx         # Agritech mission & pillars
│   │   │   ├── Login.jsx         # 1-click demo login buttons
│   │   │   ├── Signup.jsx        # Dual-role registration
│   │   │   └── dashboard/
│   │   │       ├── DashboardLayout.jsx
│   │   │       ├── DashboardHome.jsx
│   │   │       ├── MyMachinery.jsx
│   │   │       ├── AddMachinery.jsx
│   │   │       ├── EditMachinery.jsx
│   │   │       ├── OwnerRequests.jsx
│   │   │       ├── MyRentals.jsx
│   │   │       ├── NotificationsPage.jsx
│   │   │       └── ProfilePage.jsx
│   │   ├── services/
│   │   │   ├── api.js            # Axios with JWT interceptor
│   │   │   ├── authService.js
│   │   │   ├── equipmentService.js
│   │   │   ├── rentalService.js
│   │   │   ├── notificationService.js
│   │   │   └── userService.js
│   │   ├── utils/
│   │   │   └── formatters.js     # Currency (INR), date formatters, WhatsApp links
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Agricultural UI design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                  # Root runner script
└── README.md
```

---

## ⚡ Quick Start Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- NPM (v9 or higher)
- *(Optional)* Local MongoDB or MongoDB Atlas URI (If absent, the server automatically starts an embedded memory instance out of the box!)

### 2. Running Frontend & Backend Simultaneously

From the project root folder:

```bash
# Start backend server
npm run server

# In another terminal, start frontend
npm run client
```

Or run directly from their respective folders:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- **Backend API URL**: `http://localhost:5000`

---

## ⚙️ Environment Configuration (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/farmshare
JWT_SECRET=farmshare_ai_secure_jwt_token_key_2026_growth
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 👥 Demo Test Accounts (1-Click Login Available on Login Page)

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Owner** | Ramesh Patel | `ramesh.patel@farmshare.in` | `farmshare123` | Owns John Deere 5050D & Kubota Combine Harvester |
| **Renter** | Suresh Kumar | `suresh.kumar@farmshare.in` | `farmshare123` | Active renter in Tamil Nadu |
| **Both** | Ananya Sharma | `ananya.sharma@farmshare.in` | `farmshare123` | Owns Mahindra Arjun Novo & Shaktiman Rotavator |

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new farmer account
- `POST /api/auth/login` — Sign in and obtain JWT
- `GET /api/auth/me` — Retrieve current authenticated profile

### 🚜 Equipment Management (`/api/equipment`)
- `GET /api/equipment` — Browse machinery with search, category, location, and price filters
- `GET /api/equipment/:id` — View full specifications and owner profile
- `GET /api/equipment/my` — Get authenticated owner's machinery inventory
- `POST /api/equipment` — List new machinery with Multer photo upload
- `PUT /api/equipment/:id` — Update machinery listing
- `DELETE /api/equipment/:id` — Delete machinery listing
- `GET /api/equipment/recommendations` — AI smart recommended equipment
- `GET /api/equipment/stats/global` — Real database platform metrics

### 📅 Rental Bookings (`/api/rentals`)
- `POST /api/rentals` — Submit rental request with server-side pricing & overlap conflict checks
- `GET /api/rentals/my-requests` — Retrieve renter's bookings
- `GET /api/rentals/owner-requests` — Retrieve incoming booking requests for owner's machinery
- `GET /api/rentals/dashboard-stats` — Calculated real-time metrics for owner & renter
- `PUT /api/rentals/:id/approve` — Approve booking & trigger renter notification
- `PUT /api/rentals/:id/reject` — Reject booking
- `PUT /api/rentals/:id/cancel` — Cancel pending booking
- `PUT /api/rentals/:id/complete` — Mark rental completed & update equipment rental counter

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications` — List notifications with unread count
- `PUT /api/notifications/:id/read` — Mark notification read
- `PUT /api/notifications/read-all` — Mark all notifications read

### 👤 User Settings (`/api/users`)
- `PUT /api/users/profile` — Update name, phone, bio, and farm location
- `PUT /api/users/change-password` — Change password with bcrypt verification

---

## ✅ End-to-End Testing Verification Checklist

- [x] **Signup & Login**: Tested authentication, password hashing, and role persistence.
- [x] **Owner Flow**: Added machinery, uploaded images, verified listing appearance and statistics update.
- [x] **Renter Flow**: Filtered catalog, viewed details, calculated daily/hourly rate with security deposit, and submitted booking.
- [x] **Booking Overlap Prevention**: Tested conflicting date booking logic (Section 43).
- [x] **Owner Action & Notification**: Owner accepted request, status changed to `approved`, and renter received notification.
- [x] **WhatsApp Direct Connect**: Clicked WhatsApp button with pre-populated message and owner phone.
- [x] **Access Control**: Guaranteed owners cannot edit other farmers' equipment.
- [x] **Responsive Layout**: Verified navbar, sidebar drawer, cards, and tables on desktop and mobile viewports.
