import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

export function XpLevelCard() {
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

  const xpInCurrentLevel = profile.total_xp % 500;
  const xpToNextLevel = 500;
  const progress = (xpInCurrentLevel / xpToNextLevel) * 100;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-level">{profile.level}</span>
              <Star className="h-6 w-6 text-level fill-level" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="text-2xl font-bold text-xp">{profile.total_xp.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {profile.level + 1}</span>
            <span className="font-medium">{xpInCurrentLevel} / {xpToNextLevel} XP</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
}
