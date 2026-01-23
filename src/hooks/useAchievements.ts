import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement, ACHIEVEMENT_DEFINITIONS, AchievementType } from '@/types/gamification';

export function useAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async (): Promise<Achievement[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });
      
      if (error) throw error;
      return data as Achievement[];
    },
    enabled: !!user,
  });

  const unlockAchievement = useMutation({
    mutationFn: async (badgeType: AchievementType) => {
      if (!user) throw new Error('Not authenticated');
      
      const definition = ACHIEVEMENT_DEFINITIONS.find(a => a.type === badgeType);
      if (!definition) throw new Error('Achievement not found');
      
      // Check if already unlocked
      const { data: existing } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge_type', badgeType)
        .single();
      
      if (existing) {
        return null; // Already unlocked
      }
      
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          badge_type: definition.type,
          badge_name: definition.name,
          badge_description: definition.description,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Achievement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements', user?.id] });
    },
  });

  const checkAndUnlockAchievements = async (profile: {
    total_xp: number;
    current_streak: number;
    total_sessions: number;
    total_minutes: number;
  }) => {
    const unlockedBadges: AchievementType[] = [];
    
    // Check streak achievements
    if (profile.current_streak >= 7) unlockedBadges.push('streak_7');
    if (profile.current_streak >= 30) unlockedBadges.push('streak_30');
    if (profile.current_streak >= 100) unlockedBadges.push('streak_100');
    
    // Check XP achievements
    if (profile.total_xp >= 1000) unlockedBadges.push('xp_1000');
    if (profile.total_xp >= 5000) unlockedBadges.push('xp_5000');
    if (profile.total_xp >= 10000) unlockedBadges.push('xp_10000');
    
    // Check session achievements
    if (profile.total_sessions >= 10) unlockedBadges.push('sessions_10');
    if (profile.total_sessions >= 50) unlockedBadges.push('sessions_50');
    if (profile.total_sessions >= 100) unlockedBadges.push('sessions_100');
    
    // Check minutes achievements
    if (profile.total_minutes >= 60) unlockedBadges.push('minutes_60');
    if (profile.total_minutes >= 600) unlockedBadges.push('minutes_600');
    if (profile.total_minutes >= 3000) unlockedBadges.push('minutes_3000');
    
    const newlyUnlocked: Achievement[] = [];
    
    for (const badge of unlockedBadges) {
      const result = await unlockAchievement.mutateAsync(badge);
      if (result) {
        newlyUnlocked.push(result);
      }
    }
    
    return newlyUnlocked;
  };

  const unlockedTypes = new Set(achievements?.map(a => a.badge_type) ?? []);

  return {
    achievements,
    isLoading,
    unlockAchievement,
    checkAndUnlockAchievements,
    unlockedTypes,
    allAchievements: ACHIEVEMENT_DEFINITIONS,
  };
}
