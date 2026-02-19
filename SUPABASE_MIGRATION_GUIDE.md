# Supabase Migration Guide

This guide explains how to set up Supabase for the IBMP website after removing Prisma.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Get your project URL and API keys from the project settings

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

You can find these values in your Supabase project:
- Go to **Settings → API**
- Copy the **Project URL** and **Anon Key** (public)
- Copy the **Service Role Key** (keep this secret, only use on server-side)

## Database Schema

You need to create the following tables in your Supabase database:

### 1. Applications Table

```sql
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  application_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Basic Information
  full_name VARCHAR(255) NOT NULL,
  dob TIMESTAMP,
  gender VARCHAR(20),
  nationality VARCHAR(100),
  referral_source VARCHAR(255),
  referral_details TEXT,
  
  -- Contact Information
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  permanent_address TEXT,
  permanent_city VARCHAR(100),
  permanent_state VARCHAR(100),
  permanent_pincode VARCHAR(10),
  communication_address TEXT,
  communication_city VARCHAR(100),
  communication_state VARCHAR(100),
  communication_pincode VARCHAR(10),
  
  -- Family Information
  father_name VARCHAR(255),
  father_occupation VARCHAR(255),
  mother_name VARCHAR(255),
  mother_occupation VARCHAR(255),
  spouse_name VARCHAR(255),
  spouse_occupation VARCHAR(255),
  
  -- Course Details
  course_type VARCHAR(100),
  course_name VARCHAR(255),
  specialization VARCHAR(255),
  
  -- 10th Details
  tenth_board VARCHAR(255),
  tenth_school VARCHAR(255),
  tenth_year VARCHAR(4),
  tenth_percentage VARCHAR(10),
  
  -- 12th Details
  twelfth_board VARCHAR(255),
  twelfth_school VARCHAR(255),
  twelfth_year VARCHAR(4),
  twelfth_percentage VARCHAR(10),
  
  -- UG Details
  ug_degree VARCHAR(255),
  ug_university VARCHAR(255),
  ug_college VARCHAR(255),
  ug_year VARCHAR(4),
  ug_percentage VARCHAR(10),
  
  -- PG Details
  pg_degree VARCHAR(255),
  pg_university VARCHAR(255),
  pg_college VARCHAR(255),
  pg_year VARCHAR(4),
  pg_percentage VARCHAR(10),
  
  -- Payment
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  
  -- Documents (JSON)
  documents JSONB,
  
  -- Declaration
  declaration BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_application_number ON applications(application_number);
CREATE INDEX idx_applications_status ON applications(status);
```

### 2. Invoices Table

```sql
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  application_number VARCHAR(50) NOT NULL,
  
  -- Student Information
  student_name VARCHAR(255) NOT NULL,
  course_name VARCHAR(255),
  
  -- Fees
  admission_fee DECIMAL(10, 2) DEFAULT 0,
  tuition_fee DECIMAL(10, 2) DEFAULT 0,
  registration_fee DECIMAL(10, 2) DEFAULT 0,
  other_fees DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Payment Information
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_application_number ON invoices(application_number);
CREATE INDEX idx_invoices_status ON invoices(status);
```

## Steps to Set Up

1. **Create the Supabase project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Wait for it to be set up

2. **Create the database tables**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the SQL schemas above
   - Execute the queries to create the tables

3. **Update your `.env.local` file**
   - Add the environment variables from Step 2

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Test the API**
   - Your API routes are now ready to use with Supabase
   - The routes in `app/api/admission/submit-db` and `app/api/admin/*-db` will now store data in Supabase

## API Routes

### Admission Application Submission
- **Endpoint**: `POST /api/admission/submit-db`
- **Stores data in**: `applications` table

### Get All Applications
- **Endpoint**: `GET /api/admin/applications-db`
- **Retrieves from**: `applications` table

### Get Single Application
- **Endpoint**: `GET /api/admin/applications-db/[id]`
- **Retrieves from**: `applications` table by application_number

### Update Application
- **Endpoint**: `PATCH /api/admin/applications-db/[id]`
- **Updates**: `applications` table

### Get All Invoices
- **Endpoint**: `GET /api/admin/invoices-db`
- **Retrieves from**: `invoices` table

### Create Invoice
- **Endpoint**: `POST /api/admin/invoices-db`
- **Stores data in**: `invoices` table

### Get Single Invoice
- **Endpoint**: `GET /api/admin/invoices-db/[id]`
- **Retrieves from**: `invoices` table by invoice_number

## File Changes

The following files were updated to use Supabase:

1. **Removed**:
   - `prisma/schema.prisma` - Prisma schema
   - `prisma.config.ts` - Prisma configuration
   - `lib/prisma.ts` - Prisma client

2. **Added**:
   - `lib/supabase.ts` - Supabase client configuration

3. **Updated**:
   - `package.json` - Removed Prisma, added @supabase/supabase-js
   - `app/api/admission/submit-db/route.ts` - Updated to use Supabase
   - `app/api/admin/applications-db/route.ts` - Updated to use Supabase
   - `app/api/admin/applications-db/[id]/route.ts` - Updated to use Supabase
   - `app/api/admin/invoices-db/route.ts` - Updated to use Supabase
   - `app/api/admin/invoices-db/[id]/route.ts` - Updated to use Supabase

## Troubleshooting

### Connection Issues
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Make sure the Supabase project is active and running
- Check network connectivity

### Table Not Found
- Ensure you've created all the required tables in the SQL Editor
- Check the table names match exactly (case-sensitive)
- Verify the table is in the `public` schema

### Permission Denied
- Check that your `SUPABASE_SERVICE_ROLE_KEY` is correct for admin operations
- Ensure RLS (Row Level Security) policies are configured correctly if needed

## Data Migration

If you have existing data in your old database, you'll need to migrate it to Supabase:

1. Export your data from the old database as CSV or JSON
2. Import it into the Supabase tables using the Data Editor or API

For assistance with data migration, refer to the Supabase documentation.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)
