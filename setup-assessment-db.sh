#!/bin/bash

# Setup Assessment Tables in Supabase
# This script creates the necessary database tables for the assessment system

SUPABASE_URL="https://nfpvilygpjosfujdpcdg.supabase.co"
DB_HOST="aws-1-ap-south-1.pooler.supabase.com"
DB_PORT="6543"
DB_NAME="postgres"
DB_USER="postgres.nfpvilygpjosfujdpcdg"
DB_PASSWORD="Dmhcawebsite123"

echo "🚀 Creating Assessment Tables in Supabase..."

# Create tables using psql
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f migrations/004_create_assessment_tables.sql

if [ $? -eq 0 ]; then
    echo "✅ Assessment tables created successfully!"
    echo ""
    echo "Tables created:"
    echo "  ✓ assessment_candidates"
    echo "  ✓ assessment_attempts"
    echo "  ✓ assessment_responses"
    echo "  ✓ assessment_settings"
    echo ""
    echo "You can now access the assessment admin panel at: http://localhost:3000/admin/assessment"
else
    echo "❌ Failed to create tables. Check your database connection and try again."
    exit 1
fi
