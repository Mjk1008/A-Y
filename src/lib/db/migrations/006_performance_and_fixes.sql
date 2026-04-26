-- ============================================================
-- Migration 006: Performance fixes + schema correctness
-- Run once against production DB on Liara
--
-- Issues addressed:
--   [BUG-1] usage_logs.type CHECK missing game_reward / referral_reward
--   [BUG-2] notifications table never created (API queries nonexistent table)
--   [PERF-1] usage_logs: missing composite (user_id, type, created_at) index
--   [PERF-2] subscriptions: missing composite (user_id, status) index
--   [PERF-3] analyses: missing composite (user_id, created_at DESC) index
--   [PERF-4] Missing indexes on FK columns: resumes, feedback, invoices
--   [PERF-5] otp_codes: partial index for active-only lookups
--   [MAINT-1] OTP auto-cleanup function + scheduled purge
--   [MAINT-2] profiles.updated_at trigger (missing from Liara schema)
-- ============================================================

BEGIN;

-- ──────────────────────────────────────────────────────────────
-- [BUG-1] Fix usage_logs.type CHECK constraint
-- Currently: ('analysis','chat_message','roadmap','job_view','course_view')
-- game_reward and referral_reward INSERTs fail silently → rewards never logged
-- ──────────────────────────────────────────────────────────────
ALTER TABLE usage_logs
  DROP CONSTRAINT IF EXISTS usage_logs_type_check;

ALTER TABLE usage_logs
  ADD CONSTRAINT usage_logs_type_check
  CHECK (type IN (
    'analysis',
    'chat_message',
    'roadmap',
    'job_view',
    'course_view',
    'game_reward',       -- ← was missing
    'referral_reward'    -- ← was missing
  ));

-- ──────────────────────────────────────────────────────────────
-- [BUG-2] Create notifications table (API queries it but it didn't exist)
-- Schema matches /api/notifications/route.ts exactly:
--   id SERIAL (API uses numeric ids for mark-read)
--   href TEXT (API inserts href column)
--   type TEXT without strict CHECK (type list may grow)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL      PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  body        TEXT,
  href        TEXT,
  read        BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partial index: only unread rows — used by unread badge count
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications(user_id, created_at DESC)
  WHERE read = false;

-- Full index for history list (ORDER BY created_at DESC LIMIT 20)
CREATE INDEX IF NOT EXISTS idx_notifications_user_all
  ON notifications(user_id, created_at DESC);


-- ──────────────────────────────────────────────────────────────
-- [PERF-1] usage_logs: drop old indexes, add covering composite
--
-- Query pattern in code:
--   WHERE user_id=$1 AND type='chat_message' AND created_at >= $2
--   WHERE user_id=$1 AND type='game_reward'  AND created_at >= $2
--
-- Old (user_id, type) forces Postgres to re-filter on created_at.
-- New (user_id, type, created_at) covers the predicate completely.
-- ──────────────────────────────────────────────────────────────
DROP INDEX IF EXISTS idx_usage_user_type;     -- replaced below
DROP INDEX IF EXISTS idx_usage_created;       -- replaced below

CREATE INDEX IF NOT EXISTS idx_usage_user_type_ts
  ON usage_logs(user_id, type, created_at DESC);

-- Separate partial index for date-range-only queries (monthly roll-ups)
CREATE INDEX IF NOT EXISTS idx_usage_created_desc
  ON usage_logs(created_at DESC);


-- ──────────────────────────────────────────────────────────────
-- [PERF-2] subscriptions: composite (user_id, status)
--
-- Query pattern:
--   WHERE user_id=$1 AND status='active' ORDER BY created_at DESC LIMIT 1
--   WHERE user_id=$1 AND status IN ('active','cancelled') ORDER BY created_at DESC
--
-- Old single-column idx_subscriptions_user still has to filter status.
-- New composite eliminates the extra filter step.
-- ──────────────────────────────────────────────────────────────
DROP INDEX IF EXISTS idx_subscriptions_status;    -- low selectivity alone

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON subscriptions(user_id, status, created_at DESC);


-- ──────────────────────────────────────────────────────────────
-- [PERF-3] analyses: composite (user_id, created_at DESC)
--
-- Query pattern:
--   WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1
--
-- Without this, Postgres scans all rows for the user then sorts.
-- ──────────────────────────────────────────────────────────────
DROP INDEX IF EXISTS idx_analyses_user;    -- replaced below

CREATE INDEX IF NOT EXISTS idx_analyses_user_ts
  ON analyses(user_id, created_at DESC);


-- ──────────────────────────────────────────────────────────────
-- [PERF-4] Missing FK indexes
--
-- Postgres does NOT auto-create indexes on FK columns.
-- Without these, cascade deletes and JOIN lookups do full seq scans.
-- ──────────────────────────────────────────────────────────────

-- resumes.user_id (no index in schema.sql)
CREATE INDEX IF NOT EXISTS idx_resumes_user
  ON resumes(user_id);

-- feedback: two FKs with no indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user
  ON feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_analysis
  ON feedback(analysis_id)
  WHERE analysis_id IS NOT NULL;                -- partial: skip NULLs

-- invoices: subscription_id FK
CREATE INDEX IF NOT EXISTS idx_invoices_subscription
  ON invoices(subscription_id)
  WHERE subscription_id IS NOT NULL;

-- chat_messages.user_id (FK, but conversation_id already indexed)
CREATE INDEX IF NOT EXISTS idx_chat_messages_user
  ON chat_messages(user_id);

-- bookmarks: composite for the most common query pattern
DROP INDEX IF EXISTS idx_bookmarks_user;        -- replaced below

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_type
  ON bookmarks(user_id, type, created_at DESC);


-- ──────────────────────────────────────────────────────────────
-- [PERF-5] otp_codes: partial index for active lookups only
--
-- Query pattern: WHERE phone=$1 AND used=false AND expires_at > now()
-- Full index on (phone) scans all rows including expired/used ones.
-- Partial index shrinks the index to only rows that matter.
-- ──────────────────────────────────────────────────────────────
DROP INDEX IF EXISTS idx_otp_phone;    -- replaced below

CREATE INDEX IF NOT EXISTS idx_otp_phone_active
  ON otp_codes(phone, expires_at)
  WHERE used = false;                           -- only live OTPs in the index


-- ──────────────────────────────────────────────────────────────
-- [MAINT-1] OTP cleanup — purge expired+used codes automatically
-- Keeps the table lean. Run via a cron or call manually.
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION purge_expired_otps()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour';   -- 1h grace after expiry

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ──────────────────────────────────────────────────────────────
-- [MAINT-2] profiles.updated_at auto-trigger
-- The supabase/schema.sql had this; src/lib/db/schema.sql didn't.
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS notification_prefs_updated_at ON notification_prefs;
CREATE TRIGGER notification_prefs_updated_at
  BEFORE UPDATE ON notification_prefs
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();

-- ──────────────────────────────────────────────────────────────
-- Verify constraint fix applied
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'usage_logs_type_check'
      AND check_clause LIKE '%game_reward%'
  ) THEN
    RAISE EXCEPTION 'usage_logs_type_check constraint did not apply correctly';
  END IF;
END;
$$;

COMMIT;

-- ──────────────────────────────────────────────────────────────
-- AFTER RUNNING: call once to clean up old OTPs
-- SELECT purge_expired_otps();
--
-- INDEX SUMMARY (all indexes after migration):
--   users:                idx_users_phone, idx_users_admin (partial)
--   otp_codes:            idx_otp_phone_active (partial, replaces old)
--   profiles:             UNIQUE(user_id) → implicit index
--   resumes:              idx_resumes_user (NEW)
--   analyses:             idx_analyses_user_ts (NEW composite)
--   subscriptions:        idx_subscriptions_user_status (NEW composite)
--   invoices:             idx_invoices_user, idx_invoices_subscription (NEW)
--   usage_logs:           idx_usage_user_type_ts (NEW covering composite)
--                         idx_usage_created_desc
--   feedback:             idx_feedback_user (NEW), idx_feedback_analysis (NEW)
--   bookmarks:            idx_bookmarks_user_type (NEW composite)
--   roadmap_progress:     idx_roadmap_progress_user (existing, good)
--   notifications:        idx_notifications_user_unread (partial), idx_notifications_user_all
--   chat_conversations:   idx_conversations_user (existing, good)
--   chat_messages:        idx_messages_conv (existing), idx_chat_messages_user (NEW)
-- ──────────────────────────────────────────────────────────────
