-- Security Fix 1 & 2: Add CHECK constraint to prevent negative coin balances
ALTER TABLE public.profiles ADD CONSTRAINT positive_coins CHECK (coins >= 0 AND coins <= 10000000);

-- Security Fix 3: Create leaderboard view for public profile data (sanitized)
CREATE OR REPLACE VIEW public.leaderboard AS 
SELECT 
  id, 
  username, 
  avatar, 
  level, 
  total_wins, 
  total_games 
FROM public.profiles 
ORDER BY level DESC, total_wins DESC 
LIMIT 100;

-- Security Fix 3: Update RLS policy on profiles to restrict SELECT to own profile
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Security Fix 4: Rewrite complete_game function with proper validation
CREATE OR REPLACE FUNCTION public.complete_game(p_room_id uuid, p_winner_id uuid, p_bet_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_room game_rooms;
  v_host_coins INTEGER;
  v_guest_coins INTEGER;
BEGIN
  -- Verify caller is part of the game and game is in playing status
  SELECT * INTO v_room 
  FROM public.game_rooms 
  WHERE id = p_room_id 
    AND (host_id = auth.uid() OR guest_id = auth.uid())
    AND status = 'playing';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unauthorized access or invalid game state';
  END IF;
  
  -- Verify bet amount matches the room's bet amount
  IF v_room.bet_amount != p_bet_amount THEN
    RAISE EXCEPTION 'Invalid bet amount';
  END IF;
  
  -- Verify winner is valid (must be host or guest)
  IF p_winner_id NOT IN (v_room.host_id, v_room.guest_id) THEN
    RAISE EXCEPTION 'Invalid winner ID';
  END IF;
  
  -- Mark room as completed (prevents double-claiming)
  UPDATE public.game_rooms 
  SET status = 'completed', 
      winner_id = p_winner_id,
      finished_at = now()
  WHERE id = p_room_id AND status = 'playing';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game already completed';
  END IF;
  
  -- Get current coin balances
  SELECT coins INTO v_host_coins FROM public.profiles WHERE id = v_room.host_id;
  SELECT coins INTO v_guest_coins FROM public.profiles WHERE id = v_room.guest_id;
  
  -- Distribute winnings
  IF p_winner_id = v_room.host_id THEN
    -- Host won - add winnings to host
    UPDATE public.profiles
    SET coins = coins + (p_bet_amount * 2),
        total_wins = total_wins + 1,
        total_games = total_games + 1
    WHERE id = v_room.host_id;
    
    -- Update guest stats (deduction already happened at game start)
    IF NOT v_room.is_bot_game THEN
      UPDATE public.profiles
      SET total_games = total_games + 1
      WHERE id = v_room.guest_id;
    END IF;
  ELSE
    -- Guest won - add winnings to guest
    UPDATE public.profiles
    SET coins = coins + (p_bet_amount * 2),
        total_wins = total_wins + 1,
        total_games = total_games + 1
    WHERE id = v_room.guest_id;
    
    -- Update host stats (deduction already happened at game start)
    UPDATE public.profiles
    SET total_games = total_games + 1
    WHERE id = v_room.host_id;
  END IF;
END;
$function$;

-- Create a secure function to deduct bet amount atomically
CREATE OR REPLACE FUNCTION public.deduct_bet(p_user_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_current_coins INTEGER;
BEGIN
  -- Get current balance
  SELECT coins INTO v_current_coins FROM public.profiles WHERE id = p_user_id;
  
  -- Check if user has sufficient balance
  IF v_current_coins < p_amount THEN
    RETURN false;
  END IF;
  
  -- Deduct the bet amount
  UPDATE public.profiles 
  SET coins = coins - p_amount 
  WHERE id = p_user_id AND coins >= p_amount;
  
  RETURN FOUND;
END;
$function$;