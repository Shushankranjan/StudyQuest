import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DailyQuest, QUEST_TEMPLATES } from '@/types/gamification';

export function useDailyQuests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: quests, isLoading } = useQuery({
    queryKey: ['daily-quests', user?.id],
    queryFn: async (): Promise<DailyQuest[]> => {
      if (!user) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_quests')
        .select('*')
        .eq('user_id', user.id)
        .eq('quest_date', today);
      
      if (error) throw error;
      return data as DailyQuest[];
    },
    enabled: !!user,
  });

  const generateQuests = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if quests already exist for today
      const { data: existing } = await supabase
        .from('daily_quests')
        .select('id')
        .eq('user_id', user.id)
        .eq('quest_date', today);
      
      if (existing && existing.length > 0) {
        return existing;
      }
      
      // Generate new quests
      const questsToInsert = QUEST_TEMPLATES.map(template => ({
        user_id: user.id,
        quest_type: template.type,
        title: template.title,
        description: template.description.replace('{target}', template.target.toString()),
        target_value: template.target,
        current_value: 0,
        xp_reward: 50,
        quest_date: today,
        completed: false,
      }));
      
      const { data, error } = await supabase
        .from('daily_quests')
        .insert(questsToInsert)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quests', user?.id] });
    },
  });

  const updateQuestProgress = useMutation({
    mutationFn: async ({ questId, newValue }: { questId: string; newValue: number }) => {
      if (!user) throw new Error('Not authenticated');
      
      const quest = quests?.find(q => q.id === questId);
      if (!quest) throw new Error('Quest not found');
      
      const completed = newValue >= quest.target_value;
      
      const { data, error } = await supabase
        .from('daily_quests')
        .update({
          current_value: newValue,
          completed,
        })
        .eq('id', questId)
        .select()
        .single();
      
      if (error) throw error;
      return { quest: data as DailyQuest, justCompleted: completed && !quest.completed };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quests', user?.id] });
    },
  });

  return {
    quests,
    isLoading,
    generateQuests,
    updateQuestProgress,
  };
}
