-- Enable RLS for bot_profiles table
ALTER TABLE public.bot_profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read bot profiles (they're public game bots)
CREATE POLICY "Bot profiles are viewable by everyone"
ON public.bot_profiles
FOR SELECT
USING (true);