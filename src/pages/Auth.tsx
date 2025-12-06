import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isProcessingRecovery, setIsProcessingRecovery] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle password recovery from email link - extract and process tokens from URL
  useEffect(() => {
    const handleRecovery = async () => {
      const type = searchParams.get('type');
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      if (type === 'recovery') {
        setIsProcessingRecovery(true);
        
        // If we have tokens in the URL hash, set the session
        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('Session error:', error);
              toast({
                title: 'Session Error',
                description: 'Could not establish session. Please try the reset link again.',
                variant: 'destructive'
              });
              setIsProcessingRecovery(false);
              return;
            }
            
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname + '?type=recovery');
            setIsResetPassword(true);
          } catch (err) {
            console.error('Recovery error:', err);
            toast({
              title: 'Error',
              description: 'Failed to process recovery link.',
              variant: 'destructive'
            });
          }
        } else {
          // No tokens but recovery type - check if we already have a session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsResetPassword(true);
          }
        }
        setIsProcessingRecovery(false);
      }
    };
    
    handleRecovery();
  }, [searchParams, toast]);

  useEffect(() => {
    if (user && !isResetPassword && !isProcessingRecovery) {
      navigate('/');
    }
  }, [user, navigate, isResetPassword, isProcessingRecovery]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Password updated!',
        description: 'Your password has been successfully reset.',
      });
      
      setIsResetPassword(false);
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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
          title: 'Check your email!',
          description: 'We sent you a password reset link.',
        });
        setIsForgotPassword(false);
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw error;
        }

        if (!data.user) {
          throw new Error('Sign in failed. Please try again.');
        }
        
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

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('This email is already registered. Try signing in instead.');
          }
          throw error;
        }

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
      console.error('Auth error:', error);
      toast({
        title: isForgotPassword ? 'Reset Error' : isLogin ? 'Sign In Failed' : 'Sign Up Failed',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while processing recovery
  if (isProcessingRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Processing recovery link...</p>
        </div>
      </div>
    );
  }

  // Password reset form
  if (isResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="w-full max-w-md z-10 bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Reset Password</h2>
          <p className="text-center text-slate-400 mb-8">Enter your new password</p>
          
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="pl-12 pr-12 py-6 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </Button>
      
      {/* Left Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Glass card */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
                CONETOE
              </h1>
              <p className="text-slate-400">
                {isForgotPassword 
                  ? 'Reset your password' 
                  : isLogin 
                    ? 'Welcome back, player!' 
                    : 'Join the game!'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {/* Username field (signup only) */}
              {!isLogin && !isForgotPassword && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-amber-400 transition-colors" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="pl-12 py-6 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                    minLength={3}
                    maxLength={16}
                    required={!isLogin}
                  />
                </div>
              )}
              
              {/* Email field */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-amber-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="pl-12 py-6 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                  required
                />
              </div>

              {/* Password field */}
              {!isForgotPassword && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-amber-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="pl-12 pr-12 py-6 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20 transition-all"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading 
                  ? 'Please wait...' 
                  : isForgotPassword 
                    ? 'Send Reset Link' 
                    : isLogin 
                      ? 'Enter' 
                      : 'Create Account'}
              </Button>

              {/* Forgot Password Link */}
              {isLogin && !isForgotPassword && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="w-full text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot Password?
                </button>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              <span className="text-slate-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>

            {/* Toggle Sign In/Up */}
            <div className="text-center">
              <p className="text-slate-400">
                {isForgotPassword 
                  ? 'Remember your password?' 
                  : isLogin 
                    ? "Don't have an account?" 
                    : 'Already have an account?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (isForgotPassword) {
                    setIsForgotPassword(false);
                  } else {
                    setIsLogin(!isLogin);
                  }
                }}
                className="mt-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                {isForgotPassword ? 'Sign In' : isLogin ? 'Register' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding/Illustration */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-purple-500/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-500/20 animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-amber-500/20 animate-spin-slow" style={{ animationDuration: '10s' }} />
        </div>
        
        {/* Main content */}
        <div className="relative z-10 text-center p-8">
          {/* Game logo/icon */}
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto relative">
              {/* Cone representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-amber-500 drop-shadow-2xl transform hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-orange-400 transform translate-y-2" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full" />
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-4">
            Ready to <span className="text-amber-400">Play?</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-md mx-auto">
            Master the board, stack your cones, and become the ultimate champion!
          </p>
          
          {/* Features list */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-slate-300 justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Compete with players worldwide</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 justify-center">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Unlock rare cone designs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Climb the leaderboards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
