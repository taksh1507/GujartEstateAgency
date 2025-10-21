# 🚀 Quick Deployment Guide

Deploy your Gujarat Real Estate platform in 3 separate deployments:

## 📋 Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] Git repository on GitHub
- [ ] Firebase project created
- [ ] Cloudinary account setup
- [ ] Railway account ([railway.app](https://railway.app))
- [ ] Vercel account ([vercel.com](https://vercel.com))

## ⚡ Quick Deploy Steps

### 1. Backend API → Railway (5 minutes)

```bash
# 1. Go to railway.app
# 2. New Project → Deploy from GitHub
# 3. Select your repo, set root to 'backend'
# 4. Add environment variables (see backend/.env.example)
# 5. Deploy!
```

**Environment Variables Needed:**
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, etc.
- `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`

### 2. Admin Dashboard → Vercel (3 minutes)

```bash
# 1. Go to vercel.com
# 2. New Project → Import from GitHub
# 3. Set root directory to 'admin-dashboard'
# 4. Add environment variable: VITE_API_BASE_URL=https://your-backend.railway.app/api
# 5. Deploy!
```

### 3. Frontend Website → Vercel (3 minutes)

```bash
# 1. Go to vercel.com (new project)
# 2. Import SAME GitHub repo
# 3. Set root directory to 'GujaratRealEstate-main'
# 4. Add environment variable: VITE_API_BASE_URL=https://your-backend.railway.app/api
# 5. Deploy!
```

## 🌐 Result

After deployment, you'll have:

- **Backend API**: `https://your-backend.railway.app`
- **Admin Dashboard**: `https://your-admin.vercel.app`
- **Frontend Website**: `https://your-frontend.vercel.app`

## 🔧 Custom Domains (Optional)

1. **Buy domains** (e.g., `yoursite.com`)
2. **Set DNS records**:
   - `yoursite.com` → Frontend Vercel project
   - `admin.yoursite.com` → Admin Vercel project
   - `api.yoursite.com` → Railway backend

## ✅ Test Your Deployment

1. **Backend**: Visit `https://your-backend.railway.app/api/health`
2. **Admin**: Login at `https://your-admin.vercel.app`
3. **Frontend**: Browse properties at `https://your-frontend.vercel.app`

## 🆘 Need Help?

- **Detailed Guide**: Read `DEPLOYMENT_GUIDE.md`
- **Railway Issues**: Check `RAILWAY_DEPLOYMENT.md`
- **Vercel Issues**: Check `VERCEL_DEPLOYMENT.md`

## 🎯 One-Command Deploy (Advanced)

```bash
# Make deploy script executable and run
chmod +x deploy.sh
./deploy.sh
```

---

**Total Time**: ~15 minutes for all three deployments! 🎉