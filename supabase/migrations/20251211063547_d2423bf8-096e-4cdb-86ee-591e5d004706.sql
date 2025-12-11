-- Create a secure refund_bet RPC function for atomic bet refunds
CREATE OR REPLACE FUNCTION public.refund_bet(p_user_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Add the refund amount atomically to prevent race conditions
  UPDATE public.profiles 
  SET coins = coins + p_amount 
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$function$;