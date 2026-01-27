import { AppLayout } from '@/components/layout/AppLayout';
import { XpLevelCard } from '@/components/dashboard/XpLevelCard';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { TodayStatsCard } from '@/components/dashboard/TodayStatsCard';
import { QuestsCard } from '@/components/dashboard/QuestsCard';
import { StartStudyButton } from '@/components/dashboard/StartStudyButton';

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Ready to level up your learning?</p>
        </div>

        <StartStudyButton />

        <div className="grid gap-6 md:grid-cols-2">
          <XpLevelCard />
          <StreakCard />
        </div>

        <TodayStatsCard />
        
        <QuestsCard />
      </div>
    </AppLayout>
  );
}
