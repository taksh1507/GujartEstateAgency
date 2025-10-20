# Deployment Guide

## Gujarat Real Estate Platform v2.1.0

This guide provides step-by-step instructions for deploying the Gujarat Real Estate platform to production.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Cloudinary account set up
- Git repository access

### 1. Environment Setup

#### Backend Environment Variables
Create `backend/.env`:
```env
# Server Configuration
PORT=8000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-admin-domain.com
```

#### Frontend Environment Variables
Create `admin-dashboard/.env`:
```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-api.com/api

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Firebase Configuration (Frontend)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 2. Backend Deployment

#### Option A: Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

#### Option B: Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FIREBASE_PROJECT_ID=your_project_id
# ... set all other environment variables

# Deploy
git subtree push --prefix backend heroku main
```

#### Option C: VPS Deployment
```bash
# On your VPS
git clone https://github.com/taksh1507/GujaratRealEstate.git
cd GujaratRealEstate/backend

# Install dependencies
npm install --production

# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start server.js --name "gujarat-estate-backend"

# Set up nginx reverse proxy
sudo nano /etc/nginx/sites-available/gujarat-estate
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-backend-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Frontend Deployment

#### Option A: Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set build command: `cd admin-dashboard && npm run build`
3. Set output directory: `admin-dashboard/dist`
4. Set environment variables in Vercel dashboard
5. Deploy automatically on push

#### Option B: Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd admin-dashboard
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Option C: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Build and deploy
cd admin-dashboard
npm run build
firebase deploy --only hosting
```

### 4. Database Setup

#### Firebase Firestore
1. Go to Firebase Console
2. Create a new project or use existing
3. Enable Firestore Database
4. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties collection - read public, write admin only
    match /properties/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Users collection - admin only
    match /users/{document} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Inquiries collection - admin only
    match /inquiries/{document} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

5. Create indexes for better performance:
```javascript
// Composite indexes
properties: [
  { fields: ['status', 'createdAt'], order: 'desc' },
  { fields: ['propertyType', 'price'], order: 'asc' },
  { fields: ['location', 'status'], order: 'desc' }
]
```

### 5. Cloudinary Setup

1. Create Cloudinary account
2. Get your cloud name, API key, and API secret
3. Create upload presets:
   - Name: `gujarat_estate_properties`
   - Mode: `unsigned` (for frontend uploads)
   - Folder: `gujarat-estate/properties`
   - Transformations: 
     - Width: 1200, Height: 800, Crop: limit
     - Quality: auto
     - Format: auto

### 6. SSL Certificate Setup

#### Using Let's Encrypt (for VPS)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Monitoring and Logging

#### Backend Monitoring
```bash
# Install monitoring tools
npm install --save express-rate-limit helmet morgan

# Set up logging
npm install --save winston
```

#### Frontend Analytics
```javascript
// Add Google Analytics
// In admin-dashboard/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 8. Performance Optimization

#### Backend Optimizations
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
const cache = require('memory-cache');

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

#### Frontend Optimizations
```javascript
// Lazy loading components
const PropertyForm = lazy(() => import('./pages/PropertyForm'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Image optimization
<img 
  src={`${imageUrl}?w=400&h=300&c=fill&f=auto&q=auto`}
  loading="lazy"
  alt="Property"
/>
```

### 9. Backup Strategy

#### Database Backup
```bash
# Firebase Firestore export
gcloud firestore export gs://your-backup-bucket/firestore-backup

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
gcloud firestore export gs://your-backup-bucket/backup_$DATE
```

#### Code Backup
- Use Git with multiple remotes
- Regular pushes to GitHub
- Automated deployment backups

### 10. Testing in Production

#### Health Check Endpoints
```javascript
// Backend health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

#### Frontend Health Check
```javascript
// Service worker for offline functionality
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 11. Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database connections working
- [ ] Image uploads functioning
- [ ] Authentication system working
- [ ] SSL certificates installed
- [ ] Monitoring and logging active
- [ ] Backup systems configured
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] CORS settings correct
- [ ] Rate limiting active
- [ ] Error tracking setup
- [ ] Analytics configured

### 12. Troubleshooting

#### Common Issues

**CORS Errors**
```javascript
// Backend CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));
```

**Firebase Connection Issues**
```javascript
// Check Firebase configuration
console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Firebase Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
```

**Cloudinary Upload Issues**
```javascript
// Check Cloudinary configuration
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', process.env.VITE_CLOUDINARY_UPLOAD_PRESET);
```

### 13. Maintenance

#### Regular Tasks
- Monitor server resources
- Check error logs daily
- Update dependencies monthly
- Backup database weekly
- Review security settings quarterly
- Performance audits monthly

#### Update Process
1. Test updates in staging environment
2. Create database backup
3. Deploy during low-traffic hours
4. Monitor for issues post-deployment
5. Rollback if necessary

---

## Support

For deployment support, contact: support@gujaratestate.com

## Documentation

- [API Documentation](./API_DOCS.md)
- [User Guide](./USER_GUIDE.md)
- [Development Setup](./README.md)