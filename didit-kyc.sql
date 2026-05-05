-- didit-kyc.sql
-- Run in Supabase SQL Editor
-- Adds Didit KYC columns to profiles

alter table profiles
  add column if not exists kyc_status text not null default 'not_started'
    check (kyc_status in ('not_started', 'in_progress', 'approved', 'rejected')),
  add column if not exists didit_session_id text;

-- Backfill: anyone already marked is_verified = true → approved
update profiles set kyc_status = 'approved' where is_verified = true;

-- Index for admin queries
create index if not exists profiles_kyc_status_idx on profiles(kyc_status);
