# 🎯 Lost & Found Portal

A modern, cloud-based web application for reporting and managing lost and found items with an intelligent approval workflow system. Built with the MERN stack and styled with Tailwind CSS.

## ✨ Key Features

- **🔐 Secure Authentication** - JWT-based auth with role-based access control
- **📱 Modern Dark UI** - Beautiful, responsive design with Tailwind CSS
- **☁️ Cloud Database** - MongoDB Atlas integration for global access
- **🛡️ Smart Moderation** - Automated approval workflow with moderator oversight
- **🔍 Advanced Search** - Find items quickly with filters and search
- **📱 Mobile-First** - Optimized for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free tier available)

### 1. Clone & Install
```bash
git clone <repository-url>
cd lost-found-app
npm install
cd client && npm install && cd ..
```

### 2. Environment Setup
Create `config.env` in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
```

### 3. Create Moderator Account
```bash
# Create default moderator
node scripts/setup-moderator.js

# Or create custom moderator
node scripts/create-moderator.js username email password
```

### 4. Start Application
```bash
# Option 1: Use batch file (Windows)
start.bat

# Option 2: Manual start
npm run dev          # Backend (port 5000)
npm run client       # Frontend (port 3000)
```

**Access**: Frontend: http://localhost:3000 | Backend: http://localhost:5000

## 👥 User Roles & Access

### 🔑 Default Credentials
- **Moderator**: `moderator@example.com` / `moderator123`
- **Admin**: `admin@example.com` / `admin123`

### 👤 Regular User
- Submit lost/found items
- Browse approved items
- Claim found items
- Manage personal posts

### 👮‍♂️ Moderator
- Review & approve/reject submissions
- Access admin dashboard
- Manage user content
- View system statistics

## 🏗️ Architecture

```
Frontend (React + Tailwind) ←→ Backend (Node.js + Express) ←→ MongoDB Atlas
```

### Tech Stack
- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: Node.js, Express, JWT, bcrypt
- **Database**: MongoDB Atlas (cloud)
- **Styling**: Tailwind CSS with custom dark theme

## 📱 UI Features

- **🌙 Dark Theme** - Easy on the eyes
- **📱 Responsive Design** - Works on all devices
- **🎨 Modern Components** - Cards, forms, buttons
- **🔍 Smart Search** - Filter by category, location, date
- **📊 Dashboard** - User and moderator panels

## 🔧 Management Scripts

```bash
# List all moderators
node scripts/list-moderators.js

# Create new moderator
node scripts/create-moderator.js username email password

# Setup default moderator
node scripts/setup-moderator.js
```

## 📊 API Endpoints

### Core Routes
- `POST /api/auth/login` - User authentication
- `POST /api/items` - Submit new item
- `GET /api/items` - Browse items
- `POST /api/moderators/:id/approve` - Approve item
- `POST /api/moderators/:id/reject` - Reject item

## 🚧 Development

### Project Structure
```
lost-found-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page views
│   │   └── index.css      # Tailwind + custom styles
├── models/                 # MongoDB schemas
├── routes/                 # API endpoints
├── scripts/                # Management scripts
├── server.js              # Express server
└── config.env             # Environment variables
```

### Available Scripts
- `npm run dev` - Start backend with auto-reload
- `npm run client` - Start React dev server
- `npm start` - Production build

## 🌟 What's New

- ✅ **MongoDB Atlas Integration** - Cloud database
- ✅ **Modern Dark UI** - Tailwind CSS styling
- ✅ **Moderator Management** - Easy admin setup
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Secure Authentication** - JWT + bcrypt

## 🔮 Roadmap

- [ ] Image upload support
- [ ] Email notifications
- [ ] Real-time chat
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

## 🤝 Support

- **Issues**: Create GitHub issue
- **Documentation**: Check code comments
- **Setup Help**: Review scripts folder

---

**Built with ❤️ using MERN + Tailwind CSS**
