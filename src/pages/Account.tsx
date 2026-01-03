import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useAvatars } from '@/hooks/useAvatars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogOut, Coins, Trophy, Gamepad2, Target, Sparkles, Star, Crown, Zap, Lock, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AVATARS, getTierStyles, getUnlockText } from '@/data/avatars';

const Account = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile, reload } = useProfile();
  const { isUnlocked, canPurchase, purchaseAvatar } = useAvatars();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [saving, setSaving] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setSelectedAvatar(profile.avatar);
    }
  }, [profile]);

  const handleSave = async () => {
    if (username.length < 3 || username.length > 16) {
      toast({
        title: 'Invalid username',
        description: 'Username must be 3-16 characters',
        variant: 'destructive'
      });
      return;
    }

    if (!isUnlocked(selectedAvatar)) {
      toast({
        title: 'Avatar locked',
        description: 'You need to unlock this avatar first',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    const { error } = await updateProfile({
      username,
      avatar: selectedAvatar
    });

    if (error) {
      toast({
        title: 'Error',
        description: typeof error === 'string' ? error : 'Failed to update profile',
        variant: 'destructive'
      });
    } else {
      toast({ title: 'Profile updated!' });
    }
    setSaving(false);
  };

  const handlePurchase = async (avatarId: string) => {
    if (!canPurchase(avatarId)) return;
    
    setPurchasing(avatarId);
    const success = await purchaseAvatar(avatarId);
    if (success) {
      reload();
    }
    setPurchasing(null);
  };

  // Render stars background
  const renderStars = () => {
    return Array.from({ length: 80 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          opacity: Math.random() * 0.8 + 0.2
        }}
      />
    ));
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const expNeeded = profile.level * 100;
  const expProgress = (profile.exp / expNeeded) * 100;
  const winRate = profile.total_games > 0 ? Math.round((profile.total_wins / profile.total_games) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center p-4 relative overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderStars()}
      </div>

      {/* Nebula Effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="w-full max-w-2xl z-10 flex items-center justify-between mb-6 mt-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="bg-card/50 backdrop-blur-sm">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent">Profile</h1>
        <Button variant="ghost" size="icon" onClick={signOut} className="bg-card/50 backdrop-blur-sm text-destructive hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full max-w-2xl z-10 space-y-6">
        {/* Profile Card */}
        <Card className="bg-card/80 backdrop-blur-xl border-primary/20 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 p-6">
            <div className="flex items-center gap-6">
              {/* Current Avatar Display */}
              <div className="relative">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getTierStyles(AVATARS.find(a => a.id === profile.avatar)?.tier || 'common')} p-1 animate-pulse`}>
                  <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                    <span className="text-5xl">
                      {AVATARS.find(a => a.id === profile.avatar)?.emoji || '🤖'}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-primary rounded-full p-2">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <Badge className="bg-gradient-primary text-white">Lv.{profile.level}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">{profile.coins}</span>
                  <span>Bling</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Experience Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Experience
                </span>
                <span className="text-muted-foreground">{profile.exp} / {expNeeded} XP</span>
              </div>
              <div className="relative">
                <Progress value={expProgress} className="h-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 text-center border border-green-500/30">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-green-400">{profile.total_wins}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl p-4 text-center border border-blue-500/30">
                <Gamepad2 className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-blue-400">{profile.total_games}</div>
                <div className="text-xs text-muted-foreground">Games</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-4 text-center border border-purple-500/30">
                <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-purple-400">{winRate}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Selection */}
        <Card className="bg-card/80 backdrop-blur-xl border-accent/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <Label className="text-lg font-semibold">Choose Avatar</Label>
            </div>
            
            {/* Tier Sections */}
            {['legendary', 'epic', 'rare', 'common'].map(tier => {
              const tierAvatars = AVATARS.filter(a => a.tier === tier);
              return (
                <div key={tier} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${tier === 'legendary' ? 'text-yellow-400' : tier === 'epic' ? 'text-purple-400' : tier === 'rare' ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium capitalize">{tier}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {tierAvatars.map((avatar) => {
                      const unlocked = isUnlocked(avatar.id);
                      const purchasable = canPurchase(avatar.id);
                      const isPurchasing = purchasing === avatar.id;
                      
                      return (
                        <div key={avatar.id} className="relative">
                          <button
                            onClick={() => unlocked ? setSelectedAvatar(avatar.id) : null}
                            disabled={!unlocked && !purchasable}
                            className={`w-full p-3 rounded-xl border-2 transition-all ${
                              !unlocked
                                ? 'border-slate-700 bg-slate-800/50 opacity-60'
                                : selectedAvatar === avatar.id
                                  ? `border-primary bg-gradient-to-br ${getTierStyles(avatar.tier)} shadow-glow`
                                  : 'border-border hover:border-primary/50 bg-card/50 hover:scale-105'
                            }`}
                          >
                            <Avatar className="w-10 h-10 mx-auto mb-1">
                              <AvatarFallback className={`text-2xl bg-transparent ${!unlocked ? 'grayscale' : ''}`}>
                                {avatar.emoji}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-center truncate">{avatar.name}</p>
                            
                            {/* Lock overlay */}
                            {!unlocked && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/40">
                                <Lock className="w-4 h-4 text-slate-400 mb-1" />
                                <span className="text-[10px] text-slate-400">{getUnlockText(avatar)}</span>
                              </div>
                            )}
                          </button>
                          
                          {/* Purchase button */}
                          {!unlocked && purchasable && (
                            <Button
                              size="sm"
                              onClick={() => handlePurchase(avatar.id)}
                              disabled={isPurchasing}
                              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-2"
                            >
                              {isPurchasing ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  {avatar.cost}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Username Edit */}
        <Card className="bg-card/80 backdrop-blur-xl border-secondary/20">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg font-semibold">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="3-16 characters"
                minLength={3}
                maxLength={16}
                className="bg-background/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground">
                {username.length}/16 characters
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="w-full bg-gradient-primary hover:shadow-neon transition-all h-12 text-lg"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
