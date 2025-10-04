import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Check, Users } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';

const avatarOptions = [
  { id: 'avatar1', emoji: '🤖' },
  { id: 'avatar2', emoji: '👨‍🚀' },
  { id: 'avatar3', emoji: '⚔️' },
  { id: 'avatar4', emoji: '🧙' },
  { id: 'avatar5', emoji: '🥷' },
  { id: 'avatar6', emoji: '🏴‍☠️' },
  { id: 'avatar7', emoji: '🔬' },
  { id: 'avatar8', emoji: '🧭' },
];

const WaitingLobby = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');
  const [copied, setCopied] = useState(false);
  const [guestJoined, setGuestJoined] = useState(false);
  const [guestProfile, setGuestProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !roomCode) {
      navigate('/multiplayer');
      return;
    }

    // Subscribe to room changes
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_rooms',
          filter: `room_code=eq.${roomCode}`
        },
        async (payload) => {
          const room = payload.new as any;
          
          if (room.guest_id && room.status === 'playing') {
            // Fetch guest profile
            const { data: guest } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', room.guest_id)
              .single();

            if (guest) {
              setGuestProfile(guest);
              setGuestJoined(true);
              
              // Wait a moment to show the guest joined, then navigate
              setTimeout(() => {
                navigate(`/game?room=${roomCode}&role=host`);
              }, 1500);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomCode, navigate]);

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast({ title: 'Room code copied!' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cancelRoom = async () => {
    if (!roomCode) return;

    await supabase
      .from('game_rooms')
      .delete()
      .eq('room_code', roomCode);

    navigate('/multiplayer');
  };

  const hostAvatar = avatarOptions.find(a => a.id === profile?.avatar)?.emoji || '🤖';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <Card className="w-full max-w-md z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={cancelRoom}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>Waiting for Player</CardTitle>
            <div className="w-10" />
          </div>
          <CardDescription>
            Share this code with your friend
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Room Code Display */}
          <div className="flex flex-col items-center space-y-3">
            <div className="text-sm text-muted-foreground">Room Code</div>
            <div 
              onClick={copyRoomCode}
              className="relative flex items-center justify-center gap-3 bg-gradient-primary p-6 rounded-xl cursor-pointer hover:shadow-neon transition-all group"
            >
              <span className="text-4xl font-bold tracking-[0.3em] text-white">
                {roomCode}
              </span>
              <Button 
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click to copy the code
            </p>
          </div>

          {/* Players Display */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-center">Players</div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Host */}
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-player-1/20 border border-primary/30">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarFallback className="text-3xl bg-gradient-player-1">
                    {hostAvatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-sm font-semibold">{profile?.username || 'You'}</p>
                  <p className="text-xs text-muted-foreground">Host</p>
                </div>
              </div>

              {/* Guest */}
              <div className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                guestJoined 
                  ? 'bg-gradient-player-2/20 border border-secondary' 
                  : 'bg-muted/50 border border-dashed border-muted-foreground/30'
              }`}>
                {guestJoined && guestProfile ? (
                  <>
                    <Avatar className="w-16 h-16 border-2 border-secondary animate-scale-in">
                      <AvatarFallback className="text-3xl bg-gradient-player-2">
                        {avatarOptions.find(a => a.id === guestProfile.avatar)?.emoji || '👤'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{guestProfile.username}</p>
                      <p className="text-xs text-green-500">Joined!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground/50 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Waiting...</p>
                      <p className="text-xs text-muted-foreground/70">Guest</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {guestJoined && (
            <div className="text-center">
              <p className="text-sm text-green-500 animate-fade-in">
                Starting game...
              </p>
            </div>
          )}

          <Button 
            variant="destructive" 
            onClick={cancelRoom}
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingLobby;
