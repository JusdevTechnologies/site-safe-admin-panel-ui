# 🎯 SiteSafe Admin Panel - Enterprise MDM Management Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-19.2.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.3-38B2AC)
![React Router](https://img.shields.io/badge/React%20Router-7.0.0-CA4245)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

**A production-ready, enterprise-grade admin panel for Samsung MDM device camera blocking management.**

[Quick Start](#quick-start) • [Documentation](#documentation) • [Features](#features) • [Architecture](#architecture)

</div>

---

## 🚀 Overview

SiteSafe Admin Panel is a modern React-based web application designed for super administrators to manage Samsung Mobile Device Management (MDM) operations, specifically focusing on camera access control and device management.

### ✨ Key Features
- ✅ **JWT Authentication** - Secure login and session management
- ✅ **Dashboard** - Real-time device statistics and activity tracking
- ✅ **Device Management** - Block/unblock device cameras with instant control
- ✅ **OTP Management** - Generate and track uninstall OTPs
- ✅ **User Management** - Complete CRUD operations for admin users
- ✅ **Responsive Design** - Fully mobile-optimized interface
- ✅ **Enterprise UI/UX** - Professional design with Lucide icons

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Navigate to project
cd site-safe-admin-panel-ui

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

The application will open at **http://localhost:3000**

### Demo Credentials
```
Email: admin@sitesafe.com
Password: Demo@12345
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | Complete project overview |
| **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** | Detailed development guide |
| **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** | Backend API specifications |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Quick commands & checklists |
| **[DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md)** | Completion summary |

---

## 🎨 Features

- ✅ **Login Page** - JWT authentication with form validation
- ✅ **Dashboard** - Statistics cards & activity tracking
- ✅ **Device Management** - Block/unblock camera controls
- ✅ **OTP Management** - Generate & track uninstall OTPs
- ✅ **User Management** - Full CRUD operations
- ✅ **Responsive UI** - Mobile-first design
- ✅ **Protected Routes** - Role-based access control

---

## 🏗️ Technology Stack

- **React** 19.2.5 - UI Framework
- **Tailwind CSS** 3.4.3 - Styling
- **React Router** 7.0.0 - Routing
- **Axios** 1.7.0 - HTTP Client
- **Lucide React** 0.407.0 - Icons
- **JWT** - Authentication

---

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Navigation & layout
│   ├── Common/         # Shared UI components
│   └── Auth/           # Authentication UI
├── pages/              # Page components
├── contexts/           # React contexts
├── services/           # API services
├── constants/          # App constants
├── utils/              # Helper functions
└── App.js              # Main router
```

---

## 🚀 Available Scripts

```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
npm run lint    # Lint code
npm run eject   # Eject from CRA
```

---

## 🔒 Security

- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Secure token storage
- ✅ Automatic 401 error handling
- ✅ Input validation
- ✅ CORS ready

---

## 📱 Responsive Design

- **Mobile** (< 640px) - Full responsive
- **Tablet** (640-1024px) - Optimized layout
- **Desktop** (> 1024px) - Full features

---

## 🎨 Design System

### Colors
```
Primary:      #1E40AF (bg-blue-800)
Header:       #0F172A (bg-slate-950)
Success:      #16A34A (text-green-600)
Danger:       #DC2626 (text-red-600)
Warning:      #D97706 (text-amber-600)
Background:   #F8FAFC (bg-slate-50)
```

---

## 🔌 API Integration

Refer to **API_INTEGRATION_GUIDE.md** for:
- Complete endpoint specs
- Request/response formats
- Error handling standards
- Database schema

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

---

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
kill -9 $(lsof -t -i:3000)
```

**Module not found?**
```bash
rm -rf node_modules && npm install
```

---

## ✅ Status

✅ **PRODUCTION READY**

- All pages implemented
- Components fully functional
- Documentation complete
- Ready for backend integration

---

## 📞 Support

**Email**: support@jusdev.com
**Version**: 1.0.0
**Status**: Active Development

---

<div align="center">

Built with ❤️ by Jusdev Technologies

</div>
