import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { StudySession } from '@/types/gamification';

export function useStudySessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async (): Promise<StudySession[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      return data as StudySession[];
    },
    enabled: !!user,
  });

  const { data: todaySessions } = useQuery({
    queryKey: ['today-sessions', user?.id],
    queryFn: async (): Promise<StudySession[]> => {
      if (!user) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', today);
      
      if (error) throw error;
      return data as StudySession[];
    },
    enabled: !!user,
  });

  const { data: weekSessions } = useQuery({
    queryKey: ['week-sessions', user?.id],
    queryFn: async (): Promise<StudySession[]> => {
      if (!user) return [];
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', weekAgo.toISOString());
      
      if (error) throw error;
      return data as StudySession[];
    },
    enabled: !!user,
  });

  const completeSession = useMutation({
    mutationFn: async ({ durationMinutes, startedAt }: { durationMinutes: number; startedAt: Date }) => {
      if (!user) throw new Error('Not authenticated');
      
      const xpEarned = durationMinutes; // 1 XP per minute
      
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          duration_minutes: durationMinutes,
          xp_earned: xpEarned,
          started_at: startedAt.toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as StudySession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['today-sessions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['week-sessions', user?.id] });
    },
  });

  const todayMinutes = todaySessions?.reduce((acc, s) => acc + s.duration_minutes, 0) ?? 0;
  const todaySessionCount = todaySessions?.length ?? 0;

  return {
    sessions,
    todaySessions,
    weekSessions,
    isLoading,
    completeSession,
    todayMinutes,
    todaySessionCount,
  };
}
