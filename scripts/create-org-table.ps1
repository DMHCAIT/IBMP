#!/usr/bin/env pwsh

# Load .env.local file
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^\s*([^=]+)\s*=\s*(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$databaseUrl = $env:DATABASE_URL

if (-not $databaseUrl) {
    Write-Host "❌ DATABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Using Supabase connection..." -ForegroundColor Cyan
Write-Host "🔄 Creating organization_accreditations table..." -ForegroundColor Yellow

$sqlScript = @"
-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.organization_accreditations (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_accreditation_number ON public.organization_accreditations (accreditation_number);
CREATE INDEX IF NOT EXISTS idx_org_accreditation_name ON public.organization_accreditations (organization_name);

-- Enable Row Level Security
ALTER TABLE public.organization_accreditations ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Allow public read access to organization accreditations" ON public.organization_accreditations;
CREATE POLICY "Allow public read access to organization accreditations"
  ON public.organization_accreditations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow service role full access to organization accreditations" ON public.organization_accreditations;
CREATE POLICY "Allow service role full access to organization accreditations"
  ON public.organization_accreditations FOR ALL
  USING (true);

-- Insert sample data
INSERT INTO public.organization_accreditations (
  organization_name,
  accreditation_title,
  accreditation_number,
  date_of_accreditation,
  validity_period,
  status
) VALUES
  ('Apex Global Medical University', 'Fellowship', 'IBMP-23173IN', '2025-01-15', '5 Years (2025 - 2030)', 'Active'),
  ('Metro Care Research Hospital', 'CME/CPD', 'IBMP-244001IN', '2024-08-20', '3 Years (2024 - 2027)', 'Active')
ON CONFLICT (accreditation_number) DO NOTHING;

-- Verify table was created
SELECT COUNT(*) as record_count FROM public.organization_accreditations;
"@

Write-Host "📝 SQL Script:" -ForegroundColor Cyan
Write-Host $sqlScript
Write-Host ""

# Save to temp file
$tempFile = "$env:TEMP\migration_$([guid]::NewGuid()).sql"
$sqlScript | Out-File -FilePath $tempFile -Encoding UTF8

try {
    # Execute with psql
    Write-Host "🚀 Executing migration..." -ForegroundColor Yellow
    $env:PGPASSWORD = ""  # Password is in the connection string
    
    & psql $databaseUrl -f $tempFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Sample data inserted:" -ForegroundColor Green
        Write-Host "  • Apex Global Medical University (IBMP-23173IN)" -ForegroundColor Green
        Write-Host "  • Metro Care Research Hospital (IBMP-244001IN)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration executed but check output above for any errors" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error executing psql: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Please execute this SQL manually in Supabase Dashboard:" -ForegroundColor Yellow
    Write-Host $sqlScript
    exit 1
} finally {
    # Clean up temp file
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force
    }
}

exit 0
