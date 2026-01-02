import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DailyChallenge {
  date: string;
  gameMode: 'conetoe' | 'classic';
  difficulty: 'easy' | 'normal' | 'hard' | 'master';
  bonusReward: number;
  completed: boolean;
}

const getDailySeed = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getDailyChallenge = (): Omit<DailyChallenge, 'completed'> => {
  const dateStr = getDailySeed();
  // Create a simple hash from date to determine game mode and difficulty
  const dateNum = parseInt(dateStr.replace(/-/g, ''));
  
  // Alternate between game modes based on day
  const gameMode: 'conetoe' | 'classic' = dateNum % 2 === 0 ? 'conetoe' : 'classic';
  
  // Rotate difficulties based on day of week
  const difficulties: Array<'easy' | 'normal' | 'hard' | 'master'> = ['easy', 'normal', 'hard', 'master'];
  const dayOfWeek = new Date().getDay();
  const difficulty = difficulties[dayOfWeek % 4];
  
  // Bonus reward based on difficulty
  const bonusRewards: Record<string, number> = {
    easy: 50,
    normal: 100,
    hard: 200,
    master: 400
  };
  
  return {
    date: dateStr,
    gameMode,
    difficulty,
    bonusReward: bonusRewards[difficulty]
  };
};

const STORAGE_KEY = 'daily_challenge_completion';

export const useDailyChallenge = () => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [user]);

  const loadChallenge = () => {
    const baseChallenge = getDailyChallenge();
    
    // Check localStorage for completion status
    const stored = localStorage.getItem(STORAGE_KEY);
    let completed = false;
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === baseChallenge.date && data.userId === (user?.id || 'guest')) {
          completed = data.completed;
        }
      } catch (e) {
        console.error('Error parsing daily challenge data', e);
      }
    }
    
    setChallenge({ ...baseChallenge, completed });
    setLoading(false);
  };

  const completeChallenge = async (): Promise<{ success: boolean; reward: number }> => {
    if (!challenge || challenge.completed) {
      return { success: false, reward: 0 };
    }

    // Mark as completed in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: challenge.date,
      userId: user?.id || 'guest',
      completed: true
    }));

    // Award bonus coins if user is logged in
    if (user) {
      // Use RPC to add exp
      await supabase.rpc('add_exp_and_level_up', {
        user_id: user.id,
        exp_amount: Math.floor(challenge.bonusReward / 2)
      });

      // Add coins directly
      const { data: profile } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ coins: profile.coins + challenge.bonusReward })
          .eq('id', user.id);
      }
    }

    setChallenge(prev => prev ? { ...prev, completed: true } : null);
    
    return { success: true, reward: challenge.bonusReward };
  };

  const getTimeUntilReset = (): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return {
    challenge,
    loading,
    completeChallenge,
    getTimeUntilReset,
    reload: loadChallenge
  };
};
