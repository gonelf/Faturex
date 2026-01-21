# Database Migrations

This directory contains database migration files for the Faturex project.

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file (e.g., `001_fix_contact_leads_notification_columns.sql`)
4. Copy and paste the SQL content
5. Click **Run** to execute the migration

### Option 2: Using psql

```bash
psql -h your-db-host -U postgres -d postgres -f database/migrations/001_fix_contact_leads_notification_columns.sql
```

### Option 3: Using Supabase CLI

```bash
supabase db execute --file database/migrations/001_fix_contact_leads_notification_columns.sql
```

## Current Migrations

### 001_fix_contact_leads_notification_columns.sql

**Purpose**: Adds missing `notification_sent` and `notification_sent_at` columns to the `contact_leads` table.

**Issue**: The contact leads API was failing with error "Could not find the 'notification_sent' column of 'contact_leads' in the schema cache"

**Solution**:
- Adds the missing columns if they don't exist
- Refreshes the PostgREST schema cache
- Verifies the columns were added successfully

**When to apply**:
- If you're getting schema cache errors related to contact_leads
- After initial schema setup if the contact_leads table was created without these columns

## Schema Cache Refresh

If you make schema changes and Supabase API doesn't recognize them, you may need to refresh the schema cache:

### Manual Schema Cache Refresh

Run this in Supabase SQL Editor:

```sql
NOTIFY pgrst, 'reload schema';
```

### Automatic Refresh

Supabase automatically refreshes the schema cache every few minutes, but you can force an immediate refresh using the command above.

## Migration Best Practices

1. Always test migrations on a development/staging database first
2. Back up your production database before applying migrations
3. Use idempotent migrations (check if changes exist before applying)
4. Document the purpose and context of each migration
5. Number migrations sequentially for easy tracking

## Troubleshooting

### "Column does not exist" errors

If you're still getting "column does not exist" errors after applying a migration:

1. Verify the migration was applied successfully
2. Manually refresh the schema cache: `NOTIFY pgrst, 'reload schema';`
3. Wait a few minutes for Supabase to propagate changes
4. Restart your application if needed

### Permission errors

Ensure you're using the correct database credentials with sufficient permissions to:
- Create/modify tables
- Add columns
- Execute DDL statements
