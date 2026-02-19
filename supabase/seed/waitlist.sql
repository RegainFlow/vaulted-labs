-- Seed script: insert 1000 mock users into the waitlist table.
-- Run this in the Supabase SQL Editor (service role, bypasses RLS).
--
-- Tier logic mirrors current app settings:
--   0-24:   Founder      ($100)
--   25-49:  Early Access ($75)
--   50-74:  Beta         ($50)
--   75-99:  Early Bird   ($25)
--   100+:   no tier      ($0)

-- Optional: uncomment the next line to wipe existing data first
-- TRUNCATE waitlist RESTART IDENTITY CASCADE;

INSERT INTO waitlist (email, credit_amount, tier, ip_address, created_at)
SELECT
  -- unique email: user_0001@domain.com
  'user_' || lpad(n::text, 4, '0') || '@' || (
    ARRAY['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com',
          'protonmail.com','fastmail.com','hey.com','zoho.com','mail.com']
  )[1 + floor(random() * 10)::int],

  -- credit amount based on position
  CASE
    WHEN n < 25 THEN 100
    WHEN n < 50 THEN 75
    WHEN n < 75 THEN 50
    WHEN n < 100 THEN 25
    ELSE 0
  END,

  -- tier label based on position
  CASE
    WHEN n < 25 THEN 'Founder'
    WHEN n < 50 THEN 'Early Access'
    WHEN n < 75 THEN 'Beta'
    WHEN n < 100 THEN 'Early Bird'
    ELSE NULL
  END,

  -- random IP address
  (10 + floor(random() * 200)::int)::text || '.' ||
  floor(random() * 256)::int::text || '.' ||
  floor(random() * 256)::int::text || '.' ||
  (1 + floor(random() * 254)::int)::text,

  -- spread signups over the past 60 days (accelerating curve)
  now() - interval '60 days' * (1.0 - pow(n::float / 1000, 2))
    + (random() - 0.5) * interval '4 hours'

FROM generate_series(0, 999) AS n
ON CONFLICT (email) DO NOTHING;

-- Show summary
SELECT
  count(*) AS total_users,
  count(*) FILTER (WHERE tier = 'Founder')       AS founders,
  count(*) FILTER (WHERE tier = 'Early Access')  AS early_access,
  count(*) FILTER (WHERE tier = 'Beta')          AS beta,
  count(*) FILTER (WHERE tier = 'Early Bird')    AS early_bird,
  count(*) FILTER (WHERE tier IS NULL)           AS no_tier
FROM waitlist;
