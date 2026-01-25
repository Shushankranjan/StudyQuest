import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export function StreakCard() {
  const { profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const getMessage = () => {
    if (profile.current_streak === 0) return "Start your streak today!";
    if (profile.current_streak < 7) return "Keep it going!";
    if (profile.current_streak < 30) return "Amazing consistency!";
    if (profile.current_streak < 100) return "You're on fire!";
    return "Legendary dedication!";
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-streak/10 to-background">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-streak">{profile.current_streak}</span>
              <span className="text-lg text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{getMessage()}</p>
          </div>
          <div className="relative">
            <Flame 
              className={`h-16 w-16 ${profile.current_streak > 0 ? 'text-streak animate-streak-flame' : 'text-muted-foreground/30'}`}
              fill={profile.current_streak > 0 ? 'currentColor' : 'none'}
            />
            {profile.current_streak >= 7 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-xp text-xp-foreground text-xs font-bold flex items-center justify-center">
                🔥
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
