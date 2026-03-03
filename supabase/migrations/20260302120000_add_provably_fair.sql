create table if not exists public.provably_fair_commits (
  id uuid primary key,
  wallet_id text not null,
  algorithm_version text not null,
  server_seed text not null,
  server_seed_hash text not null unique,
  next_nonce integer not null default 0,
  rotation_threshold integer not null default 25,
  status text not null check (status in ('active', 'revealed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revealed_at timestamptz null
);

create index if not exists provably_fair_commits_wallet_status_idx
  on public.provably_fair_commits (wallet_id, status, created_at desc);

create table if not exists public.provably_fair_receipts (
  id uuid primary key,
  wallet_id text not null,
  commit_id uuid not null references public.provably_fair_commits(id),
  game_type text not null,
  algorithm_version text not null,
  nonce integer not null,
  client_seed text not null,
  payload_hash text not null,
  request_payload jsonb not null,
  result_payload jsonb not null,
  roll_trace jsonb not null,
  linked_transaction_id text null,
  linked_item_id text null,
  linked_parent_receipt_id uuid null references public.provably_fair_receipts(id),
  created_at timestamptz not null default now()
);

create index if not exists provably_fair_receipts_wallet_created_idx
  on public.provably_fair_receipts (wallet_id, created_at desc);

create index if not exists provably_fair_receipts_commit_nonce_idx
  on public.provably_fair_receipts (commit_id, nonce);
