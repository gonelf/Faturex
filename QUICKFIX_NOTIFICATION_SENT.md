# Quick Fix: "notification_sent" Column Error

## Problem

You're encountering this error when submitting the contact form:

```
Error: Failed to create contact lead: Could not find the 'notification_sent' column of 'contact_leads' in the schema cache
```

## Root Cause

The `contact_leads` table in your Supabase database is missing the `notification_sent` and `notification_sent_at` columns, or the PostgREST schema cache needs to be refreshed.

## Solution

### Step 1: Apply the Migration

1. **Open Supabase Dashboard**
   - Go to your Supabase project at https://supabase.com/dashboard
   - Navigate to **SQL Editor**

2. **Run the Migration**
   - Copy the contents of `database/migrations/001_fix_contact_leads_notification_columns.sql`
   - Paste it into the SQL Editor
   - Click **Run** or press `Ctrl+Enter`

### Step 2: Verify the Fix

You should see output like:

```
NOTICE: Added notification_sent column to contact_leads
NOTICE: Added notification_sent_at column to contact_leads

column_name          | data_type  | column_default | is_nullable
---------------------|------------|----------------|-------------
notification_sent    | boolean    | false          | YES
notification_sent_at | timestamptz| NULL           | YES
```

### Step 3: Refresh Schema Cache (If Needed)

If the error persists, manually refresh the PostgREST schema cache:

```sql
NOTIFY pgrst, 'reload schema';
```

### Step 4: Test the Fix

1. Go to your application's homepage
2. Fill out the contact form
3. Submit the form
4. You should now see a success message instead of an error

## Alternative: Quick SQL Fix

If you can't access the migration file, run this SQL directly in Supabase SQL Editor:

```sql
-- Add missing columns
ALTER TABLE contact_leads
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;

ALTER TABLE contact_leads
ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'contact_leads'
AND column_name IN ('notification_sent', 'notification_sent_at');
```

## Prevention

To avoid this issue in the future:

1. Always apply the complete `database/schema.sql` when setting up a new environment
2. Check `database/migrations/` for any additional migrations after schema updates
3. Refresh the schema cache after making schema changes: `NOTIFY pgrst, 'reload schema';`

## Still Having Issues?

If the error persists after applying this fix:

1. **Check Database Connection**
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
   - Ensure the service role key has database access permissions

2. **Check Table Exists**
   ```sql
   SELECT * FROM contact_leads LIMIT 1;
   ```

3. **Wait for Cache Refresh**
   - Supabase may take 1-2 minutes to propagate schema changes
   - Try waiting a few minutes and testing again

4. **Restart Your Application**
   - If running locally: `npm run dev` (restart the dev server)
   - If deployed: Redeploy your application

## Need Help?

- Check the detailed migration documentation: `database/migrations/README.md`
- Review the main setup guide: `README.md`
- Check Supabase logs for any database errors
