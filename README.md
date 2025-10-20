# Gujarat Real Estate Platform

A comprehensive real estate management platform built with React, Node.js, Firebase, and Cloudinary.

## 🚀 Features

### Admin Dashboard
- **Property Management**: Create, edit, delete, and manage property listings
- **Real-time Analytics**: Dashboard with real statistics from Firebase
- **Image Management**: Cloudinary integration for unlimited image storage
- **Status Management**: Individual and bulk property status updates
- **Advanced Search**: Filter properties by type, location, price range
- **Responsive Design**: Works seamlessly on desktop and mobile

### Property Features
- **Multiple Images**: Horizontal scrolling gallery with full-screen preview
- **Real-time Data**: All data stored and retrieved from Firebase Firestore
- **Status Tracking**: Active, Pending, Sold, Inactive status management
- **Comprehensive Details**: Price, location, beds, baths, area, amenities
- **Agent Information**: Contact details for each property

### Technical Features
- **Firebase Integration**: Real-time database with Firestore
- **Cloudinary Storage**: Optimized image storage and delivery
- **JWT Authentication**: Secure admin authentication
- **RESTful API**: Well-structured backend API
- **Real Statistics**: Dynamic analytics from actual data
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **React Hook Form** for form management
- **Recharts** for analytics visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **Firebase Admin SDK** for database operations
- **Cloudinary SDK** for image management
- **JWT** for authentication
- **Joi** for validation
- **CORS** for cross-origin requests

### Database & Storage
- **Firebase Firestore** for real-time database
- **Cloudinary** for image storage and optimization

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Cloudinary account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=8000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to admin-dashboard directory:
```bash
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Firebase Configuration (Frontend)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Generate service account credentials
4. Add configuration to `.env` files

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Create an upload preset for property images
4. Add configuration to `.env` files

## 📱 Usage

### Admin Login
- Email: `admin@gujaratestate.com`
- Password: `admin123`

### Property Management
1. **Add Property**: Click "Add Property" to create new listings
2. **Edit Property**: Click "Edit" on any property card
3. **Update Status**: Use dropdown or bulk actions to change status
4. **Upload Images**: Drag and drop multiple images with Cloudinary storage
5. **View Analytics**: Check dashboard for real-time statistics

### Image Management
- **Upload**: Drag and drop multiple images
- **Preview**: Click any image for full-screen view
- **Navigate**: Use arrow keys or buttons to browse images
- **Delete**: Remove images individually
- **Storage**: All images stored on Cloudinary CDN

## 🎯 Key Features Implemented

### Version 2.0 Features
- ✅ Real Firebase Firestore integration
- ✅ Cloudinary image storage and management
- ✅ Property status updates (individual & bulk)
- ✅ Advanced image gallery with scroll features
- ✅ Real-time analytics dashboard
- ✅ Comprehensive property CRUD operations
- ✅ Responsive design with mobile support
- ✅ Error handling and user feedback
- ✅ JWT authentication system
- ✅ RESTful API architecture

### Analytics Dashboard
- Real property statistics from Firebase
- Monthly performance charts
- Property type distribution
- Location-based analytics
- Price range analysis
- Revenue tracking
- Growth percentage calculations

### Image Gallery Features
- Horizontal scrolling for multiple images
- Full-screen modal with navigation
- Thumbnail strip for quick access
- Upload progress indicators
- Cloudinary optimization
- Responsive design

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Configure Firebase service account
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or Firebase Hosting
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for real-time database
- Cloudinary for image management
- React team for the amazing framework
- Tailwind CSS for utility-first styling
- All contributors and testers

## 📞 Support

For support, email support@gujaratestate.com or create an issue in the repository.

---

**Version**: 2.0.0  
**Last Updated**: October 2025  
**Status**: Production Ready