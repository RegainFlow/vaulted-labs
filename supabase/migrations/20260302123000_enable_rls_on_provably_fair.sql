alter table public.provably_fair_commits enable row level security;
alter table public.provably_fair_receipts enable row level security;

revoke all on public.provably_fair_commits from anon, authenticated;
revoke all on public.provably_fair_receipts from anon, authenticated;

comment on table public.provably_fair_commits is
  'Provably fair server-seed commitments. Client access is denied; edge functions use the service role.';

comment on table public.provably_fair_receipts is
  'Provably fair receipts and roll traces. Client access is denied; edge functions use the service role.';
