-- Migration 002: Upgrade admin phone to max plan with admin privileges
-- Phone: 09366291008
-- Run AFTER migration 001.

BEGIN;

/* Upsert the admin user — inserts if they don't exist yet, upgrades if they do. */
INSERT INTO users (phone, plan_type, is_admin, created_at)
VALUES ('09366291008', 'max', true, now())
ON CONFLICT (phone)
DO UPDATE SET
  plan_type  = 'max',
  is_admin   = true;

COMMIT;
