import { AppLayout } from '@/components/layout/AppLayout';
import { WeeklyChart } from '@/components/stats/WeeklyChart';
import { AllTimeStats } from '@/components/stats/AllTimeStats';
import { SessionHistory } from '@/components/stats/SessionHistory';

export default function Stats() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Stats</h1>
          <p className="text-muted-foreground">Track your learning progress</p>
        </div>

        <WeeklyChart />
        
        <AllTimeStats />
        
        <SessionHistory />
      </div>
    </AppLayout>
  );
}
