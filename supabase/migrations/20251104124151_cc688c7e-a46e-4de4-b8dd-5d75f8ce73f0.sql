-- Add function to automatically cleanup old waiting rooms
CREATE OR REPLACE FUNCTION cleanup_old_game_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete rooms that are in 'waiting' status and older than 30 minutes
  DELETE FROM public.game_rooms
  WHERE status = 'waiting'
    AND created_at < NOW() - INTERVAL '30 minutes';
END;
$$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_game_rooms_status_created 
ON public.game_rooms(status, created_at);

-- Add a check to also remove finished games older than 24 hours
CREATE OR REPLACE FUNCTION cleanup_finished_game_rooms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete finished games older than 24 hours
  DELETE FROM public.game_rooms
  WHERE status = 'finished'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$;