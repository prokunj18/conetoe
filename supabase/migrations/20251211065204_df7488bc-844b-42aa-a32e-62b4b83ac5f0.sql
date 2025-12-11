-- Create a secure RPC function for starting AI games with bet deduction
CREATE OR REPLACE FUNCTION public.start_ai_game(p_bet_amount integer, p_difficulty text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id UUID := auth.uid();
BEGIN
  -- Verify caller is authenticated
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Validate bet amount (0 is allowed for free games)
  IF p_bet_amount < 0 THEN
    RAISE EXCEPTION 'Invalid bet amount: cannot be negative';
  END IF;
  
  IF p_bet_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid bet amount: exceeds maximum allowed (10000)';
  END IF;
  
  -- Validate difficulty
  IF p_difficulty NOT IN ('easy', 'normal', 'hard', 'master') THEN
    RAISE EXCEPTION 'Invalid difficulty level';
  END IF;
  
  -- Skip deduction if bet is 0
  IF p_bet_amount = 0 THEN
    RETURN true;
  END IF;
  
  -- Deduct bet from caller's account
  UPDATE public.profiles 
  SET coins = coins - p_bet_amount 
  WHERE id = v_caller_id AND coins >= p_bet_amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient coins';
  END IF;
  
  RETURN true;
END;
$function$;

-- Create a function to cancel abandoned games and refund both players
CREATE OR REPLACE FUNCTION public.cancel_abandoned_game(p_room_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id UUID := auth.uid();
  v_room game_rooms;
BEGIN
  -- Verify caller is authenticated
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get room details
  SELECT * INTO v_room
  FROM public.game_rooms
  WHERE id = p_room_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room not found';
  END IF;
  
  -- Verify caller is part of the game
  IF v_caller_id != v_room.host_id AND v_caller_id != v_room.guest_id THEN
    RAISE EXCEPTION 'Unauthorized: You are not part of this game';
  END IF;
  
  -- Only allow cancellation of playing games that are stale (started more than 30 minutes ago)
  IF v_room.status != 'playing' THEN
    RAISE EXCEPTION 'Game is not in playing status';
  END IF;
  
  IF v_room.started_at IS NULL OR v_room.started_at > NOW() - INTERVAL '30 minutes' THEN
    RAISE EXCEPTION 'Game is not old enough to be considered abandoned';
  END IF;
  
  -- Refund host
  UPDATE public.profiles 
  SET coins = coins + v_room.bet_amount 
  WHERE id = v_room.host_id;
  
  -- Refund guest if not a bot game
  IF NOT v_room.is_bot_game AND v_room.guest_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET coins = coins + v_room.bet_amount 
    WHERE id = v_room.guest_id;
  END IF;
  
  -- Mark game as cancelled
  UPDATE public.game_rooms
  SET status = 'cancelled',
      finished_at = now()
  WHERE id = p_room_id;
  
  RETURN true;
END;
$function$;