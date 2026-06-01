# Quick Deployment Checklist

## Files Created for Vercel Deployment ✅

- ✅ `vercel.json` - Vercel configuration (build settings, output directory, env vars)
- ✅ `.vercelignore` - Optimize build by excluding unnecessary files
- ✅ `.gitignore` - Protect sensitive `.env` files from being committed
- ✅ `VERCEL_DEPLOYMENT.md` - Complete deployment guide

## Next Steps (4 Easy Steps to Production)

### Step 1: Commit & Push These Changes to GitHub
```bash
git add vercel.json .vercelignore .gitignore VERCEL_DEPLOYMENT.md
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Verify Your Supabase Credentials
Get these from your Supabase dashboard (Project Settings → API):
- Project URL: `https://dpnbiqwurmtuojfjcliv.supabase.co`
- Anon Public Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Keep this private!)

### Step 3: Connect Your GitHub Repo to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/omkarsonnaila/daily-task-manager`
5. Click "Import"

### Step 4: Configure Environment Variables in Vercel
After importing, Vercel will show the configuration screen:

1. Under "Environment Variables", add:
   - `VITE_SUPABASE_URL` = `https://dpnbiqwurmtuojfjcliv.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = Your anon key
   - `SUPABASE_URL` = `https://dpnbiqwurmtuojfjcliv.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = Your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key

2. Set environment: **Production, Preview, Development**

3. Click "Deploy"

## Build Configuration (Auto-Detected)

| Setting | Value |
|---------|-------|
| Build Command | `cd dev-server && npm install && npm run build` |
| Output Directory | `dev-server/dist` |
| Install Command | `npm install` |
| Framework | Vite |

## What Happens After Deploy

✅ Vercel will:
1. Clone your GitHub repo
2. Navigate to `dev-server/` folder
3. Install npm dependencies
4. Run `npm run build` (Vite compilation)
5. Serve the built app from `dist/` folder
6. Give you a live URL like: `https://YOUR-PROJECT-NAME.vercel.app`

## Expected Live URL Format
- Default: `https://daily-task-manager.vercel.app`
- Custom domain: `https://yourdomain.com`

## Verify Deployment Works

Once live, test:
1. ✅ Visit your Vercel URL
2. ✅ Click "Get Started" → Register
3. ✅ Create an account (use strong password: `Pass!234Secure`)
4. ✅ Check email for verification link
5. ✅ Sign in
6. ✅ Create a task
7. ✅ Verify task is saved in Supabase

## If Deployment Fails

**Common issues:**
- Missing environment variables → Check Vercel dashboard
- Wrong Supabase keys → Verify in Supabase dashboard
- Build error → Check Vercel logs (Deployments → Failed → View Logs)
- Supabase connection error → Ensure service role key is set

See `VERCEL_DEPLOYMENT.md` for detailed troubleshooting.

## Questions?

- Refer to `VERCEL_DEPLOYMENT.md` for full documentation
- Check Vercel dashboard logs for specific errors
- Verify Supabase is running (not paused)

---

**You're ready to deploy!** 🚀
