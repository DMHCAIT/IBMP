# Database Setup Instructions

## Option 1: Vercel Postgres (Recommended for Vercel deployment)

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Copy the DATABASE_URL provided
6. Add it to your `.env` file:
   ```
   DATABASE_URL="your-connection-string-here"
   ```

## Option 2: Supabase (Free PostgreSQL)

1. Go to https://supabase.com
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI format)
5. Add to `.env`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

## Option 3: Railway (Free PostgreSQL)

1. Go to https://railway.app
2. Create a new project → Add PostgreSQL
3. Copy the DATABASE_URL from variables
4. Add to `.env`

## Option 4: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb ibmp_db
   ```
3. Add to `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/ibmp_db"
   ```

## After setting up DATABASE_URL:

1. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Run migrations to create database tables:
   ```bash
   npx prisma migrate dev --name init
   ```

3. (Optional) Open Prisma Studio to view your data:
   ```bash
   npx prisma studio
   ```

## Migrate existing JSON data to database:

After setting up the database, run:
```bash
npm run migrate-data
```

This will import all existing applications and invoices from JSON files to the database.
