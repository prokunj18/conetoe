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

      toast({ 
        title: 'Room created!',
        description: `Code: ${code}`
      });

      navigate(`/game?room=${code}&role=host`);
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
        .update({ guest_id: user.id, status: 'playing', started_at: new Date().toISOString() })
        .eq('id', room.id);

      if (updateError) throw updateError;

      toast({ title: 'Joined room!' });
      navigate(`/game?room=${roomCode.toUpperCase()}&role=guest`);
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
              onClick={createRoom} 
              disabled={creating}
              className="w-full h-14 text-lg"
            >
              {creating ? 'Creating...' : 'Create Room'}
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
              variant="secondary"
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
