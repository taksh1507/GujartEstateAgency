# 🏠 Gujarat Estate Agency

A comprehensive real estate management platform specializing in Mumbai properties with separate admin dashboard and frontend website, built with React, Node.js, Firebase, and Cloudinary.

## 🌟 Features

### 🎯 Frontend Website
- **Property Listings** with advanced search and filtering
- **User Authentication** with email verification
- **Property Inquiries** with conversation threads
- **Saved Properties** functionality
- **User Profiles** with real-time statistics
- **Responsive Design** for all devices

### 🔧 Admin Dashboard
- **Property Management** with CRUD operations
- **User Management** with status controls
- **Inquiry Management** with conversation threads
- **Real-time Analytics** and statistics
- **Image Management** with Cloudinary integration
- **Settings Management** for site configuration

### 🚀 Backend API
- **RESTful API** with Express.js
- **Firebase Firestore** for database
- **Cloudinary** for image storage
- **JWT Authentication** with role-based access
- **Email Services** with Gmail SMTP
- **Rate Limiting** and security features

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Admin Dashboard│    │    Backend      │
│  (Main Site)    │    │   (Admin Panel) │    │   (API Server)  │
│                 │    │                 │    │                 │
│ React + Vite    │    │ React + Vite    │    │ Node.js + Express│
│ Tailwind CSS    │    │ Tailwind CSS    │    │ Firebase        │
│                 │    │                 │    │ Cloudinary      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Shared Services│
                    │                 │
                    │ Firebase Firestore│
                    │ Cloudinary CDN   │
                    │ Gmail SMTP       │
                    └─────────────────┘
```

## � Project Structure

```
gujarat-real-estate/
├── backend/                     # Node.js API Server
│   ├── config/                 # Configuration files
│   ├── middleware/             # Express middleware
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── data/                   # Mock data
│   ├── server.js               # Main server file
│   └── package.json
│
├── admin-dashboard/            # Admin Panel (React)
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── contexts/           # React contexts
│   │   └── config/             # Configuration
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
│
├── GujaratRealEstate-main/     # Frontend Website (React)
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # React contexts
│   │   ├── layouts/            # Layout components
│   │   ├── styles/             # CSS styles
│   │   └── utils/              # Utility functions
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
│
├── docs/                       # Documentation
│   ├── DEPLOYMENT_GUIDE.md     # Complete deployment guide
│   ├── RAILWAY_DEPLOYMENT.md   # Backend deployment
│   ├── VERCEL_DEPLOYMENT.md    # Frontend deployments
│   └── QUICK_DEPLOY.md         # Quick start guide
│
├── deploy.sh                   # Deployment script
├── package.json                # Root package.json
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+
- Firebase project
- Cloudinary account
- Gmail account (for SMTP)

### 1. Clone Repository
```bash
git clone https://github.com/taksh1507/GujartEstateAgency.git
cd GujartEstateAgency
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your Firebase, Cloudinary, and Gmail credentials
```

#### Admin Dashboard (.env)
```bash
cd admin-dashboard
cp .env.example .env
# Edit .env with your API URL
```

#### Frontend (.env)
```bash
cd GujaratRealEstate-main
cp .env.example .env
# Edit .env with your API URL
```

### 4. Start Development Servers
```bash
# Start all services (backend + admin + frontend)
npm run dev

# Or start individually:
npm run dev:backend    # Backend API (port 8000)
npm run dev:admin      # Admin Dashboard (port 5174)
npm run dev:frontend   # Frontend Website (port 5173)
```

### 5. Access Applications
- **Frontend Website**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **Backend API**: http://localhost:8000

## 🔐 Default Admin Credentials

- **Email**: `yourgmailaccount@gmail.com`
- **Password**: `password setup `

## 📦 Deployment

### Quick Deploy (15 minutes)

#### 1. Backend → Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo, set root to `backend`
4. Add environment variables (see `backend/.env.example`)
5. Deploy!

#### 2. Admin Dashboard → Vercel
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from GitHub
3. Set root directory to `admin-dashboard`
4. Add environment variables:
   ```env
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   VITE_APP_NAME=Gujarat Estate Admin
   VITE_FIREBASE_PROJECT_ID=gujarat-estate-agency-aa5ac
   ```
5. Deploy!

#### 3. Frontend Website → Vercel
1. Go to [vercel.com](https://vercel.com) (new project)
2. Import SAME GitHub repo
3. Set root directory to `GujaratRealEstate-main`
4. Add environment variables:
   ```env
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   VITE_APP_NAME=Gujarat Real Estate
   ```
5. Deploy!

## 🛠️ Built With

### Frontend & Admin
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Database
- **Cloudinary** - Image storage
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Joi** - Validation

### Services
- **Firebase Firestore** - Database
- **Cloudinary** - Image CDN
- **Gmail SMTP** - Email delivery

## 📊 Features Overview

### 🏠 Property Management
- ✅ CRUD operations for properties
- ✅ Image upload with Cloudinary
- ✅ Property status management
- ✅ Advanced search and filtering
- ✅ Property statistics and analytics

### 👥 User Management
- ✅ User registration and authentication
- ✅ Email verification with OTP
- ✅ Password reset functionality
- ✅ User profiles and preferences
- ✅ Admin user management

### 💬 Inquiry System
- ✅ Property inquiry submissions
- ✅ Conversation threads
- ✅ Admin response management
- ✅ Inquiry status tracking
- ✅ Email notifications

### 📈 Analytics & Reporting
- ✅ Real-time statistics
- ✅ Property performance metrics
- ✅ User engagement analytics
- ✅ Revenue tracking
- ✅ Growth indicators

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Security headers
- ✅ Environment variable protection

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop experience
- ✅ Touch-friendly interfaces
- ✅ Progressive Web App features

## 🧪 Testing

```bash
# Test builds
npm run test:build

# Test individual components
cd backend && npm test
cd admin-dashboard && npm test
cd GujaratRealEstate-main && npm test
```

## 📚 Documentation

- [Changelog](CHANGELOG.md) - Version history
- Environment examples in each project folder
- Configuration files included for deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Taksh Gandhi**
- GitHub: [@taksh1507](https://github.com/taksh1507)
- Email: takshgandhi4@gmail.com

## 🙏 Acknowledgments

- Firebase team for the excellent real-time database
- Cloudinary for powerful image management
- React team for the amazing framework
- Vercel and Railway for deployment platforms

## 📞 Support

- **Email**: takshgandhi4@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/taksh1507/GujartEstateAgency/issues)
- **Documentation**: [View docs](https://github.com/taksh1507/GujartEstateAgency#readme)

---

## 🚀 Live Demo

- **Frontend Website**: [Coming Soon]
- **Admin Dashboard**: [Coming Soon]
- **API Documentation**: [Coming Soon]

---

**Made with ❤️ for Mumbai Real Estate**