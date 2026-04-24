-- Migration 005: Ensure admin phone has is_admin=true and plan_type=max
-- Safe to re-run (idempotent).

INSERT INTO users (phone, plan_type, is_admin, created_at)
VALUES ('09366291008', 'max', true, now())
ON CONFLICT (phone)
DO UPDATE SET
  plan_type = 'max',
  is_admin  = true;
