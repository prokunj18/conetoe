import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?type=recovery`,
        });

        if (error) throw error;

        toast({
          title: 'Password reset email sent!',
          description: 'Check your email and click the link to reset your password',
        });
        setIsForgotPassword(false);
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({ title: 'Welcome back!' });
        navigate('/');
      } else {
        if (username.length < 3 || username.length > 16) {
          toast({ 
            title: 'Invalid username', 
            description: 'Username must be 3-16 characters',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;

        // Create profile after signup
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username,
            avatar: 'avatar1'
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        toast({ 
          title: 'Account created!',
          description: 'Welcome to CONETOE!'
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <Button
        variant="outline"
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-20 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      
      <Card className="w-full max-w-md z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">CONETOE</CardTitle>
          <CardDescription className="text-center">
            {isForgotPassword ? 'Reset your password' : isLogin ? 'Welcome back!' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="3-16 characters"
                  minLength={3}
                  maxLength={16}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            {isLogin && !isForgotPassword && (
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                } else {
                  setIsLogin(!isLogin);
                }
              }}
            >
              {isForgotPassword ? 'Back to Sign In' : isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
