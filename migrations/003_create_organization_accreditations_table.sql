-- Migration: Create organization_accreditations table for storing organization accreditation records

CREATE TABLE IF NOT EXISTS organization_accreditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  accreditation_title TEXT NOT NULL,
  accreditation_number TEXT NOT NULL UNIQUE,
  date_of_accreditation TEXT NOT NULL,
  validity_period TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by accreditation number and organization name
CREATE INDEX IF NOT EXISTS idx_org_accreditation_number ON organization_accreditations (accreditation_number);
CREATE INDEX IF NOT EXISTS idx_org_accreditation_name ON organization_accreditations (organization_name);

-- Enable Row Level Security (RLS)
ALTER TABLE organization_accreditations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to organization accreditations"
  ON organization_accreditations FOR SELECT
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to organization accreditations"
  ON organization_accreditations FOR ALL
  USING (true);
