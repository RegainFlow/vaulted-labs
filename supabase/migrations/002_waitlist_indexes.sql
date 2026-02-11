-- Index on email for fast duplicate lookups during insert
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);

-- Index on created_at for sorting/analytics queries
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist (created_at DESC);
