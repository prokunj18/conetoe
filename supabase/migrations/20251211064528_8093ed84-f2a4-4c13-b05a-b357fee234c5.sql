-- Fix 1: add_exp_and_level_up - Add auth check and input validation
CREATE OR REPLACE FUNCTION public.add_exp_and_level_up(user_id uuid, exp_amount integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id UUID := auth.uid();
  current_level INTEGER;
  current_exp INTEGER;
  exp_needed INTEGER;
  new_level INTEGER;
  leveled_up BOOLEAN := false;
BEGIN
  -- Verify caller is authenticated and matches user_id
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF v_caller_id != user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot modify another user''s experience';
  END IF;
  
  -- Validate exp_amount bounds (prevent negative values and overflow)
  IF exp_amount < 0 THEN
    RAISE EXCEPTION 'Invalid exp_amount: cannot be negative';
  END IF;
  
  IF exp_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid exp_amount: exceeds maximum allowed (10000)';
  END IF;
  
  SELECT level, exp INTO current_level, current_exp
  FROM public.profiles
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  current_exp := current_exp + exp_amount;
  new_level := current_level;
  
  -- Add level cap to prevent overflow (max level 999)
  LOOP
    exp_needed := new_level * 100;
    EXIT WHEN current_exp < exp_needed OR new_level >= 999;
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
$function$;

-- Fix 2: apply_exp_decay - Add auth check
CREATE OR REPLACE FUNCTION public.apply_exp_decay(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id UUID := auth.uid();
  hours_since_activity INTEGER;
  decay_amount INTEGER;
BEGIN
  -- Verify caller is authenticated and matches user_id
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF v_caller_id != user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot modify another user''s experience';
  END IF;
  
  SELECT EXTRACT(EPOCH FROM (now() - last_activity)) / 3600 INTO hours_since_activity
  FROM public.profiles
  WHERE id = user_id;
  
  IF hours_since_activity > 24 THEN
    decay_amount := LEAST(hours_since_activity - 24, 100);
    UPDATE public.profiles
    SET exp = GREATEST(0, exp - decay_amount),
        last_activity = now()
    WHERE id = user_id;
  END IF;
END;
$function$;

-- Fix 3: deduct_bet - Add auth check to prevent cross-user coin theft
CREATE OR REPLACE FUNCTION public.deduct_bet(p_user_id uuid, p_amount integer)
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
  
  -- Only allow users to deduct from their own account
  IF v_caller_id != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot deduct coins from another user';
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid amount: must be positive';
  END IF;
  
  IF p_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid amount: exceeds maximum allowed (10000)';
  END IF;
  
  -- Deduct the bet amount only if user has sufficient balance
  UPDATE public.profiles 
  SET coins = coins - p_amount 
  WHERE id = p_user_id AND coins >= p_amount;
  
  RETURN FOUND;
END;
$function$;

-- Fix 4: refund_bet - Add auth check (similar issue)
CREATE OR REPLACE FUNCTION public.refund_bet(p_user_id uuid, p_amount integer)
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
  
  -- Only allow users to refund to their own account
  IF v_caller_id != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot refund coins to another user';
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid amount: must be positive';
  END IF;
  
  IF p_amount > 10000 THEN
    RAISE EXCEPTION 'Invalid amount: exceeds maximum allowed (10000)';
  END IF;
  
  -- Add the refund amount atomically
  UPDATE public.profiles 
  SET coins = coins + p_amount 
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$function$;

-- Fix 5: cleanup_old_game_rooms - Add auth check
CREATE OR REPLACE FUNCTION public.cleanup_old_game_rooms()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow authenticated users to trigger cleanup
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Delete rooms that are in 'waiting' status and older than 30 minutes
  DELETE FROM public.game_rooms
  WHERE status = 'waiting'
    AND created_at < NOW() - INTERVAL '30 minutes';
END;
$function$;

-- Fix 6: cleanup_finished_game_rooms - Add auth check
CREATE OR REPLACE FUNCTION public.cleanup_finished_game_rooms()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow authenticated users to trigger cleanup
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Delete finished games older than 24 hours
  DELETE FROM public.game_rooms
  WHERE status = 'finished'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$function$;