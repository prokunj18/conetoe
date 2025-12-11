-- Create a secure join_game_as_guest function that handles guest bet deduction
-- This function is called by the guest when they acknowledge the game start
CREATE OR REPLACE FUNCTION public.confirm_game_participation(p_room_id uuid)
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
  
  -- Verify caller is the guest of this room
  IF v_caller_id != v_room.guest_id THEN
    RAISE EXCEPTION 'Unauthorized: You are not the guest of this room';
  END IF;
  
  -- Verify room is waiting to start
  IF v_room.status != 'waiting' THEN
    RAISE EXCEPTION 'Game has already started or finished';
  END IF;
  
  -- Skip bot games
  IF v_room.is_bot_game THEN
    RETURN true;
  END IF;
  
  -- Validate bet amount
  IF v_room.bet_amount <= 0 OR v_room.bet_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid bet amount';
  END IF;
  
  -- Deduct bet from guest's own account
  UPDATE public.profiles 
  SET coins = coins - v_room.bet_amount 
  WHERE id = v_caller_id AND coins >= v_room.bet_amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient coins';
  END IF;
  
  RETURN true;
END;
$function$;

-- Create atomic start_multiplayer_game function that handles the entire flow securely
CREATE OR REPLACE FUNCTION public.start_multiplayer_game(p_room_code text, p_bet_amount integer)
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
  
  -- Validate bet amount
  IF p_bet_amount <= 0 OR p_bet_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid bet amount';
  END IF;
  
  -- Get room and verify host
  SELECT * INTO v_room
  FROM public.game_rooms
  WHERE room_code = p_room_code;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room not found';
  END IF;
  
  IF v_room.host_id != v_caller_id THEN
    RAISE EXCEPTION 'Only the host can start the game';
  END IF;
  
  IF v_room.status != 'waiting' THEN
    RAISE EXCEPTION 'Game has already started or finished';
  END IF;
  
  IF v_room.guest_id IS NULL AND NOT v_room.is_bot_game THEN
    RAISE EXCEPTION 'No guest has joined yet';
  END IF;
  
  -- Deduct from host
  UPDATE public.profiles 
  SET coins = coins - p_bet_amount 
  WHERE id = v_caller_id AND coins >= p_bet_amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Host has insufficient coins';
  END IF;
  
  -- Deduct from guest if not bot game
  IF NOT v_room.is_bot_game AND v_room.guest_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET coins = coins - p_bet_amount 
    WHERE id = v_room.guest_id AND coins >= p_bet_amount;
    
    IF NOT FOUND THEN
      -- Refund host if guest doesn't have enough
      UPDATE public.profiles 
      SET coins = coins + p_bet_amount 
      WHERE id = v_caller_id;
      
      RAISE EXCEPTION 'Guest has insufficient coins';
    END IF;
  END IF;
  
  -- Update room to playing status
  UPDATE public.game_rooms
  SET status = 'playing',
      started_at = now(),
      bet_amount = p_bet_amount
  WHERE room_code = p_room_code;
  
  RETURN true;
END;
$function$;