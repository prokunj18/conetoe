-- Create user_cosmetics table to store owned items
CREATE TABLE public.user_cosmetics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('cone', 'board')),
  item_id TEXT NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS
ALTER TABLE public.user_cosmetics ENABLE ROW LEVEL SECURITY;

-- Users can only view their own cosmetics
CREATE POLICY "Users can view own cosmetics"
ON public.user_cosmetics FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own cosmetics (needed for migration from localStorage)
CREATE POLICY "Users can insert own cosmetics"
ON public.user_cosmetics FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy for game_rooms so hosts can cancel their rooms
CREATE POLICY "Hosts can delete their own waiting rooms"
ON public.game_rooms FOR DELETE
USING (auth.uid() = host_id AND status = 'waiting');

-- Create secure RPC function for purchasing cosmetics atomically
CREATE OR REPLACE FUNCTION public.purchase_cosmetic(
  p_item_type TEXT,
  p_item_id TEXT,
  p_cost INTEGER
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_coins INTEGER;
  v_already_owned BOOLEAN;
BEGIN
  -- Verify user is authenticated
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Validate item_type
  IF p_item_type NOT IN ('cone', 'board') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid item type');
  END IF;
  
  -- Check if already owned
  SELECT EXISTS(
    SELECT 1 FROM public.user_cosmetics 
    WHERE user_id = v_user_id AND item_type = p_item_type AND item_id = p_item_id
  ) INTO v_already_owned;
  
  IF v_already_owned THEN
    RETURN jsonb_build_object('success', false, 'error', 'Item already owned');
  END IF;
  
  -- Check if user has enough coins
  SELECT coins INTO v_current_coins FROM public.profiles WHERE id = v_user_id;
  
  IF v_current_coins < p_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not enough coins');
  END IF;
  
  -- Deduct coins
  UPDATE public.profiles SET coins = coins - p_cost WHERE id = v_user_id;
  
  -- Add item to inventory
  INSERT INTO public.user_cosmetics (user_id, item_type, item_id)
  VALUES (v_user_id, p_item_type, p_item_id);
  
  RETURN jsonb_build_object('success', true, 'item_type', p_item_type, 'item_id', p_item_id);
END;
$$;