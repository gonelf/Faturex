-- Migration: Fix contact_leads table notification columns
-- Issue: notification_sent and notification_sent_at columns missing from schema cache
-- Date: 2026-01-18

-- Check if columns exist, add them if they don't
-- This handles both cases: table without columns OR schema cache refresh needed

DO $$
BEGIN
    -- Add notification_sent column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_leads'
        AND column_name = 'notification_sent'
    ) THEN
        ALTER TABLE contact_leads
        ADD COLUMN notification_sent BOOLEAN DEFAULT FALSE;

        RAISE NOTICE 'Added notification_sent column to contact_leads';
    ELSE
        RAISE NOTICE 'notification_sent column already exists';
    END IF;

    -- Add notification_sent_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'contact_leads'
        AND column_name = 'notification_sent_at'
    ) THEN
        ALTER TABLE contact_leads
        ADD COLUMN notification_sent_at TIMESTAMPTZ;

        RAISE NOTICE 'Added notification_sent_at column to contact_leads';
    ELSE
        RAISE NOTICE 'notification_sent_at column already exists';
    END IF;
END $$;

-- Verify the columns exist
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_leads'
AND column_name IN ('notification_sent', 'notification_sent_at')
ORDER BY column_name;

-- Refresh PostgREST schema cache
-- This is important to ensure the API recognizes the columns
NOTIFY pgrst, 'reload schema';
