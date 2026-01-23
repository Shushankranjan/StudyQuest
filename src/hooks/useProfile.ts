import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/gamification';

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const addXp = useMutation({
    mutationFn: async ({ amount, source, sourceId }: { amount: number; source: string; sourceId?: string }) => {
      if (!user || !profile) throw new Error('Not authenticated');
      
      const newTotalXp = profile.total_xp + amount;
      const newLevel = Math.floor(newTotalXp / 500) + 1;
      
      // Update profile
      await supabase
        .from('profiles')
        .update({
          total_xp: newTotalXp,
          level: newLevel,
        })
        .eq('id', user.id);
      
      // Log XP
      await supabase
        .from('xp_log')
        .insert({
          user_id: user.id,
          xp_amount: amount,
          source,
          source_id: sourceId,
        });
      
      return { newTotalXp, newLevel, leveledUp: newLevel > profile.level };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    addXp,
  };
}
