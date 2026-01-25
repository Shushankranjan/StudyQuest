import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, Zap, Calendar } from 'lucide-react';

export function AllTimeStats() {
  const { profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Total Minutes',
      value: profile.total_minutes.toLocaleString(),
      icon: Clock,
      color: 'text-primary',
    },
    {
      label: 'Total Sessions',
      value: profile.total_sessions.toLocaleString(),
      icon: Target,
      color: 'text-success',
    },
    {
      label: 'Total XP',
      value: profile.total_xp.toLocaleString(),
      icon: Zap,
      color: 'text-xp',
    },
    {
      label: 'Best Streak',
      value: profile.current_streak.toString(),
      icon: Calendar,
      color: 'text-streak',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">All-Time Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/50">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
