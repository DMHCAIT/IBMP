# Supabase Storage Bucket Setup Script for Windows
# This script creates the 'public' bucket in your Supabase project

$PROJECT_ID = "nfpvilygpjosfujdpcdg"
$PROJECT_URL = "https://nfpvilygpjosfujdpcdg.supabase.co"
$BUCKET_NAME = "public"

# Get the service role key from .env.local
$SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if ([string]::IsNullOrEmpty($SERVICE_ROLE_KEY)) {
    Write-Host "❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "To run this script, you need to set the service role key from .env.local:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open .env.local file"
    Write-Host "2. Copy the SUPABASE_SERVICE_ROLE_KEY value"
    Write-Host "3. Run this command in PowerShell:"
    Write-Host '   $env:SUPABASE_SERVICE_ROLE_KEY = "your_key_here"' -ForegroundColor Cyan
    Write-Host "4. Then run this script again"
    Write-Host ""
    Exit 1
}

Write-Host "🔧 Setting up Supabase Storage Bucket..." -ForegroundColor Green
Write-Host "📍 Project: $PROJECT_ID"
Write-Host "🪣 Bucket: $BUCKET_NAME"
Write-Host ""

# Step 1: Create bucket
Write-Host "1️⃣  Creating bucket '$BUCKET_NAME'..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    "name" = $BUCKET_NAME
    "public" = $true
} | ConvertTo-Json

try {
    $createResponse = Invoke-WebRequest -Uri "$PROJECT_URL/storage/v1/buckets" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "✅ Bucket created successfully!" -ForegroundColor Green
    Write-Host "Response: $($createResponse.Content)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Bucket already exists (409 Conflict) - This is OK!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error creating bucket: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    }
}

Write-Host ""

# Step 2: Update bucket to be public
Write-Host "2️⃣  Ensuring bucket is set to public..." -ForegroundColor Cyan

$updateBody = @{
    "public" = $true
} | ConvertTo-Json

try {
    $updateResponse = Invoke-WebRequest -Uri "$PROJECT_URL/storage/v1/buckets/$BUCKET_NAME" `
        -Method PATCH `
        -Headers $headers `
        -Body $updateBody `
        -ErrorAction Stop
    
    Write-Host "✅ Bucket updated to public!" -ForegroundColor Green
    Write-Host "Response: $($updateResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error updating bucket: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to Supabase Dashboard > Storage"
Write-Host "2. Verify '$BUCKET_NAME' bucket exists"
Write-Host "3. Try uploading an image in the admin panel"
Write-Host ""
Write-Host "If upload still fails, follow manual steps in SUPABASE_BUCKET_SETUP.md" -ForegroundColor Cyan
