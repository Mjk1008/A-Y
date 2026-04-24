CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* ────────────────────────────────────────────────────────────────
   USERS
   plan_type includes 'max' now. is_admin bypasses all quota checks.
───────────────────────────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS users (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(20)  UNIQUE NOT NULL,
  full_name   VARCHAR(100),
  plan_type   VARCHAR(10)  DEFAULT 'free'
                           CHECK (plan_type IN ('free', 'pro', 'max')),
  is_admin    BOOLEAN      DEFAULT false,
  created_at  TIMESTAMPTZ  DEFAULT now()
);

/* ────────────────────────────────────────────────────────────────
   OTP CODES — 2-minute expiry, one-time use
───────────────────────────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS otp_codes (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(20)  NOT NULL,
  code        VARCHAR(6)   NOT NULL,
  expires_at  TIMESTAMPTZ  NOT NULL,
  used        BOOLEAN      DEFAULT false,
  created_at  TIMESTAMPTZ  DEFAULT now()
);

/* ────────────────────────────────────────────────────────────────
   PROFILES
───────────────────────────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID         REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name        VARCHAR(100),
  age              INTEGER,
  job_title        VARCHAR(100),
  industry         VARCHAR(100),
  years_experience INTEGER      DEFAULT 0,
  skills           TEXT[]       DEFAULT '{}',
  bio              TEXT,
  updated_at       TIMESTAMPTZ  DEFAULT now()
);

/* ────────────────────────────────────────────────────────────────
   RESUMES
───────────────────────────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS resumes (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         REFERENCES users(id) ON DELETE CASCADE,
  file_url     TEXT,
  parsed_text  TEXT,
  created_at   TIMESTAMPTZ  DEFAULT now()
);

/* ────────────────────────────────────────────────────────────────
   ANALYSES
───────────────────────────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS analyses (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID         REFERENCES users(id) ON DELETE CASCADE,
  profile_snapshot JSONB,
  result_json      JSONB        NOT NULL,
  created_at       TIMESTAMPTZ  DEFAULT now()
);

/* ────────────────────────────────────────────────────────────────
   INDEXES
───────────────────────────────────────────────────────────────── */
CREATE INDEX IF NOT EXISTS idx_otp_phone       ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_analyses_user   ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone     ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_admin     ON users(is_admin) WHERE is_admin = true;
