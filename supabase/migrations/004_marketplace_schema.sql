-- Phase 2 Marketplace Schema
-- All tables for user profiles, inventory, credits, marketplace, and auctions

-- 1. User Profiles
CREATE TABLE user_profiles (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  xp integer DEFAULT 0 NOT NULL,
  vaults_opened integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 2. Inventory Items
CREATE TABLE inventory_items (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product text NOT NULL,
  vault_tier text NOT NULL,
  rarity text NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  value numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'listed', 'shipped', 'cashed_out')),
  listed_price numeric(10,2),
  acquired_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own items" ON inventory_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" ON inventory_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON inventory_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 3. Credit Transactions
CREATE TABLE credit_transactions (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('incentive', 'earned', 'spent')),
  amount numeric(10,2) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON credit_transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Marketplace Listings
CREATE TABLE marketplace_listings (
  id serial PRIMARY KEY,
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id integer REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  asking_price numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  buyer_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active listings" ON marketplace_listings
  FOR SELECT TO authenticated USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can insert own listings" ON marketplace_listings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings" ON marketplace_listings
  FOR UPDATE TO authenticated USING (auth.uid() = seller_id);

-- 5. Auctions
CREATE TABLE auctions (
  id serial PRIMARY KEY,
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id integer REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  starting_bid numeric(10,2) NOT NULL,
  current_bid numeric(10,2) NOT NULL,
  current_bidder_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  ends_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active auctions" ON auctions
  FOR SELECT TO authenticated USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Users can insert own auctions" ON auctions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Authenticated users can update auctions for bidding" ON auctions
  FOR UPDATE TO authenticated USING (status = 'active');

-- 6. Auction Bids (audit trail)
CREATE TABLE auction_bids (
  id serial PRIMARY KEY,
  auction_id integer REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bids on active auctions" ON auction_bids
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own bids" ON auction_bids
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = bidder_id);
