# Setup Assessment Tables in Supabase - PowerShell Script
# This script creates the necessary database tables for the assessment system

$SUPABASE_URL = "https://nfpvilygpjosfujdpcdg.supabase.co"
$DB_HOST = "aws-1-ap-south-1.pooler.supabase.com"
$DB_PORT = "6543"
$DB_NAME = "postgres"
$DB_USER = "postgres.nfpvilygpjosfujdpcdg"
$DB_PASSWORD = "Dmhcawebsite123"
$SQL_FILE = "migrations/004_create_assessment_tables.sql"

Write-Host "Starting Assessment Tables Setup in Supabase..." -ForegroundColor Cyan
Write-Host ""

# Check if psql is installed
$psqlExists = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlExists) {
    Write-Host "PostgreSQL client (psql) is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL client and try again"
    exit 1
}

# Check if SQL file exists
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "SQL file not found: $SQL_FILE" -ForegroundColor Red
    exit 1
}

# Create tables using psql
$env:PGPASSWORD = $DB_PASSWORD
Write-Host "Executing SQL migration..." -ForegroundColor Yellow
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Success! Assessment tables created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tables created:" -ForegroundColor Cyan
    Write-Host "  assessment_candidates"
    Write-Host "  assessment_attempts"
    Write-Host "  assessment_responses"
    Write-Host "  assessment_settings"
    Write-Host ""
    Write-Host "Access the assessment admin at: http://localhost:3000/admin/assessment" -ForegroundColor Green
} else {
    Write-Host "Failed to create tables. Check your database connection." -ForegroundColor Red
    exit 1
}

$env:PGPASSWORD = ""

