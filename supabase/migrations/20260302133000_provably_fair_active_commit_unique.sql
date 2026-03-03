with ranked_active_commits as (
  select
    id,
    row_number() over (
      partition by wallet_id
      order by created_at desc, id desc
    ) as row_num
  from public.provably_fair_commits
  where status = 'active'
)
update public.provably_fair_commits
set
  status = 'revealed',
  revealed_at = coalesce(revealed_at, now())
where id in (
  select id
  from ranked_active_commits
  where row_num > 1
);

create unique index if not exists provably_fair_commits_wallet_active_idx
  on public.provably_fair_commits (wallet_id)
  where status = 'active';
