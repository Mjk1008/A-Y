-- Migration 001: Add 'max' plan type and is_admin flag
-- Run this against the live database.

BEGIN;

/* 1. Drop the old constraint that only allowed free/pro */
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_plan_type_check;

/* 2. Add the new constraint that also allows 'max' */
ALTER TABLE users
  ADD CONSTRAINT users_plan_type_check
    CHECK (plan_type IN ('free', 'pro', 'max'));

/* 3. Add is_admin column if it doesn't exist */
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

/* 4. Index for fast admin lookups */
CREATE INDEX IF NOT EXISTS idx_users_admin
  ON users(is_admin) WHERE is_admin = true;

COMMIT;
