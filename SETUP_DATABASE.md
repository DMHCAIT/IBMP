# Database Setup Instructions

Your website currently stores data in JSON files, but for production, you need a **PostgreSQL database**. Here's how to set it up:

## Quick Setup Options

### Option 1: Supabase (Recommended for Free Tier)

1. **Create Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free account

2. **Create Project**
   - Click "New Project"
   - Choose organization
   - Enter project name: `ibmp-website`
   - Database password: (choose strong password)
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Get Database URL**
   - Go to Settings → Database
   - Copy the connection string under "Connection string" → "URI"
   - Should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

4. **Add to Your Project**
   ```bash
   cd /Users/rubeenakhan/Desktop/ibmp-website
   ```
   
   Edit `.env` file and add:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

5. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Migrate Existing Data** (if you have existing applications)
   ```bash
   npm run migrate-data
   ```

7. **Update API Route**
   - In `app/admission/page.tsx`, change the API endpoint from `/api/admission/submit` to `/api/admission/submit-db`

---

### Option 2: Vercel Postgres (Best for Vercel Deployment)

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Continue"

2. **Get Connection String**
   - Copy the `POSTGRES_PRISMA_URL` value

3. **Add to Project**
   Edit `.env`:
   ```
   DATABASE_URL="[POSTGRES_PRISMA_URL from Vercel]"
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   npm run migrate-data
   ```

5. **Add to Vercel**
   - In Vercel project settings → Environment Variables
   - Add `DATABASE_URL` with the same value

---

### Option 3: Railway (Simple Alternative)

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up (free $5 credit monthly)

2. **Create Database**
   - New Project → Database → PostgreSQL
   - Wait for deployment

3. **Get Connection URL**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

4. **Add to Project**
   Edit `.env`:
   ```
   DATABASE_URL="[connection URL from Railway]"
   ```

5. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   npm run migrate-data
   ```

---

## Testing Your Database

After setup, test if it works:

```bash
# Check database connection
npx prisma db push

# View data in browser
npx prisma studio
```

## What Gets Stored in Database

✅ All admission applications (50+ fields including):
   - Personal details (name, DOB, gender, etc.)
   - Contact information
   - Family details
   - Education history (10th, 12th, UG, PG)
   - Course selections
   - Documents (file paths)
   - Payment details

✅ All invoices:
   - Invoice numbers
   - Student details
   - Fee breakdown
   - Payment status

## Security Notes

⚠️ **NEVER commit `.env` file to GitHub** (already in .gitignore)
⚠️ **Use environment variables in Vercel** for production
⚠️ **Keep database credentials secure**

## Need Help?

If you encounter any issues:
1. Check DATABASE_URL format is correct
2. Ensure database is running and accessible
3. Check firewall/network settings
4. Run `npx prisma validate` to check schema

---

**Recommended:** Start with **Supabase** (free, easy setup, 500MB storage)
