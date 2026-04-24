-- Migration 004: Chat history persistence
-- Run once against the production DB

CREATE TABLE IF NOT EXISTS chat_conversations (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         REFERENCES users(id) ON DELETE CASCADE,
  mode        VARCHAR(20)  DEFAULT 'career' CHECK (mode IN ('career', 'free')),
  title       VARCHAR(300),
  created_at  TIMESTAMPTZ  DEFAULT now(),
  updated_at  TIMESTAMPTZ  DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID         REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id         UUID         REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(20)  NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT         NOT NULL,
  created_at      TIMESTAMPTZ  DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user
  ON chat_conversations(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conv
  ON chat_messages(conversation_id, created_at ASC);
