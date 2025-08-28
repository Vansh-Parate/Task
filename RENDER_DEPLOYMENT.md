# Render Deployment Guide (Sequelize Compatible)

## 🚀 **Deploying Your Fastify + Sequelize Server to Render**

Render is excellent for your setup because it supports:
- ✅ Full Node.js runtime
- ✅ Sequelize ORM
- ✅ PostgreSQL databases
- ✅ Environment variables
- ✅ Automatic deployments from GitHub
- ✅ Free tier available

## 📋 **Prerequisites:**

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Your code should be on GitHub
3. **PostgreSQL Database** - Render provides this

## 🔧 **Setup Steps:**

### **1. Create PostgreSQL Database**

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "PostgreSQL"
3. Choose a name (e.g., "terms-db")
4. Select your region
5. Choose "Free" plan for development
6. Click "Create Database"

### **2. Create Web Service**

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Choose your repository
4. Configure the service:

**Basic Settings:**
- **Name**: `terms-backend`
- **Environment**: `Node`
- **Region**: Same as your database
- **Branch**: `main` (or your default branch)

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (for development)

### **3. Set Environment Variables**

In your web service settings, add these environment variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your-postgres-connection-string-from-render
```

**To get your DATABASE_URL:**
1. Go to your PostgreSQL database in Render
2. Click "Connect"
3. Copy the "External Database URL"

### **4. Deploy**

1. Click "Create Web Service"
2. Render will automatically deploy your app
3. Wait for the build to complete

## 🗂️ **Project Structure for Render:**

Render will automatically detect your Node.js project and use the `start` script:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "dev": "concurrently \"npm:dev:server\" \"npm:dev:client\"",
    "seed": "node seed.js"
  }
}
```

## 🔍 **Render Configuration:**

### **render.yaml (optional)**
```yaml
services:
  - type: web
    name: terms-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

databases:
  - name: terms-db
    databaseName: terms
    user: terms_user
```

## 🚀 **Deployment Commands:**

### **Manual Deploy:**
- Render automatically deploys when you push to GitHub
- Or click "Manual Deploy" in the dashboard

### **View Logs:**
- Go to your web service in Render dashboard
- Click "Logs" tab

### **Run Seed Command:**
1. Go to your web service
2. Click "Shell" tab
3. Run: `npm run seed`

## 📊 **Environment Variables:**

Render will automatically provide:
- `DATABASE_URL` - Your PostgreSQL connection string
- `PORT` - Port for your application (usually 10000)
- `NODE_ENV` - Set to "production"

## 🔍 **Testing Your Deployment:**

### **Health Check:**
```bash
curl https://your-app-name.onrender.com/api/health
```

### **Terms API:**
```bash
curl https://your-app-name.onrender.com/api/terms?lang=sv
curl https://your-app-name.onrender.com/api/terms?lang=en
```

## 🛠️ **Frontend Configuration:**

After deploying the backend, update your frontend to use the Render URL:

### **Development (local):**
```javascript
// Keep using localhost for development
const API_URL = 'http://localhost:5174'
```

### **Production:**
```javascript
// Use Render URL
const API_URL = 'https://your-app-name.onrender.com'
```

## 📋 **Deployment Checklist:**

- [ ] **Render account created**
- [ ] **GitHub repository connected**
- [ ] **PostgreSQL database created**
- [ ] **Web service configured**
- [ ] **Environment variables set**
- [ ] **Backend deployed successfully**
- [ ] **Seed data run** (via Shell: `npm run seed`)
- [ ] **API endpoints tested**
- [ ] **Frontend configured for production URL**

## 🚨 **Important Notes:**

### **Render Benefits:**
- **Full Node.js Support**: No compatibility issues
- **Sequelize Ready**: Works perfectly with ORMs
- **Auto-scaling**: Can upgrade to paid plans
- **SSL Included**: HTTPS by default
- **Custom Domains**: Add your own domain
- **Free Tier**: Great for development

### **Database Considerations:**
- **Connection Pooling**: Render handles this
- **SSL Required**: Automatically configured
- **Backups**: Available on paid plans
- **Scaling**: Can upgrade database plan

### **Free Tier Limitations:**
- **Sleep after inactivity**: Free services sleep after 15 minutes
- **Cold starts**: First request after sleep may be slow
- **Bandwidth limits**: Check Render's free tier limits

## 🔧 **Troubleshooting:**

### **Common Issues:**

1. **Database Connection Failed**
   - Check your `DATABASE_URL` in environment variables
   - Ensure database is in same region as web service

2. **Sequelize Sync Issues**
   ```bash
   # Run in Render Shell
   npm run seed
   ```

3. **Port Issues**
   - Render uses port 10000 by default
   - Make sure your server uses `process.env.PORT`

4. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`

## 📞 **Monitoring:**

### **Render Dashboard:**
- Go to [render.com](https://render.com)
- Check your service metrics
- View logs and deployments

### **Logs:**
- Click "Logs" tab in your web service
- Real-time log streaming
- Build and runtime logs

## 🎯 **Next Steps:**

1. **Deploy backend** to Render
2. **Test API endpoints** thoroughly
3. **Deploy frontend** to Vercel/Netlify
4. **Update frontend** to use Render API URL
5. **Monitor** performance and logs

## 💰 **Pricing:**

### **Free Tier:**
- **Web Services**: 1 free service
- **Databases**: 1 free PostgreSQL database
- **Bandwidth**: 750 hours/month
- **Sleep**: After 15 minutes of inactivity

### **Paid Plans:**
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: Custom pricing

---

**Your Fastify + Sequelize server is ready for Render deployment! 🎉**
