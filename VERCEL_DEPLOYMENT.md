# Vercel Deployment Guide - Frontend & Admin Dashboard

This guide covers deploying both the frontend website and admin dashboard to Vercel.

## ▲ Vercel Deployment Overview

You'll create **two separate Vercel projects**:
1. **Frontend Website** (`GujaratRealEstate-main` folder)
2. **Admin Dashboard** (`admin-dashboard` folder)

## 🌐 Frontend Website Deployment

### Step 1: Prepare Frontend

1. **Navigate to frontend folder**:
   ```bash
   cd GujaratRealEstate-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test build locally**:
   ```bash
   npm run build
   npm run preview
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set **Root Directory** to `GujaratRealEstate-main`
5. Configure environment variables (see below)
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from GujaratRealEstate-main folder
cd GujaratRealEstate-main
vercel --prod
```

### Step 3: Configure Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
VITE_API_BASE_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Gujarat Real Estate
VITE_APP_VERSION=2.1.0
VITE_CONTACT_EMAIL=info@gujaratestate.com
VITE_CONTACT_PHONE=+91 98765 43210
```

**Important**: Replace `your-backend.railway.app` with your actual Railway backend URL.

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your domain (e.g., `yoursite.com`)
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.19.19
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 🔧 Admin Dashboard Deployment

### Step 1: Prepare Admin Dashboard

1. **Navigate to admin folder**:
   ```bash
   cd admin-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test build locally**:
   ```bash
   npm run build
   npm run preview
   ```

### Step 2: Deploy to Vercel

#### Create Separate Vercel Project:

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the **same GitHub repository**
4. **Important**: Set **Root Directory** to `admin-dashboard`
5. Configure environment variables (see below)
6. Click "Deploy"

### Step 3: Configure Environment Variables

Add these in Vercel dashboard:

```env
VITE_API_BASE_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Gujarat Estate Admin
VITE_APP_VERSION=2.1.0
```

### Step 4: Custom Domain (Optional)

1. Add subdomain (e.g., `admin.yoursite.com`)
2. Update DNS records:
   ```
   Type: CNAME
   Name: admin
   Value: your-admin-project.vercel.app
   ```

## 📁 Project Structure for Vercel

Your repository should look like this:

```
your-repo/
├── backend/                 # Railway deployment
├── admin-dashboard/         # Vercel project #1
│   ├── vercel.json
│   ├── package.json
│   └── src/
├── GujaratRealEstate-main/  # Vercel project #2
│   ├── vercel.json
│   ├── package.json
│   └── src/
└── DEPLOYMENT_GUIDE.md
```

## ⚙️ Vercel Configuration Files

Both projects include `vercel.json` files with optimized settings:

### Frontend vercel.json:
```json
{
  "name": "gujarat-real-estate",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Admin vercel.json:
```json
{
  "name": "gujarat-estate-admin",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🔄 Automatic Deployments

Vercel automatically redeploys when you push to your main branch.

### Configure Branch Deployments:

1. **Production**: `main` branch
2. **Preview**: All other branches get preview URLs

### Disable Auto-Deploy:
1. Go to Settings → Git
2. Turn off "Auto-Deploy"

## 🔧 Build Configuration

### Vite Build Settings:

Both projects use Vite with these optimizations:

```javascript
// vite.config.js
export default {
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues:

#### Build Failures:
```bash
# Check Node.js version (should be 16+)
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
```

#### Environment Variable Issues:
- Ensure all `VITE_` prefixed variables are set
- Check that API URL is correct and accessible
- Verify no trailing slashes in URLs

#### Routing Issues (404 on refresh):
- Ensure `vercel.json` has correct routing rules
- Check that `outputDirectory` is set to `dist`

#### API Connection Issues:
- Verify backend is deployed and accessible
- Check CORS configuration in backend
- Ensure API URL in environment variables is correct

### Debug Commands:
```bash
# Check build output
npm run build
ls -la dist/

# Test production build locally
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## 📊 Performance Optimization

### Vercel Analytics:
Add to your projects for performance monitoring:

```bash
npm install @vercel/analytics
```

```javascript
// Add to main.jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Speed Insights:
```bash
npm install @vercel/speed-insights
```

```javascript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights />
    </>
  );
}
```

## 🔒 Security Headers

Both `vercel.json` files include security headers:

```json
{
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
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 📝 Deployment Checklist

### Frontend Website:
- [ ] Vercel project created with correct root directory
- [ ] Environment variables configured
- [ ] Build successful
- [ ] All pages loading correctly
- [ ] API connection working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Admin Dashboard:
- [ ] Separate Vercel project created
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Authentication working
- [ ] API connection working
- [ ] All admin features functional
- [ ] Custom subdomain configured (optional)

## 🌍 Domain Configuration

### DNS Records for Custom Domains:

```
# Main website (yoursite.com)
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com

# Admin subdomain (admin.yoursite.com)
Type: CNAME
Name: admin
Value: your-admin-project.vercel.app
```

## 🆘 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Discord**: [vercel.com/discord](https://vercel.com/discord)
- **Vercel Status**: [vercel-status.com](https://vercel-status.com)

---

**Next**: Configure your custom domains and SSL certificates for a professional setup.