#!/bin/bash

# Supabase Storage Bucket Setup Script
# This script creates the 'public' bucket in your Supabase project

# Configuration
PROJECT_ID="nfpvilygpjosfujdpcdg"
PROJECT_URL="https://nfpvilygpjosfujdpcdg.supabase.co"
BUCKET_NAME="public"

# Get the service role key (you need to manually set this)
# From .env.local: SUPABASE_SERVICE_ROLE_KEY
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is not set"
    echo ""
    echo "To use this script, set the environment variable:"
    echo '  export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"'
    echo ""
    echo "Your service role key is in .env.local file"
    exit 1
fi

echo "🔧 Setting up Supabase Storage Bucket..."
echo "📍 Project: $PROJECT_ID"
echo "🪣 Bucket: $BUCKET_NAME"
echo ""

# Step 1: Create bucket
echo "1️⃣  Creating bucket '$BUCKET_NAME'..."
BUCKET_RESPONSE=$(curl -s -X POST \
    "$PROJECT_URL/storage/v1/buckets" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$BUCKET_NAME\",\"public\":true}")

echo "Response: $BUCKET_RESPONSE"
echo ""

# Step 2: Set bucket to public
echo "2️⃣  Making bucket public..."
PUBLIC_RESPONSE=$(curl -s -X PATCH \
    "$PROJECT_URL/storage/v1/buckets/$BUCKET_NAME" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"public\":true}")

echo "Response: $PUBLIC_RESPONSE"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to Supabase Dashboard > Storage"
echo "2. Verify '$BUCKET_NAME' bucket exists"
echo "3. Test upload in admin panel"
