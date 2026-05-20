# GitHub Actions Deployment Troubleshooting

## 🔍 Common Issues and Solutions

### 1. **Pages Not Enabled Error**
**Error:** `Pages is not enabled for this repository`

**Solution:**
1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Under **Source**, select **"GitHub Actions"** (not "Deploy from a branch")
4. Save the settings

### 2. **Permission Denied Error**
**Error:** `Permission denied` or `GITHUB_TOKEN doesn't have sufficient permissions`

**Solution:**
1. Go to repository **Settings**
2. Click **Actions** → **General**
3. Scroll to **Workflow permissions**
4. Select **"Read and write permissions"**
5. Check **"Allow GitHub Actions to create and approve pull requests"**
6. Click **Save**

### 3. **Repository Not Public Error**
**Error:** `GitHub Pages is not available for private repositories`

**Solution:**
- Make your repository public, or
- Upgrade to GitHub Pro for private repository Pages

### 4. **Branch Name Mismatch**
**Error:** Workflow doesn't trigger

**Solution:**
Check your default branch name:
```bash
git branch
```
If it's `master` instead of `main`, update the workflow or rename branch:
```bash
git branch -m master main
git push -u origin main
```

### 5. **File Path Issues**
**Error:** `404 - File not found`

**Solution:**
Ensure `index.html` is in the repository root (not in a subfolder).

## 🛠️ Step-by-Step Fix Process

### Step 1: Check Repository Settings
1. **Repository → Settings → Pages**
   - Source: "GitHub Actions" ✅
   - Custom domain: Leave empty ✅

2. **Repository → Settings → Actions → General**
   - Workflow permissions: "Read and write permissions" ✅
   - Allow GitHub Actions to create PRs: Checked ✅

### Step 2: Verify File Structure
Your repository root should have:
```
├── index.html          ✅
├── styles.css          ✅
├── script.js           ✅
├── manifest.json       ✅
├── sw.js              ✅
├── .github/
│   └── workflows/
│       ├── deploy.yml  ✅
│       └── pages-simple.yml ✅
└── README.md          ✅
```

### Step 3: Try Different Workflows

**Option A: Use the simplified workflow**
1. Disable `deploy.yml` by renaming it to `deploy.yml.disabled`
2. Keep `pages-simple.yml` active
3. Push changes

**Option B: Manual trigger**
1. Go to **Actions** tab
2. Select any workflow
3. Click **"Run workflow"**
4. Select branch and run

### Step 4: Check Action Logs
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Click on the job name
4. Expand each step to see error details

## 🚨 Emergency Solutions

### Solution 1: Delete and Recreate Workflows
```bash
# Remove all workflows
rm -rf .github/workflows/*

# Create minimal workflow
mkdir -p .github/workflows
```

Then create this minimal file:

```yaml
# .github/workflows/pages.yml
name: Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
```

### Solution 2: Use Classic GitHub Pages
1. **Settings → Pages**
2. Source: **"Deploy from a branch"**
3. Branch: **main** / **root**
4. Save

This bypasses GitHub Actions entirely.

### Solution 3: Check Repository Visibility
```bash
# Make repository public if it's private
# Go to Settings → General → Danger Zone → Change visibility
```

## 📋 Verification Checklist

Before pushing changes, verify:

- [ ] Repository is public
- [ ] Pages source is set to "GitHub Actions"
- [ ] Workflow permissions are "Read and write"
- [ ] `index.html` exists in repository root
- [ ] Branch name matches workflow (main/master)
- [ ] No syntax errors in YAML files

## 🔄 Quick Fix Commands

```bash
# Check current branch
git branch

# Rename branch if needed
git branch -m master main

# Force push to trigger workflow
git add .
git commit -m "Fix deployment"
git push origin main --force

# Check workflow status
# Go to GitHub → Actions tab
```

## 📞 Still Having Issues?

If none of these solutions work:

1. **Share the exact error message** from the Actions tab
2. **Check the workflow logs** for specific error details
3. **Try the emergency solutions** above
4. **Consider using classic Pages deployment** as a fallback

The most common issue is usually permissions or Pages not being enabled correctly in repository settings.