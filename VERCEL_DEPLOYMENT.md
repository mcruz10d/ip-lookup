# 🚀 Deploy IP Lookup Website to Vercel

This guide will help you deploy your IP lookup website to Vercel for free hosting.

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub ✅
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## 🛠️ Files Added for Vercel

The following files have been created for Vercel deployment:

### `vercel.json` - Vercel Configuration
- Routes API calls to serverless functions
- Serves static files from the `public` directory
- Configures build settings

### API Serverless Functions
- `api/ip-info.js` - Get current IP and location
- `api/lookup/[ip].js` - Lookup specific IP address
- `api/health.js` - Health check endpoint

### `index.html` - Main Page
- Root-level HTML file for Vercel to serve
- References CSS and JS files in `public/` directory

## 🚀 Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Your Repository**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your `ip-lookup` repository

3. **Configure Project**
   - **Project Name**: `ip-lookup` (or any name you prefer)
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: Leave empty or use `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Your Project Directory**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? `N`
   - Project name: `ip-lookup`
   - Directory: `./`
   - Settings correct? `Y`

## 🌐 After Deployment

### Your Website URLs

Once deployed, you'll get URLs like:
- **Main Website**: `https://your-project-name.vercel.app`
- **API Endpoints**:
  - `https://your-project-name.vercel.app/api/ip-info`
  - `https://your-project-name.vercel.app/api/lookup/8.8.8.8`
  - `https://your-project-name.vercel.app/api/health`

### Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔧 Environment Variables (If Needed)

If you need to add environment variables:

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Environment Variables"
3. Add variables like:
   - `NODE_ENV=production`
   - Any API keys you might use

## 📱 Testing Your Deployment

1. **Visit your Vercel URL**
2. **Test the functionality:**
   - Click "Detect IP" - should show your location
   - Try looking up an IP like `8.8.8.8`
   - Check that the API endpoints work

3. **Check API endpoints directly:**
   ```bash
   curl https://your-app.vercel.app/api/health
   curl https://your-app.vercel.app/api/ip-info
   ```

## 🔄 Automatic Deployments

**Good news!** Vercel automatically deploys when you push to GitHub:

1. **Make changes** to your code locally
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```
3. **Vercel automatically redeploys** your site!

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

2. **API Not Working**
   - Check function logs in Vercel dashboard
   - Verify `vercel.json` routes are correct

3. **Static Files Not Loading**
   - Ensure files are in `public/` directory
   - Check file paths in HTML

4. **CORS Issues**
   - API functions already include CORS headers
   - Check browser console for errors

### Getting Help:

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create an issue in your repository
- **Vercel Support**: Available in Vercel dashboard

## 🎉 Success!

Once deployed, your IP lookup website will be:
- ✅ **Live on the internet**
- ✅ **Automatically updated** when you push to GitHub
- ✅ **Fast and reliable** with Vercel's global CDN
- ✅ **Free to host** on Vercel's hobby plan

Your modern minimalist IP lookup tool is now available to the world! 🌍
