-- Waitlist-only baseline schema for demo app.
-- Marketplace tables are intentionally deferred.

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  credit_amount integer DEFAULT 0,
  tier text DEFAULT NULL,
  ip_address text DEFAULT NULL
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist (created_at DESC);

-- Rate limiting table for waitlist signups (service-role only; no anon policies)
CREATE TABLE IF NOT EXISTS waitlist_rate_limits (
  id serial PRIMARY KEY,
  ip_address text NOT NULL,
  attempted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_time
  ON waitlist_rate_limits (ip_address, attempted_at DESC);

ALTER TABLE waitlist_rate_limits ENABLE ROW LEVEL SECURITY;

/*
Marketplace SQL intentionally commented out for demo-only phase.
Planned tables:
  - user_profiles
  - inventory_items
  - credit_transactions
  - marketplace_listings
  - auctions
  - auction_bids
*/
