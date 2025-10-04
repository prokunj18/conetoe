import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const avatarOptions = [
  { id: 'avatar1', emoji: '🤖', name: 'Robot' },
  { id: 'avatar2', emoji: '👨‍🚀', name: 'Astronaut' },
  { id: 'avatar3', emoji: '⚔️', name: 'Knight' },
  { id: 'avatar4', emoji: '🧙', name: 'Wizard' },
  { id: 'avatar5', emoji: '🥷', name: 'Ninja' },
  { id: 'avatar6', emoji: '🏴‍☠️', name: 'Pirate' },
  { id: 'avatar7', emoji: '🔬', name: 'Scientist' },
  { id: 'avatar8', emoji: '🧭', name: 'Explorer' },
];

const Account = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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

  if (loading || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const expNeeded = profile.level * 100;
  const expProgress = (profile.exp / expNeeded) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <Card className="w-full max-w-2xl z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl">Account</CardTitle>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>
            Level {profile.level} • {profile.total_wins} Wins • {profile.total_games} Games
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Experience</Label>
            <div className="space-y-1">
              <Progress value={expProgress} />
              <p className="text-sm text-muted-foreground text-center">
                {profile.exp} / {expNeeded} XP
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Choose Avatar</Label>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAvatar === avatar.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Avatar className="w-12 h-12 mx-auto mb-1">
                    <AvatarFallback className="text-2xl">{avatar.emoji}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-center">{avatar.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="3-16 characters"
              minLength={3}
              maxLength={16}
            />
            <p className="text-xs text-muted-foreground">
              {username.length}/16 characters
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
