-- ============================================================
-- COMPANION TABLES — run in Supabase SQL Editor
-- ============================================================

-- ── 1. COMPANION OFFERS ──────────────────────────────────────
create table public.companion_offers (
  id                  uuid default uuid_generate_v4() primary key,
  traveler_id         uuid references public.profiles(id) on delete cascade not null,
  origin_city         text not null,
  origin_country      text not null,
  destination_city    text not null,
  destination_country text not null default 'Iran',
  travel_date         date not null,
  return_date         date,
  languages           text,
  services            text,
  bio                 text,
  price               numeric(8,2),
  status              text default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at          timestamp with time zone default timezone('utc', now()),
  updated_at          timestamp with time zone default timezone('utc', now())
);

-- ── 2. COMPANION REQUESTS ────────────────────────────────────
create table public.companion_requests (
  id                  uuid default uuid_generate_v4() primary key,
  sender_id           uuid references public.profiles(id) on delete cascade not null,
  origin_city         text not null,
  origin_country      text not null,
  destination_city    text not null,
  destination_country text not null default 'Iran',
  needed_by_date      date,
  needs               text,
  details             text,
  budget              numeric(8,2),
  status              text default 'open' check (status in ('open', 'matched', 'completed', 'cancelled')),
  created_at          timestamp with time zone default timezone('utc', now()),
  updated_at          timestamp with time zone default timezone('utc', now())
);

-- ── INDEXES ──────────────────────────────────────────────────
create index companion_offers_traveler_idx  on public.companion_offers(traveler_id);
create index companion_offers_status_idx    on public.companion_offers(status);
create index companion_offers_date_idx      on public.companion_offers(travel_date);
create index companion_requests_sender_idx  on public.companion_requests(sender_id);
create index companion_requests_status_idx  on public.companion_requests(status);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
alter table public.companion_offers   enable row level security;
alter table public.companion_requests enable row level security;

create policy "Anyone can view active companion offers"
  on public.companion_offers for select using (true);
create policy "Travelers can create companion offers"
  on public.companion_offers for insert with check (auth.uid() = traveler_id);
create policy "Travelers can update their own companion offers"
  on public.companion_offers for update using (auth.uid() = traveler_id);

create policy "Anyone can view open companion requests"
  on public.companion_requests for select using (true);
create policy "Senders can create companion requests"
  on public.companion_requests for insert with check (auth.uid() = sender_id);
create policy "Senders can update their own companion requests"
  on public.companion_requests for update using (auth.uid() = sender_id);

-- ── ENABLE REALTIME ON MESSAGES ──────────────────────────────
alter publication supabase_realtime add table messages;
