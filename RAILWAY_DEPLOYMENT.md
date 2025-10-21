# Railway Deployment Guide - Backend API

This guide covers deploying the Gujarat Real Estate backend API to Railway.

## 🚂 Railway Deployment Steps

### Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub repository
- Firebase project setup
- Cloudinary account

### Step 1: Prepare Your Repository

1. **Ensure your backend code is in the `backend` folder**
2. **Verify `railway.json` exists in the backend folder**
3. **Check `package.json` has correct start script**

### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder as the root directory

### Step 3: Configure Environment Variables

Add these environment variables in Railway dashboard:

#### Required Variables:
```env
NODE_ENV=production
PORT=8000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.vercel.app
ADMIN_URL=https://your-admin-domain.vercel.app
```

#### How to Get Firebase Private Key:
1. Go to Firebase Console → Project Settings
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Copy the `private_key` value (including `\n` characters)
6. Paste it in Railway with quotes: `"-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"`

#### How to Get Gmail App Password:
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings
3. Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Use this password in `EMAIL_PASS`

### Step 4: Configure Build Settings

Railway should automatically detect your Node.js app. Verify these settings:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`
- **Node Version**: 18.x or higher

### Step 5: Deploy

1. Click "Deploy" in Railway dashboard
2. Monitor the build logs
3. Wait for deployment to complete
4. Test the health endpoint: `https://your-app.railway.app/api/health`

### Step 6: Custom Domain (Optional)

1. In Railway dashboard, go to Settings
2. Click "Domains"
3. Add your custom domain (e.g., `api.yoursite.com`)
4. Update your DNS records:
   ```
   Type: CNAME
   Name: api
   Value: your-app.railway.app
   ```

## 🔧 Troubleshooting

### Common Issues:

#### Build Failures:
```bash
# Check Node.js version
node --version

# Verify package.json
cat backend/package.json
```

#### Environment Variable Issues:
- Ensure Firebase private key includes `\n` characters
- Check that all required variables are set
- Verify JWT secret is at least 32 characters

#### CORS Errors:
- Update `FRONTEND_URL` and `ADMIN_URL` with actual deployed URLs
- Check CORS configuration in `server.js`

#### Database Connection Issues:
- Verify Firebase project ID
- Check Firebase service account permissions
- Ensure Firestore is enabled in Firebase console

### Debug Commands:
```bash
# Check Railway logs
railway logs

# Connect to Railway shell
railway shell

# Check environment variables
railway variables
```

## 📊 Monitoring

### Health Check:
Railway automatically monitors your app using the health check endpoint at `/api/health`.

### Logs:
View logs in Railway dashboard or use CLI:
```bash
railway logs --tail
```

### Metrics:
Railway provides built-in metrics for:
- CPU usage
- Memory usage
- Network traffic
- Response times

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your main branch. To disable:

1. Go to Settings in Railway dashboard
2. Turn off "Auto Deploy"

### Manual Deployment:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Only allow your frontend domains
3. **Rate Limiting**: Configure rate limiting for API endpoints
4. **HTTPS**: Railway provides HTTPS by default
5. **Monitoring**: Set up alerts for errors and downtime

## 📝 Deployment Checklist

- [ ] Repository connected to Railway
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Health check endpoint working
- [ ] Database connection established
- [ ] CORS configured for frontend domains
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring and alerts set up

## 🆘 Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)

---

**Next**: Deploy your frontend applications using the Vercel deployment guides.