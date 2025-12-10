-- Create achievements tracking table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reward_type TEXT NOT NULL, -- 'coins' or 'avatar'
  reward_value TEXT NOT NULL, -- coin amount or avatar id
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to claim achievement and add rewards
CREATE OR REPLACE FUNCTION public.claim_achievement(
  p_achievement_id TEXT,
  p_reward_type TEXT,
  p_reward_value TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_already_claimed BOOLEAN;
  v_coin_reward INTEGER;
BEGIN
  -- Check if already claimed
  SELECT EXISTS(
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = v_user_id AND achievement_id = p_achievement_id
  ) INTO v_already_claimed;
  
  IF v_already_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already claimed');
  END IF;
  
  -- Insert achievement claim
  INSERT INTO public.user_achievements (user_id, achievement_id, reward_type, reward_value)
  VALUES (v_user_id, p_achievement_id, p_reward_type, p_reward_value);
  
  -- Apply reward
  IF p_reward_type = 'coins' THEN
    v_coin_reward := p_reward_value::INTEGER;
    UPDATE public.profiles SET coins = coins + v_coin_reward WHERE id = v_user_id;
  END IF;
  
  RETURN jsonb_build_object('success', true, 'reward_type', p_reward_type, 'reward_value', p_reward_value);
END;
$$;