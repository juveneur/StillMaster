# Railway Deployment Guide - StillMaster

This guide will walk you through deploying the StillMaster application to Railway.app.

## Prerequisites

1. **GitHub Account** with your code pushed to a repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app) (free to start)
3. **Credit Card** (required for Railway, but you get $5/month free credit)

---

## Architecture Overview

StillMaster will be deployed as **2 separate services** on Railway:

1. **Backend Service**: ASP.NET Core 10 API (C#)
2. **Frontend Service**: React + TypeScript (served via nginx)

Both services are containerized using Docker and will auto-deploy on every git push.

---

## Step 1: Push Your Code to GitHub

```bash
cd /Users/tijones/Documents/StillMaster

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for Railway deployment"

# Create GitHub repository (using GitHub CLI)
gh repo create StillMaster --public --source=. --remote=origin --push

# Or push to existing repo
git remote add origin https://github.com/YOUR_USERNAME/StillMaster.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your GitHub account

---

## Step 3: Deploy Backend Service

### 3.1 Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **StillMaster** repository
4. Click **"Deploy Now"**

### 3.2 Configure Backend Service

Railway will detect your project. You need to configure it to deploy the backend:

1. In the deployment, click **"Settings"**
2. Under **"Build"**, set:
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile`
3. Under **"Deploy"**, the service will auto-detect port 8080

### 3.3 Set Environment Variables

Click **"Variables"** tab and add:

```bash
# Required
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080

# JWT Configuration (use strong secrets in production!)
Jwt__Key=YourSuperSecretKeyThatIsAtLeast32CharactersLongForHS256Algorithm
Jwt__Issuer=StillMasterAPI
Jwt__Audience=StillMasterClient

# Frontend URL (we'll add this after deploying frontend)
FRONTEND_URL=https://your-frontend-url.railway.app
```

### 3.4 Get Backend URL

1. Go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"**
3. Railway will create a URL like: `https://stillmaster-backend-production.up.railway.app`
4. **Copy this URL** - you'll need it for the frontend

---

## Step 4: Deploy Frontend Service

### 4.1 Add New Service to Project

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose the **same StillMaster repository**
4. Click **"Deploy"**

### 4.2 Configure Frontend Service

1. Click **"Settings"** on the new service
2. Under **"Build"**, set:
   - **Root Directory**: `frontend`
   - **Dockerfile Path**: `Dockerfile`
3. Under **"Deploy"**, service will detect port 80

### 4.3 Set Frontend Environment Variables

Click **"Variables"** tab and add:

```bash
# Backend API URL (use the URL from Step 3.4)
VITE_API_URL=https://stillmaster-backend-production.up.railway.app/api
```

**Important**: Replace the URL with your actual backend URL from Step 3.4

### 4.4 Get Frontend URL

1. Go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"**
3. Railway will create: `https://stillmaster-frontend-production.up.railway.app`
4. **This is your app URL!**

---

## Step 5: Update Backend CORS Configuration

Now that you have the frontend URL, update the backend:

1. Go to **Backend Service** in Railway
2. Click **"Variables"**
3. Update/Add `FRONTEND_URL` with your frontend URL:
   ```bash
   FRONTEND_URL=https://stillmaster-frontend-production.up.railway.app
   ```
4. Railway will automatically redeploy

---

## Step 6: Test Your Deployment

1. Open your frontend URL: `https://stillmaster-frontend-production.up.railway.app`
2. You should see the login page
3. Login with default credentials:
   - **Email**: `admin@stillmaster.com`
   - **Password**: `Admin123!`

---

## Step 7: Automatic Deployments

Railway is now configured for automatic deployments!

**Every time you push to GitHub:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway will:
1. ✅ Detect the push via webhook
2. ✅ Build new Docker images for both services
3. ✅ Deploy updated containers
4. ✅ Zero-downtime deployment
5. ✅ Takes ~2-5 minutes

**Monitor deployments:**
- Railway dashboard shows real-time build logs
- Click on any service to see deployment progress
- View logs under "Deployments" tab

---

## Railway Project Structure

Your Railway project will look like this:

```
StillMaster Project
├── Backend Service
│   ├── Dockerfile: backend/Dockerfile
│   ├── Root: backend/
│   ├── Port: 8080
│   └── URL: https://stillmaster-backend-production.up.railway.app
│
└── Frontend Service
    ├── Dockerfile: frontend/Dockerfile
    ├── Root: frontend/
    ├── Port: 80
    └── URL: https://stillmaster-frontend-production.up.railway.app
```

---

## Adding a Database (Optional)

Currently using in-memory database. To add PostgreSQL:

### Option 1: Railway PostgreSQL (Recommended)

1. In your project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway provisions and injects connection string automatically
4. Update backend code to use PostgreSQL:

```bash
# Railway auto-injects this variable
DATABASE_URL=postgresql://user:pass@postgres.railway.internal:5432/railway
```

Update `Program.cs`:
```csharp
// Replace UseInMemoryDatabase with:
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
```

Add NuGet package:
```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

### Option 2: External Free Database (Supabase)

1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to Railway backend variables:
   ```bash
   DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   ```

---

## Custom Domains (Optional)

To use your own domain (e.g., `mystillmaster.com`):

### Backend:
1. Go to Backend Service → Settings → Domains
2. Click **"Custom Domain"**
3. Enter: `api.mystillmaster.com`
4. Add CNAME record to your DNS:
   ```
   Type:  CNAME
   Name:  api
   Value: stillmaster-backend-production.up.railway.app
   ```

### Frontend:
1. Go to Frontend Service → Settings → Domains
2. Click **"Custom Domain"**
3. Enter: `mystillmaster.com` (or `www.mystillmaster.com`)
4. Add CNAME/A record to your DNS per Railway instructions

Railway automatically provisions SSL certificates (free).

---

## Environment Variables Reference

### Backend Service

| Variable | Example | Required |
|----------|---------|----------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Yes |
| `ASPNETCORE_URLS` | `http://0.0.0.0:8080` | Yes |
| `PORT` | `8080` (auto-set by Railway) | Auto |
| `Jwt__Key` | `your-secret-key-min-32-chars` | Yes |
| `Jwt__Issuer` | `StillMasterAPI` | Yes |
| `Jwt__Audience` | `StillMasterClient` | Yes |
| `FRONTEND_URL` | `https://yourapp.railway.app` | Yes |
| `DATABASE_URL` | `postgresql://...` | Optional |

### Frontend Service

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://api.railway.app/api` | Yes |

---

## Monitoring & Logs

### View Logs:
1. Click on any service
2. Go to **"Deployments"** tab
3. Click on latest deployment
4. See real-time logs

### Metrics:
1. Click **"Metrics"** tab
2. View CPU, Memory, Network usage
3. Monitor costs

---

## Troubleshooting

### Frontend can't connect to backend
- ✅ Check `VITE_API_URL` in frontend variables
- ✅ Check `FRONTEND_URL` in backend variables
- ✅ Ensure both services are deployed and running
- ✅ Check CORS configuration in backend

### Build fails
- ✅ Check build logs in Railway dashboard
- ✅ Ensure Dockerfile paths are correct
- ✅ Verify Root Directory settings

### Port issues
- ✅ Backend must expose port 8080
- ✅ Frontend nginx exposes port 80
- ✅ Railway auto-detects ports from Dockerfile EXPOSE

### Database connection issues
- ✅ Check `DATABASE_URL` environment variable
- ✅ Verify database service is running
- ✅ Check connection string format

---

## Cost Estimates

With Railway's **$5/month free credit**:

| Resource | Monthly Cost |
|----------|--------------|
| Backend Service (C# API) | ~$2-3 |
| Frontend Service (nginx) | ~$1-2 |
| PostgreSQL Database | ~$3-5 |
| **Total** | **~$6-10/month** |

Free tier covers most hobby usage. You'll get warnings before charges exceed free credit.

---

## Rollback a Deployment

If something breaks:

1. Go to **"Deployments"** tab
2. Find previous working deployment
3. Click **"..."** → **"Redeploy"**
4. Instant rollback!

---

## Branch Deployments (Advanced)

Deploy feature branches as preview environments:

1. Go to **Settings** → **"Deploy Triggers"**
2. Enable **"Deploy on PR"**
3. Railway creates temporary URLs for each PR
4. Example: `https://stillmaster-pr-123.railway.app`

---

## Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **Use Strong JWT Keys**: Generate with `openssl rand -base64 64`
3. **Monitor Costs**: Check Railway dashboard regularly
4. **Database Backups**: Railway auto-backs up databases daily
5. **Logs**: Check logs after each deployment
6. **Health Checks**: Railway pings `/health` endpoint (frontend has this)

---

## Next Steps

- [ ] Set up PostgreSQL database
- [ ] Configure custom domain
- [ ] Enable branch deployments
- [ ] Set up monitoring/alerts
- [ ] Add environment-specific configurations
- [ ] Configure database migrations on deploy

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **StillMaster Issues**: https://github.com/YOUR_USERNAME/StillMaster/issues

---

## Summary Commands

```bash
# Push changes to trigger deployment
git add .
git commit -m "Update feature"
git push origin main

# View Railway logs (using Railway CLI - optional)
railway logs

# Check deployment status
railway status
```

---

**Your StillMaster app is now live on Railway! 🚀**

Access it at: `https://your-frontend-url.railway.app`

Every `git push` automatically deploys your changes in ~2-5 minutes.

---

**Questions?** Check Railway docs or the troubleshooting section above.

