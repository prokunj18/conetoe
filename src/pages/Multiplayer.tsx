import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

const Multiplayer = () => {
  const { user } = useAuth();
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

  const createRoom = async () => {
    if (!user) return;
    
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

    setJoining(true);
    try {
      const { data: room, error } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .eq('status', 'waiting')
        .single();

      if (error || !room) {
        throw new Error('Room not found or already started');
      }

      if (room.host_id === user.id) {
        throw new Error('You cannot join your own room');
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
    
    setQuickMatching(true);
    try {
      // Try to find an available room first
      const { data: availableRooms, error: findError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('status', 'waiting')
        .is('guest_id', null)
        .eq('is_bot_game', false)
        .neq('host_id', user.id)
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('level')
          .eq('id', user.id)
          .single();

        const playerLevel = profile?.level || 1;

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
          <div className="space-y-3">
            <Button 
              onClick={quickMatch} 
              disabled={quickMatching}
              className="w-full h-16 text-lg bg-gradient-primary hover:shadow-neon"
              size="lg"
            >
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
              disabled={creating}
              className="w-full h-14 text-lg"
              variant="secondary"
            >
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
            />
            <Button 
              onClick={joinRoom} 
              disabled={joining || !roomCode.trim()}
              className="w-full h-14 text-lg"
              variant="outline"
            >
              {joining ? 'Joining...' : 'Join Room'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Multiplayer;
