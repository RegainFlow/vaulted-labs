-- Add IP tracking to waitlist
ALTER TABLE waitlist ADD COLUMN ip_address text DEFAULT NULL;

-- Rate limiting table (service-role only, no anon access)
CREATE TABLE IF NOT EXISTS waitlist_rate_limits (
  id serial PRIMARY KEY,
  ip_address text NOT NULL,
  attempted_at timestamptz DEFAULT now()
);
CREATE INDEX idx_rate_limits_ip_time ON waitlist_rate_limits (ip_address, attempted_at DESC);
ALTER TABLE waitlist_rate_limits ENABLE ROW LEVEL SECURITY;
-- No anon policies = only service role can access

-- Drop anon INSERT on waitlist (all writes go through Edge Function now)
DROP POLICY IF EXISTS "Allow anonymous insert" ON waitlist;
-- Keep anon SELECT for live count hook
