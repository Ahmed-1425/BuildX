-- ================================================================
-- BUILDx Applications Table Migration
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable citext for case-insensitive unique email
create extension if not exists "citext";

-- ── Trigger function for updated_at ──────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Main applications table ───────────────────────────────────
create table if not exists public.applications (
  id                                uuid primary key default gen_random_uuid(),
  reference_code                    text unique not null,
  full_name                         text not null check (char_length(trim(full_name)) >= 3),
  birth_date                        date not null,
  phone                             text unique not null check (phone ~ '^\+9665[0-9]{8}$'),
  email                             citext unique not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  city                              text not null check (char_length(trim(city)) >= 2),
  organization                      text not null check (char_length(trim(organization)) >= 2),
  specialization                    text not null check (char_length(trim(specialization)) >= 2),
  current_status                    text not null check (current_status in ('student','graduate','employed','job_seeker','other')),
  current_status_other              text,
  level                             text not null check (level in ('foundation','practitioner','advanced')),
  level_answers                     jsonb not null default '{}',
  portfolio_links                   jsonb not null default '[]',
  professional_links                jsonb not null default '[]',
  advanced_video_url                text,
  advanced_video_access_confirmed   boolean not null default false,
  team_environment_preference       text not null check (team_environment_preference in ('comfortable','same_gender_only')),
  declaration_information_accurate  boolean not null default false,
  declaration_full_attendance       boolean not null default false,
  declaration_application_not_acceptance boolean not null default false,
  declaration_data_processing       boolean not null default false,
  application_status                text not null default 'submitted' check (application_status in ('submitted','under_review','accepted','waitlisted','rejected')),
  idempotency_key                   uuid unique not null,
  submitted_at                      timestamptz not null default now(),
  created_at                        timestamptz not null default now(),
  updated_at                        timestamptz not null default now()
);

-- ── Check: advanced level requires video fields ───────────────
alter table public.applications
  add constraint advanced_requires_video
  check (
    level != 'advanced'
    or (
      advanced_video_url is not null
      and advanced_video_url != ''
      and advanced_video_access_confirmed = true
    )
  );

-- ── Check: all declarations must be true ─────────────────────
alter table public.applications
  add constraint all_declarations_required
  check (
    declaration_information_accurate = true
    and declaration_full_attendance = true
    and declaration_application_not_acceptance = true
    and declaration_data_processing = true
  );

-- ── updated_at trigger ────────────────────────────────────────
drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ── Indexes for performance ───────────────────────────────────
create index if not exists idx_applications_email on public.applications (email);
create index if not exists idx_applications_phone on public.applications (phone);
create index if not exists idx_applications_level on public.applications (level);
create index if not exists idx_applications_status on public.applications (application_status);
create index if not exists idx_applications_submitted_at on public.applications (submitted_at desc);
create index if not exists idx_applications_idem on public.applications (idempotency_key);

-- ── Row Level Security ────────────────────────────────────────
alter table public.applications enable row level security;

-- No public read/write policies.
-- Only the service_role key (server-side) can access this table.
-- The anon key cannot read, insert, update, or delete anything.

-- ================================================================
-- DONE. The table is ready.
-- Service role inserts via the API route.
-- ================================================================
