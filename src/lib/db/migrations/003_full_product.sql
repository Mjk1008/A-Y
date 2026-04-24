-- ============================================================
-- Migration 003: Full product tables (UUID edition)
-- subscriptions, invoices, usage_logs, notification_prefs,
-- bookmarks, roadmap_progress, feedback, promo_codes
-- ============================================================

-- ── Subscriptions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type     TEXT NOT NULL CHECK (plan_type IN ('free','pro','max')),
  status        TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','cancelled','expired','pending')),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  cancelled_at  TIMESTAMPTZ,
  payment_ref   TEXT,
  zarinpal_ref  TEXT,
  amount_toman  INTEGER DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly'
                  CHECK (billing_cycle IN ('monthly','yearly','lifetime')),
  promo_code    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user   ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ── Invoices ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  plan_type       TEXT NOT NULL,
  billing_cycle   TEXT NOT NULL,
  amount_toman    INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','failed','refunded')),
  payment_ref     TEXT,
  zarinpal_ref    TEXT,
  promo_code      TEXT,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);

-- ── Usage logs ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL
               CHECK (type IN ('analysis','chat_message','roadmap','job_view','course_view')),
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_user_type ON usage_logs(user_id, type);
CREATE INDEX IF NOT EXISTS idx_usage_created   ON usage_logs(created_at);

-- ── Notification preferences ──────────────────────────────
CREATE TABLE IF NOT EXISTS notification_prefs (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  weekly_digest   BOOLEAN DEFAULT true,
  job_alerts      BOOLEAN DEFAULT true,
  tool_updates    BOOLEAN DEFAULT true,
  expiry_reminder BOOLEAN DEFAULT true,
  chat_reminders  BOOLEAN DEFAULT false,
  marketing       BOOLEAN DEFAULT false,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bookmarks ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('job','course','tool')),
  item_id    TEXT NOT NULL,
  item_data  JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- ── Roadmap progress ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id  UUID REFERENCES analyses(id) ON DELETE CASCADE,
  week_num     INTEGER NOT NULL CHECK (week_num BETWEEN 0 AND 10),
  day_num      INTEGER NOT NULL CHECK (day_num BETWEEN 0 AND 30),
  task_key     TEXT NOT NULL,
  completed    BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, analysis_id, week_num, day_num, task_key)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user ON roadmap_progress(user_id, analysis_id);

-- ── Feedback ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
  context     TEXT NOT NULL DEFAULT 'analysis'
                CHECK (context IN ('analysis','chat','roadmap','general')),
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Promo codes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT UNIQUE NOT NULL,
  discount_pct INTEGER NOT NULL CHECK (discount_pct BETWEEN 1 AND 100),
  plan_type    TEXT,
  max_uses     INTEGER,
  used_count   INTEGER DEFAULT 0,
  expires_at   TIMESTAMPTZ,
  active       BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO promo_codes (code, discount_pct, max_uses)
VALUES ('LAUNCH50', 50, 500)
ON CONFLICT (code) DO NOTHING;
