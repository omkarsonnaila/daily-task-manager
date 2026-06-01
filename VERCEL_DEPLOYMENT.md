# Plano - Vercel Deployment Guide

## Overview
This is a TanStack Start + React + Vite application connected to Supabase for data storage and authentication.

## Pre-Deployment Checklist

✅ **Project Structure**
- Main code in `dev-server/` folder
- Build: `npm run build` (runs `vite build`)
- Output: `dev-server/dist/`

✅ **Framework**
- TanStack Start (meta-framework for React)
- React 19
- Vite 7
- TypeScript

✅ **Database**
- Supabase (PostgreSQL)
- Real-time sync for tasks and profiles

## Step-by-Step Deployment to Vercel

### 1. **Verify Project is Ready**
Your project is ready for deployment! The following have been added to the repo:
- `vercel.json` - Vercel configuration specifying build settings
- Environment variables reference for Supabase

### 2. **Identify Framework**
- **Framework**: TanStack Start (React meta-framework)
- **Build Tool**: Vite
- **Runtime**: Node.js (for Vercel deployment)

### 3. **Environment Variables Required**

You need to set these in Vercel:

| Variable | Description | From |
|----------|-------------|------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase dashboard → Project → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key for client-side | Same location |
| `SUPABASE_URL` | Supabase project URL (server-side) | Same as above |
| `SUPABASE_PUBLISHABLE_KEY` | Public key (server-side) | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key (keep private!) | Supabase dashboard → Project → Settings → API (under "Service role key") |

### 4. **Connect GitHub Repository to Vercel**

**Option A: Through Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com/)
2. Sign in or create account
3. Click "Add New..." → "Project"
4. Click "Import Git Repository"
5. Paste your GitHub repo URL: `https://github.com/omkarsonnaila/daily-task-manager`
6. Click "Import"
7. Vercel will auto-detect your project settings

**Option B: Through GitHub Integration**

1. Go to Vercel and connect your GitHub account
2. Authorize Vercel to access your repositories
3. Select `daily-task-manager` repo
4. Click "Import"

### 5. **Configure Build & Output Settings**

Vercel should auto-detect these from `vercel.json`:

- **Build Command**: `cd dev-server && npm install && npm run build`
- **Output Directory**: `dev-server/dist`
- **Install Command**: `npm install`
- **Framework**: Vite

If Vercel doesn't auto-detect, manually set:
1. In project settings → "Build & Development Settings"
2. Enable "Override" for each field
3. Enter the values above

### 6. **Set Environment Variables in Vercel**

1. In Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add each variable:
   - `VITE_SUPABASE_URL` = `https://YOUR-PROJECT.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `eyJ...` (your public key)
   - `SUPABASE_URL` = `https://YOUR-PROJECT.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = `eyJ...` (your public key)
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJ...` (your service key - **keep this private!**)

3. For each variable, select environment: **Production, Preview, Development**
4. Click "Save"

### 7. **Deploy**

Once environment variables are set:
1. Go to **Deployments** tab
2. Click "Deploy" or "Redeploy Latest" 
3. Vercel will build from `dev-server` folder
4. Wait for build to complete (usually 2-5 minutes)

### 8. **Get Your Live URL**

After successful deployment:
- Your app will be live at: `https://YOUR-PROJECT.vercel.app`
- Vercel auto-generates a domain OR you can connect a custom domain
- View your live deployment by clicking the link in the Deployments tab

## Troubleshooting Deployment Errors

### **Build Error: "Cannot find module"**
- Ensure all dependencies in `dev-server/package.json` are correct
- Clear Vercel cache: Settings → Git → Redeploy (skip cache)

### **Supabase Connection Error**
- Verify environment variables are set correctly
- Check variable names match exactly (case-sensitive)
- Ensure Supabase service role key is in `SUPABASE_SERVICE_ROLE_KEY`

### **Auth/Login Not Working**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct
- Check Supabase project is running (not paused)
- In Supabase dashboard → Authentication → Providers, ensure "Email" is enabled

### **Tasks Not Saving**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase database migrations ran successfully
- In Supabase dashboard → SQL Editor, verify `tasks` and `profiles` tables exist

### **Build Times Out**
- Ensure `dev-server/node_modules` is in `.gitignore`
- Large builds might timeout; contact Vercel support for enterprise limits

## Post-Deployment Checklist

- [ ] Live URL is accessible
- [ ] Sign up works (creates account in Supabase)
- [ ] Login works
- [ ] Can create a task
- [ ] Task appears in dashboard
- [ ] Custom domain configured (optional)
- [ ] CI/CD enabled for auto-deploy on git push

## Environment Files

Your Supabase credentials are already in `.env` file (local):
```
SUPABASE_URL="https://dpnbiqwurmtuojfjcliv.supabase.co"
VITE_SUPABASE_URL="https://dpnbiqwurmtuojfjcliv.supabase.co"
SUPABASE_PUBLISHABLE_KEY="eyJ..."
VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."
```

**DO NOT commit `.env` to GitHub!** (Use `.gitignore`)  
**Set all variables in Vercel dashboard instead.**

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)

---

## Quick Deploy Command

If you have Vercel CLI installed:
```bash
cd daily-task-manager
vercel
```

This will guide you through deployment interactively.

---

**Questions?** Check the troubleshooting section above or contact Vercel support.
