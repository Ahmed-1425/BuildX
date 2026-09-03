-- ================================================================
-- BUILDx Admin Dashboard Migration (002)
-- ================================================================

-- ── 1. Update application_status constraint on applications ──
alter table public.applications
  drop constraint if exists applications_application_status_check;

alter table public.applications
  add constraint applications_application_status_check
  check (
    application_status in (
      'submitted',
      'under_review',
      'preliminary_candidate',
      'accepted',
      'waitlisted',
      'rejected',
      'confirmed',
      'withdrawn'
    )
  );

-- ── 2. Admin Users Table ───────────────────────────────────────
create table if not exists public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null check (char_length(trim(full_name)) >= 2),
  role        text not null check (role in ('super_admin', 'admin', 'reviewer')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- updated_at trigger for admin_users
drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

-- ── 3. Application Reviews Table ───────────────────────────────
create table if not exists public.application_reviews (
  id                          uuid primary key default gen_random_uuid(),
  application_id              uuid not null references public.applications(id) on delete cascade,
  reviewer_id                 uuid not null references auth.users(id) on delete cascade,
  understanding_score         numeric not null check (understanding_score between 1 and 5),
  motivation_score            numeric not null check (motivation_score between 1 and 5),
  technical_readiness_score   numeric not null check (technical_readiness_score between 1 and 5),
  problem_solving_score       numeric not null check (problem_solving_score between 1 and 5),
  teamwork_score              numeric not null check (teamwork_score between 1 and 5),
  communication_score         numeric not null check (communication_score between 1 and 5),
  overall_recommendation      text not null check (overall_recommendation in ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  strengths                   text,
  concerns                    text,
  internal_notes              text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  constraint unique_application_reviewer unique (application_id, reviewer_id)
);

-- updated_at trigger for application_reviews
drop trigger if exists trg_application_reviews_updated_at on public.application_reviews;
create trigger trg_application_reviews_updated_at
  before update on public.application_reviews
  for each row execute function public.set_updated_at();

-- ── 4. Application Internal Notes Table ────────────────────────
create table if not exists public.application_notes (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications(id) on delete cascade,
  author_id       uuid not null references auth.users(id) on delete cascade,
  note            text not null check (char_length(trim(note)) > 0),
  is_pinned       boolean not null default false,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- updated_at trigger for application_notes
drop trigger if exists trg_application_notes_updated_at on public.application_notes;
create trigger trg_application_notes_updated_at
  before update on public.application_notes
  for each row execute function public.set_updated_at();

-- ── 5. Status History Table ────────────────────────────────────
create table if not exists public.application_status_history (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.applications(id) on delete cascade,
  actor_id        uuid references auth.users(id) on delete set null,
  previous_status text,
  new_status      text not null,
  note            text,
  created_at      timestamptz not null default now()
);

-- ── 6. Admin Audit Logs Table ──────────────────────────────────
create table if not exists public.admin_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid references auth.users(id) on delete set null,
  application_id  uuid references public.applications(id) on delete set null,
  action          text not null,
  previous_data   jsonb,
  new_data        jsonb,
  note            text,
  created_at      timestamptz not null default now()
);

-- ── 7. Teams and Team Members Table ────────────────────────────
create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  number      integer not null unique check (number between 1 and 20),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.team_members (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references public.teams(id) on delete cascade,
  application_id  uuid not null unique references public.applications(id) on delete cascade,
  role_in_team    text,
  created_at      timestamptz not null default now()
);

-- Seed initial 8 teams if empty
insert into public.teams (number, name)
values
  (1, 'Team Alpha (فريق 1)'),
  (2, 'Team Beta (فريق 2)'),
  (3, 'Team Gamma (فريق 3)'),
  (4, 'Team Delta (فريق 4)'),
  (5, 'Team Epsilon (فريق 5)'),
  (6, 'Team Zeta (فريق 6)'),
  (7, 'Team Eta (فريق 7)'),
  (8, 'Team Theta (فريق 8)')
on conflict (number) do nothing;

-- ── 8. Camp Settings Table (Registration Toggle) ───────────────
create table if not exists public.camp_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

insert into public.camp_settings (key, value)
values ('registration_open', 'true'::jsonb)
on conflict (key) do nothing;

-- ── 9. Indexes for Performance ─────────────────────────────────
create index if not exists idx_reviews_app_id on public.application_reviews(application_id);
create index if not exists idx_reviews_rev_id on public.application_reviews(reviewer_id);
create index if not exists idx_notes_app_id on public.application_notes(application_id);
create index if not exists idx_history_app_id on public.application_status_history(application_id);
create index if not exists idx_audit_app_id on public.admin_audit_logs(application_id);
create index if not exists idx_audit_actor_id on public.admin_audit_logs(actor_id);
create index if not exists idx_audit_created_at on public.admin_audit_logs(created_at desc);
create index if not exists idx_team_members_app on public.team_members(application_id);
create index if not exists idx_team_members_team on public.team_members(team_id);

-- ── 10. Security Functions ─────────────────────────────────────
create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and is_active = true
  );
$$;

create or replace function public.has_admin_role(required_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and is_active = true
      and role = any(required_roles)
  );
$$;

-- ── 11. Enable RLS on All Tables ───────────────────────────────
alter table public.admin_users enable row level security;
alter table public.application_reviews enable row level security;
alter table public.application_notes enable row level security;
alter table public.application_status_history enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.camp_settings enable row level security;

-- Admin users policies
create policy "Active admins can view admin_users"
  on public.admin_users for select
  using (public.is_active_admin());

create policy "Super admin can manage admin_users"
  on public.admin_users for all
  using (public.has_admin_role(array['super_admin']));

-- Applications policies for active admins
create policy "Active admins can view applications"
  on public.applications for select
  using (public.is_active_admin());

create policy "Super admin and admin can update applications"
  on public.applications for update
  using (public.has_admin_role(array['super_admin', 'admin']));

-- Reviews policies
create policy "Active admins can view reviews"
  on public.application_reviews for select
  using (public.is_active_admin());

create policy "Reviewer can insert own review"
  on public.application_reviews for insert
  with check (public.is_active_admin() and reviewer_id = auth.uid());

create policy "Reviewer can update own review"
  on public.application_reviews for update
  using (public.is_active_admin() and reviewer_id = auth.uid());

-- Notes policies
create policy "Active admins can view notes"
  on public.application_notes for select
  using (public.is_active_admin() and deleted_at is null);

create policy "Admins can insert notes"
  on public.application_notes for insert
  with check (public.is_active_admin() and author_id = auth.uid());

create policy "Author or super_admin can update notes"
  on public.application_notes for update
  using (public.is_active_admin() and (author_id = auth.uid() or public.has_admin_role(array['super_admin'])));

-- Status history policies
create policy "Active admins can view status history"
  on public.application_status_history for select
  using (public.is_active_admin());

-- Audit logs policies
create policy "Super admin and admin can view audit logs"
  on public.admin_audit_logs for select
  using (public.has_admin_role(array['super_admin', 'admin']));

-- Teams policies
create policy "Active admins can view teams"
  on public.teams for select
  using (public.is_active_admin());

create policy "Active admins can view team_members"
  on public.team_members for select
  using (public.is_active_admin());

-- Camp settings policies
create policy "Anyone can read camp_settings"
  on public.camp_settings for select
  using (true);

create policy "Super admin and admin can update camp_settings"
  on public.camp_settings for update
  using (public.has_admin_role(array['super_admin', 'admin']));
