import { AppLayout } from '@/components/layout/AppLayout';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy } from 'lucide-react';

export default function Achievements() {
  const { achievements, allAchievements, unlockedTypes, isLoading } = useAchievements();

  const unlockedCount = achievements?.length ?? 0;
  const totalCount = allAchievements.length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-level/10">
              <Trophy className="h-8 w-8 text-level" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            {unlockedCount} of {totalCount} badges unlocked
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {allAchievements.map((definition) => {
              const unlocked = unlockedTypes.has(definition.type);
              const achievement = achievements?.find(a => a.badge_type === definition.type);
              
              return (
                <AchievementCard
                  key={definition.type}
                  type={definition.type}
                  name={definition.name}
                  description={definition.description}
                  unlocked={unlocked}
                  unlockedAt={achievement?.unlocked_at}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
