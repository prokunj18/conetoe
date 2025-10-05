-- Add coins to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS coins INTEGER NOT NULL DEFAULT 100;

-- Add bet_amount to game_rooms table
ALTER TABLE public.game_rooms
ADD COLUMN IF NOT EXISTS bet_amount INTEGER NOT NULL DEFAULT 25;

-- Create bot_profiles table for realistic bot opponents
CREATE TABLE IF NOT EXISTS public.bot_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'avatar1',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard', 'master')),
  min_level INTEGER NOT NULL DEFAULT 1,
  max_level INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert realistic bot profiles with varying difficulties
INSERT INTO public.bot_profiles (username, avatar, difficulty, min_level, max_level) VALUES
  ('CyberKnight', 'avatar1', 'easy', 1, 3),
  ('NeonPhantom', 'avatar2', 'easy', 1, 3),
  ('ShadowCone', 'avatar3', 'normal', 3, 6),
  ('QuantumRogue', 'avatar4', 'normal', 3, 6),
  ('PrismWarrior', 'avatar5', 'normal', 4, 8),
  ('VoidStriker', 'avatar6', 'hard', 6, 10),
  ('NovaBlade', 'avatar7', 'hard', 6, 10),
  ('EchoHunter', 'avatar8', 'hard', 7, 12),
  ('ZenithBot', 'avatar1', 'master', 10, 20),
  ('OmegaTactician', 'avatar2', 'master', 10, 20),
  ('TitanCore', 'avatar3', 'master', 12, 25),
  ('PhoenixMind', 'avatar4', 'master', 12, 25),
  ('VortexGuard', 'avatar5', 'master', 15, 30),
  ('CrystalSage', 'avatar6', 'master', 15, 30),
  ('ThunderCone', 'avatar7', 'master', 18, 50);

-- Add is_bot flag to game_rooms to track bot games
ALTER TABLE public.game_rooms
ADD COLUMN IF NOT EXISTS is_bot_game BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS bot_profile_id UUID REFERENCES public.bot_profiles(id);

-- Function to handle game completion and coin distribution
CREATE OR REPLACE FUNCTION public.complete_game(
  p_room_id UUID,
  p_winner_id UUID,
  p_bet_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_host_id UUID;
  v_guest_id UUID;
  v_is_bot BOOLEAN;
BEGIN
  -- Get room details
  SELECT host_id, guest_id, is_bot_game INTO v_host_id, v_guest_id, v_is_bot
  FROM public.game_rooms
  WHERE id = p_room_id;
  
  -- Deduct bet from loser and add winnings to winner
  IF p_winner_id = v_host_id THEN
    -- Host won
    UPDATE public.profiles
    SET coins = coins + (p_bet_amount * 2)
    WHERE id = v_host_id;
    
    -- Deduct from guest if not bot
    IF NOT v_is_bot THEN
      UPDATE public.profiles
      SET coins = coins - p_bet_amount
      WHERE id = v_guest_id;
    END IF;
  ELSE
    -- Guest won
    UPDATE public.profiles
    SET coins = coins + (p_bet_amount * 2)
    WHERE id = v_guest_id;
    
    -- Deduct from host
    UPDATE public.profiles
    SET coins = coins - p_bet_amount
    WHERE id = v_host_id;
  END IF;
END;
$$;