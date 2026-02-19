# 🗄️ Database Storage Setup - IBMP Website

## Current Status

Your website has **TWO storage systems** running in parallel:

### 1. ❌ JSON Files (Current - Temporary)
- **Location:** `/data/applications/` and `/data/invoices/`
- **API Routes:** `/api/admission/submit`, `/api/admin/applications`, `/api/admin/invoices`
- **Status:** Working but **NOT suitable for production**

### 2. ✅ PostgreSQL Database (New - Production Ready)
- **Technology:** Prisma ORM + PostgreSQL
- **API Routes (New):**
  - `/api/admission/submit-db` - Submit applications
  - `/api/admin/applications-db` - Get all applications
  - `/api/admin/applications-db/[id]` - Get/update single application
  - `/api/admin/invoices-db` - Get all invoices / Create invoice
  - `/api/admin/invoices-db/[id]` - Get single invoice
- **Status:** Code ready, **needs database connection**

---

## 🚀 SETUP STEPS (Choose One Database Provider)

### Option 1: Supabase (FREE - Recommended)

**Why Supabase?**
- ✅ Free tier: 500MB database
- ✅ Easy setup
- ✅ Automatic backups
- ✅ Built-in admin panel

**Setup Steps:**

1. **Create Database** (5 minutes)
   ```
   1. Go to https://supabase.com
   2. Sign up with GitHub/Google
   3. Create New Project
   4. Name: "ibmp-website"
   5. Password: [create strong password]
   6. Region: Choose nearest
   7. Click "Create new project"
   ```

2. **Get Connection String**
   ```
   1. Go to Settings → Database
   2. Find "Connection string" section
   3. Copy the "URI" format
   4. Should look like:
      postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

3. **Add to Your Project**
   ```bash
   cd /Users/rubeenakhan/Desktop/ibmp-website
   ```
   
   Open `.env` file and replace with:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

4. **Create Database Tables**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Migrate Existing Data** (Optional - if you have applications in JSON)
   ```bash
   npm run migrate-data
   ```

6. **Done!** Test it:
   ```bash
   npx prisma studio
   ```
   This opens a visual database browser at http://localhost:5555

---

### Option 2: Vercel Postgres (For Vercel Users)

**Best if deploying to Vercel**

1. **In Vercel Dashboard**
   - Go to your project: https://vercel.com/dmhcait/ibmp
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Continue"

2. **Get Connection String**
   - Copy `POSTGRES_PRISMA_URL`

3. **Add Locally**
   Edit `.env`:
   ```env
   DATABASE_URL="[paste POSTGRES_PRISMA_URL]"
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   npm run migrate-data
   ```

5. **Add to Vercel**
   - Vercel Dashboard → Settings → Environment Variables
   - Add: `DATABASE_URL` = [same value]

---

### Option 3: Railway (Simple Alternative)

1. **Create Database**
   ```
   1. Go to https://railway.app
   2. Sign up (free $5/month credit)
   3. New Project → Database → PostgreSQL
   ```

2. **Get URL**
   - Click PostgreSQL service
   - "Connect" tab → Copy "Postgres Connection URL"

3. **Add to Project**
   ```env
   DATABASE_URL="[paste Railway URL]"
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   npm run migrate-data
   ```

---

## 📋 What Data Gets Stored?

### Applications (50+ Fields)
✅ Personal: Name, DOB, Gender, Nationality  
✅ Contact: Email, Phone, Addresses  
✅ Family: Father, Mother, Spouse details  
✅ Education: 10th, 12th, UG, PG (all details)  
✅ Course: Type, Name, Specialization  
✅ Documents: Photos, Certificates (file paths)  
✅ Payment: Method, Transaction ID  
✅ Status: Pending/Approved/Rejected  

### Invoices
✅ Invoice Number  
✅ Student Details  
✅ Fee Breakdown (Admission, Tuition, Registration, Other)  
✅ Tax & Discount  
✅ Total Amount  
✅ Payment Status  
✅ Transaction Details  

---

## 🔄 Switching from JSON to Database

Once database is set up, update your API endpoints:

### In Frontend Files:

1. **Admission Form** ([app/admission/page.tsx](app/admission/page.tsx))
   ```typescript
   // Change line ~600:
   const response = await fetch('/api/admission/submit-db', {  // Add -db
   ```

2. **Admin Applications** ([app/admin/applications/page.tsx](app/admin/applications/page.tsx))
   ```typescript
   // Change line ~30:
   const response = await fetch('/api/admin/applications-db');  // Add -db
   ```

3. **Admin Invoices** ([app/admin/invoices/page.tsx](app/admin/invoices/page.tsx))
   ```typescript
   // Change API calls:
   fetch('/api/admin/invoices-db')  // Add -db
   ```

---

## 🧪 Testing Your Database

After setup, verify everything works:

### 1. Check Connection
```bash
npx prisma db push
```
Should show: ✅ "Your database is now in sync"

### 2. View Data in Browser
```bash
npx prisma studio
```
Opens admin panel at http://localhost:5555

### 3. Submit Test Application
1. Go to admission form
2. Fill and submit
3. Check Prisma Studio - should see new record

### 4. Check Admin Panel
- Should load all applications from database

---

## 🔒 Security Checklist

- [x] `.env` is in `.gitignore` (already done)
- [ ] DATABASE_URL added to Vercel environment variables
- [ ] Database password is strong (12+ characters)
- [ ] Database has SSL enabled (auto on Supabase/Vercel)
- [ ] Backup strategy in place (auto on Supabase)

---

## 📚 Helpful Commands

```bash
# Create database tables
npx prisma migrate dev --name init

# View database in browser
npx prisma studio

# Migrate JSON data to database
npm run migrate-data

# Update Prisma client after schema changes
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## 🆘 Troubleshooting

### "Environment variable not found: DATABASE_URL"
**Fix:** Add DATABASE_URL to `.env` file

### "Can't reach database server"
**Fix:** 
1. Check internet connection
2. Verify DATABASE_URL is correct
3. Check database is running (Supabase dashboard)

### "Migration failed"
**Fix:**
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### "P2002: Unique constraint failed"
**Fix:** Application number already exists. Data migration handles this automatically.

---

## 📞 Next Steps

1. ✅ Choose database provider (Supabase recommended)
2. ✅ Get DATABASE_URL
3. ✅ Add to `.env` file
4. ✅ Run `npx prisma migrate dev --name init`
5. ✅ Run `npm run migrate-data` (if you have existing data)
6. ✅ Update API endpoints in frontend (add `-db` suffix)
7. ✅ Test submission
8. ✅ Push to GitHub
9. ✅ Add DATABASE_URL to Vercel environment variables
10. ✅ Deploy!

---

**Recommended:** Use **Supabase** for free, easy setup with 500MB storage.

Need help? Check [SETUP_DATABASE.md](SETUP_DATABASE.md) for detailed guides.
