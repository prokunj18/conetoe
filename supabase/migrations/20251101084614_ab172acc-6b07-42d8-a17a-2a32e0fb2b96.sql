-- Fix security definer view by recreating it with SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard 
WITH (security_invoker = true)
AS 
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

-- Grant access to leaderboard view
GRANT SELECT ON public.leaderboard TO authenticated, anon;