# GitHub Pages Deployment Guide

## � TROUBLESHOOTING: GitHub Pages Deployment Failed

If you received the error "Get Pages site failed. Please verify that the repository has Pages enabled", follow these steps:

### ✅ Quick Fix Steps

1. **Enable GitHub Pages Manually**
   - Go to: https://github.com/taksh1507/GujaratRealEstate/settings/pages
   - Under "Source", select "GitHub Actions"
   - If not available, select "Deploy from a branch" → "gh-pages" → "/ (root)"
   - Click "Save"

2. **Trigger Deployment**
   - Go to: https://github.com/taksh1507/GujaratRealEstate/actions
   - Click "Deploy to GitHub Pages" workflow
   - Click "Run workflow" → "Run workflow"

3. **Alternative: Manual Deployment**
   ```bash
   npm run deploy
   ```

---

## 🚀 Original Deployment Guide

This guide will help you deploy the Gujarat Estate Agency website to GitHub Pages for free hosting.

### Prerequisites

1. **GitHub Account** - Make sure you have a GitHub account
2. **Git Installed** - Ensure Git is installed on your computer
3. **Project Ready** - The project is already configured for GitHub Pages deployment

### Step-by-Step Deployment

#### 1. Initialize Git Repository (if not done)
```bash
git init
git add .
git commit -m "Initial commit - Gujarat Estate Agency website"
```

#### 2. Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New Repository" or the "+" icon
3. Name your repository `realestate` (must match the base path in vite.config.js)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README, .gitignore, or license (we already have these)

#### 3. Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/realestate.git
git branch -M main
git push -u origin main
```

#### 4. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. The deployment workflow will automatically trigger

#### 5. Alternative Manual Deployment
If you prefer manual deployment using gh-pages package:

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

### 🌐 Accessing Your Website

After deployment, your website will be available at:
```
https://YOUR_USERNAME.github.io/realestate/
```

For example: `https://johndoe.github.io/realestate/`

### 🔧 Configuration Files

The project is already configured with:

- **`.github/workflows/deploy.yml`** - Automatic deployment workflow
- **`vite.config.js`** - Base path set to `/realestate/`
- **`404.html`** - SPA routing support for GitHub Pages
- **Router basename** - Set to `/realestate` in App.jsx

### 📝 Important Notes

1. **Repository Name**: Must be `realestate` to match the base path
2. **Public Repository**: Required for free GitHub Pages
3. **Build Time**: First deployment may take 2-5 minutes
4. **Updates**: Any push to main branch will automatically redeploy

### 🛠️ Troubleshooting

#### Common Issues:

1. **404 Error on Refresh**
   - Ensure `404.html` is in the `public` folder
   - Check that router basename is set correctly

2. **Assets Not Loading**
   - Verify base path in `vite.config.js` matches repository name
   - Check that all asset URLs use relative paths

3. **Deployment Fails**
   - Ensure repository is public
   - Check GitHub Actions tab for error details
   - Verify all dependencies are in package.json

#### Manual Fix for Asset Issues:
If assets don't load properly, update `vite.config.js`:
```javascript
base: '/YOUR_REPOSITORY_NAME/',
```

### 🔄 Updating Your Site

To update your deployed site:

1. Make changes to your code
2. Commit and push to main branch:
```bash
git add .
git commit -m "Update website content"
git push
```

3. GitHub Actions will automatically rebuild and deploy

### 🚀 Going Live

Once deployed successfully:

1. **Test all pages** to ensure they work correctly
2. **Share your URL** with others
3. **Custom Domain** (optional): You can add a custom domain in GitHub Pages settings

---

**Your Gujarat Estate Agency website will be live at:**
`https://YOUR_USERNAME.github.io/realestate/`

Happy deploying! 🎉