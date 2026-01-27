import { useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TimerDisplay } from '@/components/study/TimerDisplay';
import { DurationSelector } from '@/components/study/DurationSelector';
import { TimerControls } from '@/components/study/TimerControls';
import { XpPreview } from '@/components/study/XpPreview';
import { XpPopup } from '@/components/XpPopup';
import { LevelUpModal } from '@/components/LevelUpModal';
import { useTimer } from '@/hooks/useTimer';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useProfile } from '@/hooks/useProfile';
import { useStreak } from '@/hooks/useStreak';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { useAchievements } from '@/hooks/useAchievements';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

export default function Study() {
  const timer = useTimer(25 * 60);
  const { completeSession, todaySessionCount, todayMinutes } = useStudySessions();
  const { profile, addXp } = useProfile();
  const { updateStreak, incrementSessionCount } = useStreak();
  const { quests, updateQuestProgress } = useDailyQuests();
  const { checkAndUnlockAchievements } = useAchievements();
  const { toast } = useToast();

  const [showXpPopup, setShowXpPopup] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);

  const handleStart = () => {
    setSessionStartedAt(new Date());
    timer.start();
  };

  const handleComplete = useCallback(async () => {
    if (!profile || !sessionStartedAt) return;

    const minutes = timer.elapsedMinutes > 0 ? timer.elapsedMinutes : Math.ceil((timer.duration - timer.remaining) / 60);
    if (minutes === 0) {
      toast({
        title: 'Session too short',
        description: 'Study for at least 1 minute to earn XP.',
        variant: 'destructive',
      });
      timer.reset();
      return;
    }

    try {
      // Complete session in database
      await completeSession.mutateAsync({
        durationMinutes: minutes,
        startedAt: sessionStartedAt,
      });

      // Add XP
      const xpResult = await addXp.mutateAsync({
        amount: minutes,
        source: 'session',
      });

      // Update streak
      await updateStreak.mutateAsync();

      // Increment session count and minutes
      await incrementSessionCount.mutateAsync(minutes);

      // Update daily quests
      const newSessionCount = todaySessionCount + 1;
      const newTodayMinutes = todayMinutes + minutes;

      for (const quest of quests ?? []) {
        if (quest.completed) continue;

        let newValue = quest.current_value;

        if (quest.quest_type === 'complete_sessions') {
          newValue = newSessionCount;
        } else if (quest.quest_type === 'study_minutes') {
          newValue = newTodayMinutes;
        } else if (quest.quest_type === 'long_session' && minutes >= quest.target_value) {
          newValue = 1;
        }

        if (newValue !== quest.current_value) {
          const result = await updateQuestProgress.mutateAsync({
            questId: quest.id,
            newValue,
          });

          if (result.justCompleted) {
            // Award quest XP
            await addXp.mutateAsync({
              amount: quest.xp_reward,
              source: 'quest',
              sourceId: quest.id,
            });

            toast({
              title: `Quest Complete: ${quest.title}`,
              description: `+${quest.xp_reward} XP earned!`,
            });
          }
        }
      }

      // Check achievements
      const updatedProfile = {
        total_xp: profile.total_xp + minutes,
        current_streak: profile.current_streak + 1,
        total_sessions: profile.total_sessions + 1,
        total_minutes: profile.total_minutes + minutes,
      };

      const newAchievements = await checkAndUnlockAchievements(updatedProfile);
      
      for (const achievement of newAchievements) {
        toast({
          title: `Achievement Unlocked: ${achievement.badge_name}`,
          description: achievement.badge_description,
        });
      }

      // Show XP popup
      setXpEarned(minutes);
      setShowXpPopup(true);

      // Check for level up
      if (xpResult.leveledUp) {
        setTimeout(() => {
          setNewLevel(xpResult.newLevel);
          setShowLevelUp(true);
        }, 1600);
      }

      timer.reset();
      setSessionStartedAt(null);
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to save session. Please try again.',
        variant: 'destructive',
      });
    }
  }, [
    profile, 
    sessionStartedAt, 
    timer, 
    completeSession, 
    addXp, 
    updateStreak, 
    incrementSessionCount,
    quests, 
    updateQuestProgress, 
    todaySessionCount, 
    todayMinutes, 
    checkAndUnlockAchievements,
    toast
  ]);

  const selectedMinutes = timer.duration / 60;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Focus Session</h1>
          <p className="text-muted-foreground">Stay focused, earn XP, level up!</p>
        </div>

        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-8">
            <TimerDisplay
              formattedTime={timer.formattedRemaining}
              progress={timer.progress}
              isRunning={timer.isRunning}
              isComplete={timer.isComplete}
            />

            {!timer.isRunning && !timer.isPaused && !timer.isComplete && (
              <>
                <DurationSelector
                  selectedDuration={timer.duration}
                  onSelect={timer.setDuration}
                />
                <XpPreview minutes={selectedMinutes} />
              </>
            )}

            <TimerControls
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              isComplete={timer.isComplete}
              onStart={handleStart}
              onPause={timer.pause}
              onResume={timer.resume}
              onReset={timer.reset}
              onComplete={handleComplete}
            />
          </CardContent>
        </Card>
      </div>

      {showXpPopup && (
        <XpPopup 
          amount={xpEarned} 
          onComplete={() => setShowXpPopup(false)} 
        />
      )}

      <LevelUpModal
        open={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        newLevel={newLevel}
      />
    </AppLayout>
  );
}
