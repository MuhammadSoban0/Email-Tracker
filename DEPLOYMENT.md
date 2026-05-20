# GitHub Pages Deployment Guide

This guide will help you deploy your Email Tracker Dashboard to GitHub Pages using GitHub Actions.

## 🚀 Quick Setup

### 1. Repository Setup
Make sure your repository is public and contains all the project files.

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**

### 3. Push Your Code
The GitHub Actions workflow will automatically trigger when you push to the main/master branch:

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

### 4. Monitor Deployment
1. Go to the **Actions** tab in your repository
2. Watch the deployment workflow run
3. Once complete, your site will be available at:
   `https://[your-username].github.io/[repository-name]/`

## 📁 Workflow Files

Two workflow files have been created:

### `.github/workflows/deploy.yml`
- Full deployment workflow with build and deploy steps
- Recommended for most use cases

### `.github/workflows/static.yml`
- Simplified static site deployment
- Faster deployment for simple static sites

## 🔧 Configuration

### Automatic Deployment
- Deploys automatically on push to `main` or `master` branch
- Can also be triggered manually from Actions tab

### Manual Deployment
1. Go to **Actions** tab
2. Select the deployment workflow
3. Click **Run workflow**
4. Choose the branch and click **Run workflow**

## 🌐 Access Your Site

After successful deployment, your Email Tracker Dashboard will be available at:
```
https://[your-username].github.io/[repository-name]/
```

Example: `https://johndoe.github.io/email-tracker-dashboard/`

## ✅ Features Available on GitHub Pages

- ✅ Fully responsive design
- ✅ Offline functionality with Service Worker
- ✅ Local storage for data persistence
- ✅ PWA capabilities (installable on mobile)
- ✅ All email tracking features
- ✅ Company management
- ✅ Real-time status updates

## 🔍 Troubleshooting

### Deployment Failed
1. Check the Actions tab for error details
2. Ensure repository is public
3. Verify GitHub Pages is enabled in Settings

### Site Not Loading
1. Wait 5-10 minutes after deployment
2. Check the correct URL format
3. Clear browser cache
4. Verify all files are in the repository root

### Service Worker Issues
- Service Worker paths are configured for GitHub Pages
- Uses relative paths (`./`) instead of absolute paths (`/`)

## 📱 Mobile Installation

Once deployed, users can install the app on their mobile devices:

1. **Android (Chrome):**
   - Visit the site
   - Tap the "Add to Home Screen" prompt
   - Or use Chrome menu → "Add to Home Screen"

2. **iOS (Safari):**
   - Visit the site
   - Tap the Share button
   - Select "Add to Home Screen"

## 🔄 Updates

To update your deployed site:
1. Make changes to your local files
2. Commit and push to the main branch
3. GitHub Actions will automatically redeploy

## 📊 Analytics (Optional)

To add Google Analytics or other tracking:
1. Add tracking code to `index.html`
2. Commit and push changes
3. Analytics will be active after next deployment

## 🛡️ Security

- All data is stored locally in browser
- No server-side data transmission
- HTTPS enabled by default on GitHub Pages
- Service Worker provides secure offline functionality

Your Email Tracker Dashboard is now ready for production use! 🎉