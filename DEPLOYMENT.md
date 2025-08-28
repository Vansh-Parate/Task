# Vercel Deployment Guide

## ✅ **Project is now Vercel-ready!**

Your project has been converted to work with Vercel's serverless architecture.

## 📋 **What was changed:**

### **1. Serverless Functions Created:**
- `api/terms.js` - Handles terms API requests
- `api/health.js` - Health check endpoint

### **2. Vercel Configuration:**
- `vercel.json` - Deployment configuration
- Updated `vite.config.js` - Build optimization

### **3. Architecture Changes:**
- Converted from persistent Fastify server to serverless functions
- Optimized database connections for serverless environment
- Added proper CORS handling

## 🚀 **Deployment Steps:**

### **1. Database Setup (Required)**
You need a PostgreSQL database. Options:
- **Supabase** (Recommended - free tier available)
- **Neon** (Serverless PostgreSQL)
- **Railway** (Easy setup)
- **Any PostgreSQL provider**

### **2. Environment Variables**
Set these in Vercel dashboard:
```bash
DATABASE_URL=postgres://username:password@host:port/database
NODE_ENV=production
```

### **3. Deploy to Vercel**

#### **Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **Option B: GitHub Integration**
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Vercel will auto-deploy

#### **Option C: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables
5. Deploy

## 🔧 **Pre-deployment Checklist:**

- [ ] **Database**: PostgreSQL instance running
- [ ] **Environment Variables**: `DATABASE_URL` set in Vercel
- [ ] **Seed Data**: Run `npm run seed` locally first to test
- [ ] **Build Test**: Run `npm run build` locally
- [ ] **API Test**: Test `/api/terms` and `/api/health` endpoints

## 🧪 **Testing Locally:**

```bash
# Test build
npm run build

# Test serverless functions (if you have Vercel CLI)
vercel dev
```

## 📊 **Performance Optimizations:**

### **Database:**
- Connection pooling optimized for serverless
- Reduced max connections to 1 per function
- Automatic connection cleanup

### **Caching:**
- Removed in-memory cache (not suitable for serverless)
- Database queries are optimized

### **Build:**
- Disabled source maps for production
- Optimized bundle size

## 🚨 **Important Notes:**

### **Serverless Limitations:**
- **Cold starts**: First request may be slower
- **Connection limits**: Database connections are limited
- **Timeout**: Functions timeout after 30 seconds
- **Memory**: Limited to 1024MB per function

### **Database Requirements:**
- Must support SSL connections
- Should be in same region as Vercel deployment
- Connection pooling recommended

## 🔍 **Monitoring:**

After deployment, monitor:
- Function execution times
- Database connection errors
- Cold start frequency
- Memory usage

## 🛠 **Troubleshooting:**

### **Common Issues:**

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify SSL settings
   - Test connection locally

2. **Function Timeout**
   - Check database query performance
   - Consider adding indexes
   - Optimize queries

3. **Build Failures**
   - Check for missing dependencies
   - Verify Node.js version compatibility
   - Review build logs

## 📞 **Support:**

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connectivity
4. Review serverless function code

---

**Your app is now ready for Vercel deployment! 🎉**
