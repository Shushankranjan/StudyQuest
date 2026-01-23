import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from './useProfile';

export function useStreak() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const updateStreak = useMutation({
    mutationFn: async () => {
      if (!user || !profile) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      const lastSessionDate = profile.last_session_date;
      
      let newStreak = profile.current_streak;
      
      if (!lastSessionDate) {
        // First session ever
        newStreak = 1;
      } else if (lastSessionDate === today) {
        // Already studied today, streak unchanged
        return { streak: newStreak, updated: false };
      } else {
        const lastDate = new Date(lastSessionDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day - increment streak
          newStreak = profile.current_streak + 1;
        } else if (diffDays > 1) {
          // Missed days - reset streak
          newStreak = 1;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          last_session_date: today,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      return { streak: newStreak, updated: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const incrementSessionCount = useMutation({
    mutationFn: async (minutes: number) => {
      if (!user || !profile) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          total_sessions: profile.total_sessions + 1,
          total_minutes: profile.total_minutes + minutes,
        })
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return {
    updateStreak,
    incrementSessionCount,
    currentStreak: profile?.current_streak ?? 0,
  };
}
