import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, Check, Users, Coins, Sparkles } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

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
  const isBot = searchParams.get('bot') === 'true';
  const role = searchParams.get('role') || 'host';
  const [copied, setCopied] = useState(false);
  const [guestJoined, setGuestJoined] = useState(false);
  const [guestProfile, setGuestProfile] = useState<any>(null);
  const [botProfile, setBotProfile] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [betAmount, setBetAmount] = useState(25);
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !roomCode) {
      navigate('/multiplayer');
      return;
    }

    const loadRoom = async () => {
      const { data: roomData } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCode)
        .single();

      if (roomData) {
        setRoom(roomData);
        setBetAmount(roomData.bet_amount || 25);

        if (roomData.is_bot_game && roomData.bot_profile_id) {
          const { data: bot } = await supabase
            .from('bot_profiles')
            .select('*')
            .eq('id', roomData.bot_profile_id)
            .single();
          
          if (bot) {
            setBotProfile(bot);
            setGuestJoined(true);
          }
        } else if (roomData.guest_id) {
          const { data: guest } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', roomData.guest_id)
            .single();

          if (guest) {
            setGuestProfile(guest);
            setGuestJoined(true);
          }
        }
      }
    };

    loadRoom();

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
          const updatedRoom = payload.new as any;
          setRoom(updatedRoom);
          
          if (updatedRoom.guest_id && !updatedRoom.is_bot_game) {
            const { data: guest } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', updatedRoom.guest_id)
              .single();

            if (guest) {
              setGuestProfile(guest);
              setGuestJoined(true);
            }
          }

          if (updatedRoom.status === 'playing') {
            setTimeout(() => {
              navigate(`/game?room=${roomCode}&role=${role}`);
            }, 1500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomCode, navigate, role]);

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

  const startGame = async () => {
    if (!roomCode || !guestJoined || !profile) return;

    // Check if user has enough coins
    if (profile.coins < betAmount) {
      toast({
        title: 'Not enough coins',
        description: `You need ${betAmount} coins to play`,
        variant: 'destructive'
      });
      return;
    }

    setStarting(true);
    try {
      // Deduct bet amount from host using secure function
      const { data: hostDeducted, error: hostError } = await supabase.rpc('deduct_bet', {
        p_user_id: user!.id,
        p_amount: betAmount
      });

      if (hostError || !hostDeducted) {
        toast({
          title: 'Insufficient coins',
          description: `You need ${betAmount} coins to play`,
          variant: 'destructive'
        });
        setStarting(false);
        return;
      }

      // Deduct from guest if not bot using secure function
      if (!isBot && guestProfile) {
        const { data: guestDeducted, error: guestError } = await supabase.rpc('deduct_bet', {
          p_user_id: guestProfile.id,
          p_amount: betAmount
        });

        if (guestError || !guestDeducted) {
          toast({
            title: 'Guest has insufficient coins',
            description: 'The game cannot start. Bet has been refunded.',
            variant: 'destructive'
          });
          
          // Refund host by adding coins back
          await supabase
            .from('profiles')
            .update({ coins: profile.coins })
            .eq('id', user!.id);
          
          setStarting(false);
          return;
        }
      }

      // Update room to playing status
      await supabase
        .from('game_rooms')
        .update({ 
          status: 'playing', 
          started_at: new Date().toISOString(),
          bet_amount: betAmount
        })
        .eq('room_code', roomCode);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      setStarting(false);
    }
  };

  const hostAvatar = avatarOptions.find(a => a.id === profile?.avatar)?.emoji || '🤖';
  const guestAvatar = botProfile 
    ? avatarOptions.find(a => a.id === botProfile.avatar)?.emoji || '🤖'
    : guestProfile 
    ? avatarOptions.find(a => a.id === guestProfile?.avatar)?.emoji || '👤'
    : null;

  const maxBet = Math.min(profile?.coins || 0, guestProfile?.coins || 999999) / 2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative animate-fade-in">
      <AnimatedBackground />
      
      <Card className="w-full max-w-md z-10 bg-card/95 backdrop-blur-sm animate-scale-in hover:shadow-neon transition-all duration-500">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" onClick={cancelRoom}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>{isBot ? 'Bot Match' : 'Waiting for Player'}</CardTitle>
            <div className="w-10" />
          </div>
          <CardDescription className="flex items-center justify-center gap-2">
            <Coins className="h-4 w-4" />
            Your coins: {profile?.coins || 0}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Room Code Display - Only show if not bot match */}
          {!isBot && (
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
          )}

          {/* Bet Selection - Only for host with slider */}
          {role === 'host' && guestJoined && (
            <div className="space-y-4 p-4 bg-surface-glass rounded-xl border border-border/30 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium">Bet Amount</span>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30 px-3">
                  {betAmount} Bling
                </Badge>
              </div>
              <Slider
                value={[betAmount]}
                onValueChange={(values) => setBetAmount(values[0])}
                min={10}
                max={Math.min(maxBet * 2, 1000)}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: 10</span>
                <span className="text-amber-400 font-medium animate-pulse-soft">
                  Win: +{betAmount} Bling
                </span>
                <span>Max: {Math.min(maxBet * 2, 1000)}</span>
              </div>
            </div>
          )}

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

              {/* Guest or Bot */}
              <div className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                guestJoined 
                  ? 'bg-gradient-player-2/20 border border-secondary' 
                  : 'bg-muted/50 border border-dashed border-muted-foreground/30'
              }`}>
                {guestJoined ? (
                  <>
                    <Avatar className="w-16 h-16 border-2 border-secondary animate-scale-in">
                      <AvatarFallback className="text-3xl bg-gradient-player-2">
                        {guestAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-semibold">
                        {botProfile?.username || guestProfile?.username}
                      </p>
                      {botProfile && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {botProfile.difficulty}
                        </Badge>
                      )}
                      <p className="text-xs text-green-500">
                        {botProfile ? 'Ready!' : 'Joined!'}
                      </p>
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

          {room?.status === 'playing' ? (
            <div className="text-center">
              <p className="text-sm text-green-500 animate-fade-in">
                Starting game...
              </p>
            </div>
          ) : guestJoined && role === 'host' ? (
            <Button 
              onClick={startGame} 
              disabled={starting || (profile?.coins || 0) < betAmount}
              className="w-full h-14 text-lg bg-gradient-primary hover:shadow-neon"
            >
              {starting ? 'Starting...' : `Start Game (${betAmount} coins)`}
            </Button>
          ) : guestJoined && role === 'guest' ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground animate-pulse">
                Waiting for host to start...
              </p>
            </div>
          ) : null}

          {!guestJoined && (
            <Button 
              variant="destructive" 
              onClick={cancelRoom}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingLobby;
