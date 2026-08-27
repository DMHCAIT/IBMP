# IBMP Database Setup - Quick Start Guide

## ✅ What's Been Set Up

- ✅ Prisma ORM installed and configured
- ✅ Database schema created for Applications and Invoices
- ✅ Migration script to transfer existing JSON data
- ✅ Prisma client for database operations

## 🚀 Quick Start (Choose One Database Option)

### Option 1: Vercel Postgres (Best for Production)

1. **Create Database on Vercel:**
   - Visit https://vercel.com/dashboard
   - Select your IBMP project
   - Go to "Storage" → "Create Database" → "Postgres"
   - Copy the `DATABASE_URL`

2. **Update .env file:**
   ```bash
   # Open .env and replace DATABASE_URL with your Vercel Postgres URL
   DATABASE_URL="postgres://default:xxxxx@xxx-pooler.aws.neon.tech:5432/verceldb"
   ```

3. **Create Database Tables:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Migrate Existing Data:**
   ```bash
   npm run migrate-data
   ```

### Option 2: Supabase (Free Alternative)

1. **Create Project:**
   - Visit https://supabase.com
   - Create new project
   - Go to Settings → Database
   - Copy "Connection string (URI)"

2. **Update .env:**
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

3. **Setup Database:**
   ```bash
   npx prisma migrate dev --name init
   npm run migrate-data
   ```

### Option 3: Local PostgreSQL (Development)

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Or download from: https://postgresapp.com/
   ```

2. **Create Database:**
   ```bash
   createdb ibmp_db
   ```

3. **Update .env:**
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/ibmp_db"
   ```

4. **Setup:**
   ```bash
   npx prisma migrate dev --name init
   npm run migrate-data
   ```

## 📊 View Your Data

Open Prisma Studio to see your database:
```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555

## 🔄 Next Steps (For Developers)

The API routes still use JSON files. To use the database:

1. Update `/app/api/admission/submit/route.ts` to use Prisma
2. Update `/app/api/admin/applications/route.ts` to use Prisma
3. Update `/app/api/admin/invoices/route.ts` to use Prisma

Example code is ready - just need to switch from JSON to database calls.

## 📝 Database Models

**Application Table:**
- All admission form fields (50+ fields)
- Personal details, education, family info, etc.
- File upload paths
- Status tracking

**Invoice Table:**
- Invoice details and calculations
- Linked to applications
- Payment tracking

## 🛠 Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name description

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database
npx prisma studio

# Migrate JSON data to database
npm run migrate-data
```

## ⚠️ Important Notes

1. **Keep .env secure** - Never commit DATABASE_URL to git
2. **For Vercel deployment** - Add DATABASE_URL in Vercel dashboard under Environment Variables
3. **JSON files** - Keep as backup until database is fully tested

## 🆘 Troubleshooting

**Error: "Can't reach database server"**
- Check DATABASE_URL is correct
- Ensure database is running
- Check firewall/network settings

**Error: "Environment variable not found"**
- Make sure .env file exists
- DATABASE_URL is set correctly

**Need help?**
- Prisma Docs: https://www.prisma.io/docs
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
