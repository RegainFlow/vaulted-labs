-- Create waitlist table for email capture
CREATE TABLE IF NOT EXISTS waitlist (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (signup from landing page)
CREATE POLICY "Allow anonymous insert"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to read count (for live counter)
CREATE POLICY "Allow anonymous select count"
  ON waitlist
  FOR SELECT
  TO anon
  USING (true);