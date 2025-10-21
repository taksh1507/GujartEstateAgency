# 🔧 Deployment Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Blank Page on Vercel Deployment

**Symptoms:**
- Site loads but shows blank white page
- No console errors or minimal errors
- Build succeeds but runtime fails

**Causes & Solutions:**

#### ❌ Issue: Incorrect Base Path
```javascript
// WRONG - in vite.config.js
base: '/GujaratRealEstate/',

// WRONG - in App.jsx
<Router basename="/GujaratRealEstate">
```

#### ✅ Solution: Use Root Path
```javascript
// CORRECT - in vite.config.js
base: '/',

// CORRECT - in App.jsx
<Router>
```

#### ❌ Issue: Missing Environment Variables
```bash
# Missing API URL causes blank page
VITE_API_BASE_URL=undefined
```

#### ✅ Solution: Set Environment Variables
```bash
# In Vercel dashboard or .env.production
VITE_API_BASE_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Gujarat Real Estate
```

### 2. Build Failures

**Common Build Errors:**

#### Error: "Module not found"
```bash
# Check if all dependencies are installed
npm install

# Check for missing imports
# Ensure all imported files exist
```

#### Error: "Out of memory"
```javascript
// Add to vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

### 3. Routing Issues

#### Error: 404 on page refresh
```json
// Ensure vercel.json has rewrites
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Error: Routes not working
```javascript
// Check Router configuration
<Router> // Not <Router basename="/something">
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Router>
```

### 4. API Connection Issues

#### Error: CORS errors
```javascript
// Backend server.js - Update CORS origins
const corsOptions = {
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app'
  ]
};
```

#### Error: API calls failing
```bash
# Check environment variables
echo $VITE_API_BASE_URL

# Should be: https://your-backend.railway.app/api
# NOT: http://localhost:8000/api
```

### 5. Environment Variable Issues

#### Variables not loading
```bash
# Ensure variables start with VITE_
VITE_API_BASE_URL=https://api.example.com  ✅
API_BASE_URL=https://api.example.com       ❌

# Check in Vercel dashboard
# Settings → Environment Variables
```

## 🛠️ Quick Fixes

### Fix 1: Reset Vercel Configuration
```bash
# Delete and recreate vercel.json
rm vercel.json

# Create minimal config
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Fix 2: Test Build Locally
```bash
# Test build process
npm run build

# Test production build
npm run preview

# Check dist folder
ls -la dist/
```

### Fix 3: Check Console Errors
```javascript
// Add error boundary to catch React errors
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### Fix 4: Simplify App.jsx
```javascript
// Minimal App.jsx for testing
function App() {
  return (
    <div>
      <h1>Gujarat Real Estate</h1>
      <p>Site is working!</p>
    </div>
  );
}
```

## 🔍 Debugging Steps

### Step 1: Check Build Logs
1. Go to Vercel dashboard
2. Click on your deployment
3. Check "Functions" and "Build Logs"
4. Look for error messages

### Step 2: Check Runtime Logs
1. Open browser developer tools
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Sources tab for missing files

### Step 3: Test Locally
```bash
# Install dependencies
npm install

# Build project
npm run build

# Test production build
npm run preview

# If local works but Vercel doesn't, it's a deployment config issue
```

### Step 4: Check Environment Variables
```bash
# In your component, temporarily log env vars
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
console.log('App Name:', import.meta.env.VITE_APP_NAME);
```

## 📋 Deployment Checklist

### Before Deployment:
- [ ] Remove basename from Router
- [ ] Set base: '/' in vite.config.js
- [ ] Add environment variables to Vercel
- [ ] Test build locally with `npm run build`
- [ ] Check vercel.json has rewrites
- [ ] Ensure all imports are correct

### After Deployment:
- [ ] Check site loads without errors
- [ ] Test all routes work
- [ ] Verify API calls work
- [ ] Check console for errors
- [ ] Test on mobile devices

## 🆘 Emergency Fixes

### If Site is Completely Broken:
```bash
# Revert to minimal configuration
# 1. Simplify App.jsx to basic HTML
# 2. Remove all complex routing
# 3. Remove environment variable dependencies
# 4. Deploy minimal version first
# 5. Add features back gradually
```

### If Build Keeps Failing:
```bash
# Clear all caches
rm -rf node_modules package-lock.json
npm install

# Use minimal vercel.json
{
  "version": 2,
  "framework": "vite"
}
```

## 📞 Getting Help

### Vercel Support:
- Check Vercel status page
- Search Vercel documentation
- Check Vercel Discord community

### Common Solutions:
1. **Blank page** → Check base path and routing
2. **Build fails** → Check dependencies and imports
3. **404 errors** → Check vercel.json rewrites
4. **API errors** → Check environment variables and CORS

---

**Remember**: Most deployment issues are configuration problems, not code problems!