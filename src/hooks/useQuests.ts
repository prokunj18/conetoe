import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { QUESTS, Quest, QuestTier } from '@/data/quests';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuestProgress {
  [questId: string]: {
    current: number;
    completed: boolean;
    claimed: boolean;
  };
}

interface QuestState {
  daily: Quest[];
  weekly: Quest[];
  epic: Quest[];
  progress: QuestProgress;
}

const STORAGE_KEY = 'quest_progress';
const DAILY_RESET_KEY = 'quest_daily_reset';
const WEEKLY_RESET_KEY = 'quest_weekly_reset';

export const useQuests = () => {
  const { user } = useAuth();
  const [state, setState] = useState<QuestState>({
    daily: QUESTS.filter(q => q.tier === 'daily'),
    weekly: QUESTS.filter(q => q.tier === 'weekly'),
    epic: QUESTS.filter(q => q.tier === 'epic'),
    progress: {}
  });
  const [loading, setLoading] = useState(true);

  // Check if reset is needed
  const checkReset = useCallback(() => {
    const now = new Date();
    const today = now.toDateString();
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekKey = startOfWeek.toDateString();

    const lastDailyReset = localStorage.getItem(DAILY_RESET_KEY);
    const lastWeeklyReset = localStorage.getItem(WEEKLY_RESET_KEY);

    let shouldResetDaily = lastDailyReset !== today;
    let shouldResetWeekly = lastWeeklyReset !== weekKey;

    if (shouldResetDaily || shouldResetWeekly) {
      const stored = localStorage.getItem(STORAGE_KEY);
      let progress: QuestProgress = stored ? JSON.parse(stored) : {};

      if (shouldResetDaily) {
        // Reset daily quests
        QUESTS.filter(q => q.tier === 'daily').forEach(quest => {
          progress[quest.id] = { current: 0, completed: false, claimed: false };
        });
        localStorage.setItem(DAILY_RESET_KEY, today);
      }

      if (shouldResetWeekly) {
        // Reset weekly quests
        QUESTS.filter(q => q.tier === 'weekly').forEach(quest => {
          progress[quest.id] = { current: 0, completed: false, claimed: false };
        });
        localStorage.setItem(WEEKLY_RESET_KEY, weekKey);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return progress;
    }

    return null;
  }, []);

  // Load quests
  useEffect(() => {
    const resetProgress = checkReset();
    
    if (resetProgress) {
      setState(prev => ({ ...prev, progress: resetProgress }));
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(prev => ({ ...prev, progress: JSON.parse(stored) }));
      }
    }
    
    setLoading(false);
  }, [checkReset]);

  // Update progress for a tracking key
  const updateProgress = useCallback((trackingKey: string, value: number = 1, absolute: boolean = false) => {
    setState(prev => {
      const newProgress = { ...prev.progress };
      
      QUESTS.forEach(quest => {
        if (quest.trackingKey === trackingKey) {
          const current = newProgress[quest.id]?.current || 0;
          const newValue = absolute ? value : current + value;
          const completed = newValue >= quest.target;
          
          newProgress[quest.id] = {
            current: Math.min(newValue, quest.target),
            completed,
            claimed: newProgress[quest.id]?.claimed || false
          };
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return { ...prev, progress: newProgress };
    });
  }, []);

  // Claim reward for a quest
  const claimReward = useCallback(async (questId: string): Promise<boolean> => {
    const quest = QUESTS.find(q => q.id === questId);
    const progress = state.progress[questId];

    if (!quest || !progress?.completed || progress.claimed) {
      return false;
    }

    try {
      if (user) {
        // Add coins
        const { data: profile } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', user.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ coins: profile.coins + quest.reward.bling })
            .eq('id', user.id);
        }

        // Add exp
        await supabase.rpc('add_exp_and_level_up', {
          user_id: user.id,
          exp_amount: quest.reward.exp
        });
      }

      setState(prev => {
        const newProgress = { ...prev.progress };
        newProgress[questId] = { ...newProgress[questId], claimed: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
        return { ...prev, progress: newProgress };
      });

      toast.success(`Claimed ${quest.reward.bling} Bling + ${quest.reward.exp} XP!`);
      return true;
    } catch (error) {
      console.error('Failed to claim quest reward:', error);
      toast.error('Failed to claim reward');
      return false;
    }
  }, [state.progress, user]);

  const getQuestProgress = (questId: string) => {
    return state.progress[questId] || { current: 0, completed: false, claimed: false };
  };

  const getActiveQuests = (tier?: QuestTier) => {
    const quests = tier ? QUESTS.filter(q => q.tier === tier) : QUESTS;
    return quests.filter(q => {
      const progress = getQuestProgress(q.id);
      return !progress.claimed;
    });
  };

  return {
    quests: state,
    loading,
    updateProgress,
    claimReward,
    getQuestProgress,
    getActiveQuests
  };
};
