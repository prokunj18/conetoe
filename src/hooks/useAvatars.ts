import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { AVATARS, AvatarData } from '@/data/avatars';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const STORAGE_KEY = 'unlocked_avatars';

export const useAvatars = () => {
  const { user } = useAuth();
  const { profile, reload } = useProfile();
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load unlocked avatars
  useEffect(() => {
    const loadAvatars = async () => {
      // Default avatars are always unlocked
      const defaults = AVATARS.filter(a => a.unlockType === 'default').map(a => a.id);
      
      if (user) {
        // Load from Supabase user_cosmetics
        const { data } = await supabase
          .from('user_cosmetics')
          .select('item_id')
          .eq('user_id', user.id)
          .eq('item_type', 'avatar');
        
        const dbAvatars = data?.map(d => d.item_id) || [];
        setUnlockedAvatars([...new Set([...defaults, ...dbAvatars])]);
      } else {
        // Load from localStorage for guests
        const stored = localStorage.getItem(STORAGE_KEY);
        const localAvatars = stored ? JSON.parse(stored) : [];
        setUnlockedAvatars([...new Set([...defaults, ...localAvatars])]);
      }
      
      setLoading(false);
    };

    loadAvatars();
  }, [user]);

  // Check if an avatar is unlocked
  const isUnlocked = useCallback((avatarId: string): boolean => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (!avatar) return false;

    // Default avatars are always unlocked
    if (avatar.unlockType === 'default') return true;

    // Check if already purchased/unlocked
    if (unlockedAvatars.includes(avatarId)) return true;

    // Check level requirement
    if (avatar.unlockType === 'level' && profile) {
      return profile.level >= (avatar.unlockRequirement as number);
    }

    return false;
  }, [unlockedAvatars, profile]);

  // Check if avatar can be purchased
  const canPurchase = useCallback((avatarId: string): boolean => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (!avatar) return false;

    if (avatar.unlockType !== 'bling') return false;
    if (isUnlocked(avatarId)) return false;
    if (!profile) return false;

    return profile.coins >= (avatar.cost || 0);
  }, [isUnlocked, profile]);

  // Purchase an avatar with Bling
  const purchaseAvatar = useCallback(async (avatarId: string): Promise<boolean> => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (!avatar || !canPurchase(avatarId) || !profile) {
      toast.error('Cannot purchase this avatar');
      return false;
    }

    try {
      if (user) {
        // Deduct coins
        const newCoins = profile.coins - (avatar.cost || 0);
        await supabase
          .from('profiles')
          .update({ coins: newCoins })
          .eq('id', user.id);

        // Add to user_cosmetics
        await supabase
          .from('user_cosmetics')
          .insert({
            user_id: user.id,
            item_id: avatarId,
            item_type: 'avatar'
          });
      } else {
        // Store locally for guests
        const stored = localStorage.getItem(STORAGE_KEY);
        const local = stored ? JSON.parse(stored) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...local, avatarId]));
      }

      setUnlockedAvatars(prev => [...prev, avatarId]);
      reload();
      toast.success(`Unlocked ${avatar.name}!`);
      return true;
    } catch (error) {
      console.error('Failed to purchase avatar:', error);
      toast.error('Failed to purchase avatar');
      return false;
    }
  }, [canPurchase, profile, user, reload]);

  // Unlock avatar via achievement
  const unlockByAchievement = useCallback(async (achievementId: string): Promise<void> => {
    const avatar = AVATARS.find(a => 
      a.unlockType === 'achievement' && a.unlockRequirement === achievementId
    );
    
    if (!avatar || isUnlocked(avatar.id)) return;

    try {
      if (user) {
        await supabase
          .from('user_cosmetics')
          .insert({
            user_id: user.id,
            item_id: avatar.id,
            item_type: 'avatar'
          });
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        const local = stored ? JSON.parse(stored) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...local, avatar.id]));
      }

      setUnlockedAvatars(prev => [...prev, avatar.id]);
      toast.success(`🎉 Unlocked ${avatar.name} avatar!`, {
        description: 'Achievement reward claimed!'
      });
    } catch (error) {
      console.error('Failed to unlock avatar:', error);
    }
  }, [user, isUnlocked]);

  return {
    avatars: AVATARS,
    unlockedAvatars,
    loading,
    isUnlocked,
    canPurchase,
    purchaseAvatar,
    unlockByAchievement
  };
};
