-- A-Y Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension (usually already enabled in Supabase)
create extension if not exists "pgcrypto";

-- =====================================================
-- PROFILES (career profile per user)
-- =====================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  full_name text not null,
  age int,
  job_title text not null,
  industry text not null,
  years_experience int not null default 0,
  skills text[] not null default '{}',
  bio text,
  linkedin_url text,
  plan_type text not null default 'free' check (plan_type in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);

-- =====================================================
-- RESUMES (uploaded files + parsed text)
-- =====================================================
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  parsed_text text,
  created_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes(user_id);

-- =====================================================
-- ANALYSES (cached Claude results)
-- =====================================================
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_snapshot jsonb not null,
  result_json jsonb not null,
  tokens_used int,
  plan_type text not null default 'free',
  created_at timestamptz not null default now()
);

create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_created_at_idx on public.analyses(created_at desc);

-- =====================================================
-- SUBSCRIPTIONS (Pro plan tracking)
-- =====================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'pro',
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  provider text,
  provider_subscription_id text,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.analyses enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: user can read/write only their own
drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile write" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = user_id);
create policy "own profile write" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own resumes" on public.resumes;
create policy "own resumes" on public.resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own analyses" on public.analyses;
create policy "own analyses" on public.analyses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own subs read" on public.subscriptions;
create policy "own subs read" on public.subscriptions for select using (auth.uid() = user_id);

-- =====================================================
-- UPDATED_AT TRIGGER FOR PROFILES
-- =====================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- =====================================================
-- STORAGE BUCKET for resumes
-- =====================================================
-- Run this in Supabase dashboard Storage section (or via SQL):
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "resume upload own" on storage.objects;
create policy "resume upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "resume read own" on storage.objects;
create policy "resume read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
