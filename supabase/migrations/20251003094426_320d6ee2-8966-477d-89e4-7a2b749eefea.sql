-- Create profiles table with avatar, username, level and exp system
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL CHECK (char_length(username) >= 3 AND char_length(username) <= 16),
  avatar TEXT NOT NULL DEFAULT 'avatar1',
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  total_wins INTEGER NOT NULL DEFAULT 0,
  total_games INTEGER NOT NULL DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT username_unique UNIQUE (username)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create game_rooms table for multiplayer with room codes
CREATE TABLE IF NOT EXISTS public.game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  game_state JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Game rooms policies
CREATE POLICY "Users can view rooms they're in"
  ON public.game_rooms FOR SELECT
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

CREATE POLICY "Users can create rooms"
  ON public.game_rooms FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update rooms they're in"
  ON public.game_rooms FOR UPDATE
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

-- Create game_history table to track games
CREATE TABLE IF NOT EXISTS public.game_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('ai', 'multiplayer')),
  result TEXT NOT NULL CHECK (result IN ('win', 'loss', 'draw')),
  exp_gained INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('easy', 'normal', 'hard', 'master')),
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE SET NULL,
  played_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

-- Game history policies
CREATE POLICY "Users can view own game history"
  ON public.game_history FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own game history"
  ON public.game_history FOR INSERT
  WITH CHECK (auth.uid() = player_id);

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile timestamp
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_timestamp();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player' || substr(NEW.id::text, 1, 6)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'avatar1')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to calculate exp decay (called by client)
CREATE OR REPLACE FUNCTION apply_exp_decay(user_id UUID)
RETURNS void AS $$
DECLARE
  hours_since_activity INTEGER;
  decay_amount INTEGER;
BEGIN
  SELECT EXTRACT(EPOCH FROM (now() - last_activity)) / 3600 INTO hours_since_activity
  FROM public.profiles
  WHERE id = user_id;
  
  -- Decay 1 exp per hour of inactivity, minimum 0
  IF hours_since_activity > 24 THEN
    decay_amount := LEAST(hours_since_activity - 24, 100); -- Max 100 exp decay
    UPDATE public.profiles
    SET exp = GREATEST(0, exp - decay_amount),
        last_activity = now()
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add exp and level up
CREATE OR REPLACE FUNCTION add_exp_and_level_up(user_id UUID, exp_amount INTEGER)
RETURNS JSONB AS $$
DECLARE
  current_level INTEGER;
  current_exp INTEGER;
  exp_needed INTEGER;
  new_level INTEGER;
  leveled_up BOOLEAN := false;
BEGIN
  SELECT level, exp INTO current_level, current_exp
  FROM public.profiles
  WHERE id = user_id;
  
  current_exp := current_exp + exp_amount;
  new_level := current_level;
  
  -- Level up logic: need level * 100 exp to level up
  LOOP
    exp_needed := new_level * 100;
    EXIT WHEN current_exp < exp_needed;
    current_exp := current_exp - exp_needed;
    new_level := new_level + 1;
    leveled_up := true;
  END LOOP;
  
  UPDATE public.profiles
  SET level = new_level,
      exp = current_exp,
      last_activity = now()
  WHERE id = user_id;
  
  RETURN jsonb_build_object(
    'leveled_up', leveled_up,
    'new_level', new_level,
    'exp', current_exp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;