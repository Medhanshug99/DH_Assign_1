-- Run this entire script in your Supabase SQL editor to create the necessary tables, types, and security policies

-- 1. Create custom types
CREATE TYPE subscription_tier AS ENUM ('none', 'monthly', 'yearly');

-- 2. Create Charities Table
CREATE TABLE charities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Insert dummy charities
INSERT INTO charities (name, description, image_url) VALUES 
('Golf for Good', 'Empowering youth through golf and education.', 'https://images.unsplash.com/photo-1535136113854-3e913a806950?auto=format&fit=crop&q=80&w=2000'),
('Green Keepers', 'Environmental conservation for public golf courses.', 'https://images.unsplash.com/photo-1593111774240-d529f12cb416?auto=format&fit=crop&q=80&w=2000'),
('Fairway Foundation', 'Providing equipment and access to underprivileged children.', 'https://images.unsplash.com/photo-1587174486073-ae5e1c47f4a5?auto=format&fit=crop&q=80&w=2000');

-- 3. Create Profiles Table (extends auth.users)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  display_name text,
  subscription_status subscription_tier DEFAULT 'none',
  subscription_period_end timestamptz,
  selected_charity_id uuid REFERENCES charities(id) ON DELETE SET NULL,
  contribution_percentage integer DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 4. Create Scores Table
CREATE TABLE scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL CHECK (score >= 1 AND score <= 45),
  date date DEFAULT current_date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS for Scores
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores" 
ON scores FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" 
ON scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores" 
ON scores FOR DELETE 
USING (auth.uid() = user_id);


-- 5. Create Draws Table
CREATE TABLE draws (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year text NOT NULL UNIQUE, -- e.g., '2023-10'
  numbers integer[] NOT NULL, -- Array of 5 numbers
  executed_at timestamptz DEFAULT now() NOT NULL,
  status text DEFAULT 'completed'
);

-- Enable RLS for Draws
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- Anyone can read draws
CREATE POLICY "Anyone can view draws" 
ON draws FOR SELECT 
USING (true);

-- Only admins can create draws (We'll enforce admin check in application logic or via RLS if needed, keeping it simple here)
CREATE POLICY "Admins can insert draws" 
ON draws FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  )
);


-- 6. Create Draw Results Table
CREATE TABLE draw_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id uuid REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  matches_count integer NOT NULL,
  won_amount numeric DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS for Draw Results
ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own draw results" 
ON draw_results FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all draw results" 
ON draw_results FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can insert draw results" 
ON draw_results FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update draw results" 
ON draw_results FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  )
);

-- Public access to charities
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view charities" ON charities FOR SELECT USING (true);
