# Gujarat Real Estate - Complete Deployment Guide

This guide covers deploying the Gujarat Real Estate platform with three separate deployments:
1. **Backend API** - Railway/Heroku
2. **Admin Dashboard** - Vercel/Netlify  
3. **Frontend Website** - Vercel/Netlify

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Admin Dashboard│    │    Backend      │
│  (Main Site)    │    │   (Admin Panel) │    │   (API Server)  │
│                 │    │                 │    │                 │
│ yoursite.com    │    │ admin.site.com  │    │ api.site.com    │
│                 │    │                 │    │                 │
│ Vercel/Netlify  │    │ Vercel/Netlify  │    │ Railway/Heroku  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Firebase     │
                    │   (Database)    │
                    │                 │
                    │   Cloudinary    │
                    │   (Images)      │
                    └─────────────────┘
```

## 🚀 Quick Deployment Steps

### Prerequisites
- Node.js 16+ installed
- Git repository
- Firebase project setup
- Cloudinary account
- Domain names (optional)

### 1. Backend Deployment (Railway)

#### Step 1: Prepare Backend
```bash
cd backend
npm install
```

#### Step 2: Environment Variables
Create production environment variables on Railway:

```env
# Server Configuration
NODE_ENV=production
PORT=8000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
```

#### Step 3: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder as root
4. Add all environment variables
5. Deploy automatically

**Railway Configuration:**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: `8000`

### 2. Admin Dashboard Deployment (Vercel)

#### Step 1: Prepare Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run build
```

#### Step 2: Environment Variables
Create `.env.production` in admin-dashboard:

```env
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
VITE_APP_NAME=Gujarat Estate Admin
VITE_APP_VERSION=2.1.0
```

#### Step 3: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory**: `admin-dashboard`
4. Add environment variables
5. Deploy

**Vercel Configuration:**
```json
{
  "name": "gujarat-estate-admin",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Frontend Website Deployment (Vercel)

#### Step 1: Prepare Frontend
```bash
cd GujaratRealEstate-main
npm install
npm run build
```

#### Step 2: Environment Variables
Create `.env.production` in GujaratRealEstate-main:

```env
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
VITE_APP_NAME=Gujarat Real Estate
VITE_APP_VERSION=2.1.0
VITE_CONTACT_EMAIL=info@gujaratestate.com
VITE_CONTACT_PHONE=+91 98765 43210
```

#### Step 3: Deploy to Vercel
1. Create a new Vercel project
2. Import your GitHub repository
3. Set **Root Directory**: `GujaratRealEstate-main`
4. Add environment variables
5. Deploy

## 📁 Deployment Files

### Backend - Railway Configuration
Create `railway.json` in backend folder:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Admin Dashboard - Vercel Configuration
Create `vercel.json` in admin-dashboard folder:

```json
{
  "name": "gujarat-estate-admin",
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Frontend - Vercel Configuration
Create `vercel.json` in GujaratRealEstate-main folder:

```json
{
  "name": "gujarat-real-estate",
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 🔧 Build Scripts

### Update package.json scripts for deployment:

#### Backend package.json:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'",
    "test": "echo 'No tests specified'"
  }
}
```

#### Admin Dashboard package.json:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && vercel --prod"
  }
}
```

#### Frontend package.json:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && vercel --prod"
  }
}
```

## 🌐 Domain Configuration

### Custom Domains Setup:

1. **Backend**: `api.yoursite.com`
   - Point to Railway deployment
   - Add CNAME record in DNS

2. **Admin Dashboard**: `admin.yoursite.com`
   - Point to Vercel deployment
   - Add CNAME record in DNS

3. **Frontend**: `yoursite.com`
   - Point to Vercel deployment
   - Add A record or CNAME in DNS

### DNS Configuration Example:
```
Type    Name    Value
A       @       76.76.19.19 (Vercel IP)
CNAME   admin   your-admin-vercel-url.vercel.app
CNAME   api     your-backend-railway-url.railway.app
```

## 🔒 Security Configuration

### CORS Setup in Backend:
Update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://yoursite.com',
    'https://admin.yoursite.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Environment-specific API URLs:
Update both frontend projects to use environment-specific API URLs.

## 📊 Monitoring & Analytics

### Health Check Endpoints:
Backend includes health check at `/api/health`

### Performance Monitoring:
- Vercel Analytics for frontend performance
- Railway metrics for backend monitoring
- Firebase Analytics for user tracking

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS origins in backend
2. **Build Failures**: Check Node.js version compatibility
3. **Environment Variables**: Ensure all required vars are set
4. **API Connection**: Verify backend URL in frontend env vars

### Debug Commands:
```bash
# Check build locally
npm run build

# Test production build
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## 📝 Deployment Checklist

### Pre-deployment:
- [ ] Firebase project configured
- [ ] Cloudinary account setup
- [ ] Environment variables prepared
- [ ] Domain names purchased (optional)
- [ ] SSL certificates ready

### Backend Deployment:
- [ ] Railway project created
- [ ] Environment variables added
- [ ] Health check working
- [ ] CORS configured
- [ ] Database connected

### Admin Dashboard:
- [ ] Vercel project created
- [ ] Build successful
- [ ] Environment variables set
- [ ] API connection working
- [ ] Authentication working

### Frontend Website:
- [ ] Vercel project created
- [ ] Build successful
- [ ] Environment variables set
- [ ] API connection working
- [ ] All pages loading

### Post-deployment:
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions for automatic deployment:
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
          
  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          # Vercel deployment commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          # Vercel deployment commands
```

## 📞 Support

For deployment issues:
- Check logs in respective platforms
- Verify environment variables
- Test API endpoints
- Contact platform support if needed

---

**Next Steps**: Follow the platform-specific deployment guides below for detailed instructions.