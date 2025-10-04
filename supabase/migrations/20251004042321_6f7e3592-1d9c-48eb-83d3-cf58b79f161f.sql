-- Fix search_path security warnings with CASCADE

DROP FUNCTION IF EXISTS generate_room_code() CASCADE;
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

DROP FUNCTION IF EXISTS update_profile_timestamp() CASCADE;
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_timestamp();

DROP FUNCTION IF EXISTS apply_exp_decay(UUID) CASCADE;
CREATE OR REPLACE FUNCTION apply_exp_decay(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hours_since_activity INTEGER;
  decay_amount INTEGER;
BEGIN
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
$$;

DROP FUNCTION IF EXISTS add_exp_and_level_up(UUID, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION add_exp_and_level_up(user_id UUID, exp_amount INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;