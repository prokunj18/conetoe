import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, hasCompletedAIGame } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

const Multiplayer = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [roomCode, setRoomCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [quickMatching, setQuickMatching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const canAccessMultiplayer = hasCompletedAIGame(profile);

  const createRoom = async () => {
    if (!user) return;
    if (!canAccessMultiplayer) {
      toast({
        title: 'Locked',
        description: 'Complete at least one AI game first to unlock multiplayer!',
        variant: 'destructive'
      });
      return;
    }
    
    setCreating(true);
    try {
      const code = await generateRoomCode();
      
      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: code,
          host_id: user.id,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to waiting lobby
      navigate(`/waiting-lobby?room=${code}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!user || !roomCode.trim()) return;
    if (!canAccessMultiplayer) {
      toast({
        title: 'Locked',
        description: 'Complete at least one AI game first to unlock multiplayer!',
        variant: 'destructive'
      });
      return;
    }

    setJoining(true);
    try {
      // Cleanup old rooms first
      await supabase.rpc('cleanup_old_game_rooms');

      const { data: room, error } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single();

      if (error || !room) {
        throw new Error('Room not found');
      }

      // Check if room is still valid
      if (room.status !== 'waiting') {
        throw new Error('Game already started');
      }

      const roomAge = Date.now() - new Date(room.created_at).getTime();
      if (roomAge > 30 * 60 * 1000) { // 30 minutes
        throw new Error('Room expired');
      }

      if (room.host_id === user.id) {
        throw new Error('Cannot join your own room');
      }

      if (room.guest_id) {
        throw new Error('Room is full');
      }

      const { error: updateError } = await supabase
        .from('game_rooms')
        .update({ guest_id: user.id })
        .eq('id', room.id);

      if (updateError) throw updateError;

      toast({ title: 'Joined room!' });
      navigate(`/waiting-lobby?room=${roomCode.toUpperCase()}&role=guest`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setJoining(false);
    }
  };

  const generateRoomCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_room_code');
    if (error || !data) {
      throw new Error('Failed to generate room code');
    }
    return data;
  };

  const quickMatch = async () => {
    if (!user) return;
    if (!canAccessMultiplayer) {
      toast({
        title: 'Locked',
        description: 'Complete at least one AI game first to unlock multiplayer!',
        variant: 'destructive'
      });
      return;
    }
    
    setQuickMatching(true);
    try {
      // Cleanup old rooms first
      await supabase.rpc('cleanup_old_game_rooms');

      // Try to find an available room
      const { data: availableRooms, error: findError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('status', 'waiting')
        .is('guest_id', null)
        .eq('is_bot_game', false)
        .neq('host_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Only rooms less than 30 min old
        .limit(1);

      if (findError) throw findError;

      if (availableRooms && availableRooms.length > 0) {
        // Join existing room
        const room = availableRooms[0];
        const { error: updateError } = await supabase
          .from('game_rooms')
          .update({ guest_id: user.id })
          .eq('id', room.id);

        if (updateError) throw updateError;

        toast({ title: 'Joined a match!' });
        navigate(`/waiting-lobby?room=${room.room_code}&role=guest`);
      } else {
        // No rooms available, create bot match
        const { data: profileData } = await supabase
          .from('profiles')
          .select('level')
          .eq('id', user.id)
          .single();

        const playerLevel = profileData?.level || 1;

        // Select bot based on player level
        const { data: bots } = await supabase
          .from('bot_profiles')
          .select('*')
          .lte('min_level', playerLevel)
          .gte('max_level', playerLevel)
          .limit(5);

        const selectedBot = bots && bots.length > 0 
          ? bots[Math.floor(Math.random() * bots.length)]
          : null;

        const code = await generateRoomCode();
        
        const { error: createError } = await supabase
          .from('game_rooms')
          .insert({
            room_code: code,
            host_id: user.id,
            status: 'waiting',
            is_bot_game: true,
            bot_profile_id: selectedBot?.id
          });

        if (createError) throw createError;

        toast({ title: 'Starting bot match!' });
        navigate(`/waiting-lobby?room=${code}&bot=true`);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setQuickMatching(false);
    }
  };

  // Show loading while profile is loading
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <Card className="w-full max-w-md z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>Multiplayer</CardTitle>
            <div className="w-10" />
          </div>
          <CardDescription>
            Create or join a room to play with friends
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Lock Notice */}
          {!canAccessMultiplayer && (
            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Lock className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="font-medium text-amber-400">Multiplayer Locked</p>
                <p className="text-sm text-muted-foreground">
                  Complete at least one AI game to unlock multiplayer mode.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={quickMatch} 
              disabled={quickMatching || !canAccessMultiplayer}
              className="w-full h-16 text-lg bg-gradient-primary hover:shadow-neon disabled:opacity-50"
              size="lg"
            >
              {!canAccessMultiplayer && <Lock className="w-5 h-5 mr-2" />}
              {quickMatching ? 'Finding Match...' : '⚡ Quick Match'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Play against a random opponent or bot
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={createRoom} 
              disabled={creating || !canAccessMultiplayer}
              className="w-full h-14 text-lg disabled:opacity-50"
              variant="secondary"
            >
              {!canAccessMultiplayer && <Lock className="w-4 h-4 mr-2" />}
              {creating ? 'Creating...' : 'Create Private Room'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Share the room code with your friend
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              disabled={!canAccessMultiplayer}
            />
            <Button 
              onClick={joinRoom} 
              disabled={joining || !roomCode.trim() || !canAccessMultiplayer}
              className="w-full h-14 text-lg disabled:opacity-50"
              variant="outline"
            >
              {!canAccessMultiplayer && <Lock className="w-4 h-4 mr-2" />}
              {joining ? 'Joining...' : 'Join Room'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Multiplayer;
