import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  exp: number;
  total_wins: number;
  total_games: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      await loadProfile();
    }

    return { error };
  };

  const addExpAndLevelUp = async (expAmount: number) => {
    if (!user) return null;

    const { data, error } = await supabase.rpc('add_exp_and_level_up', {
      user_id: user.id,
      exp_amount: expAmount
    });

    if (!error && data) {
      await loadProfile();
      return data;
    }

    return null;
  };

  return { profile, loading, updateProfile, addExpAndLevelUp, reload: loadProfile };
};
