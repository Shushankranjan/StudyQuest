import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  Star, 
  Trophy, 
  Clock, 
  Target,
  Zap,
  Crown,
  Medal,
  Award,
  Sparkles,
  Timer,
  Rocket
} from 'lucide-react';

interface AchievementCardProps {
  type: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  streak_7: Flame,
  streak_30: Flame,
  streak_100: Crown,
  xp_1000: Star,
  xp_5000: Zap,
  xp_10000: Trophy,
  sessions_10: Target,
  sessions_50: Medal,
  sessions_100: Award,
  minutes_60: Clock,
  minutes_600: Timer,
  minutes_3000: Rocket,
};

const BADGE_COLORS: Record<string, string> = {
  streak_7: 'text-streak bg-streak/10',
  streak_30: 'text-streak bg-streak/10',
  streak_100: 'text-streak bg-streak/10',
  xp_1000: 'text-xp bg-xp/10',
  xp_5000: 'text-xp bg-xp/10',
  xp_10000: 'text-xp bg-xp/10',
  sessions_10: 'text-success bg-success/10',
  sessions_50: 'text-success bg-success/10',
  sessions_100: 'text-success bg-success/10',
  minutes_60: 'text-primary bg-primary/10',
  minutes_600: 'text-primary bg-primary/10',
  minutes_3000: 'text-primary bg-primary/10',
};

export function AchievementCard({ type, name, description, unlocked, unlockedAt }: AchievementCardProps) {
  const Icon = BADGE_ICONS[type] || Sparkles;
  const colorClass = BADGE_COLORS[type] || 'text-muted-foreground bg-muted';

  return (
    <Card className={cn(
      "transition-all duration-300",
      unlocked 
        ? "border-2 border-success/30 shadow-md" 
        : "opacity-50 grayscale"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl",
            unlocked ? colorClass : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold",
              !unlocked && "text-muted-foreground"
            )}>
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
            {unlocked && unlockedAt && (
              <p className="text-xs text-success mt-1">
                Unlocked {new Date(unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {unlocked && (
            <div className="text-success">
              <Award className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
