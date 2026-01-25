import { useEffect } from 'react';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuestsCard() {
  const { quests, isLoading, generateQuests } = useDailyQuests();

  useEffect(() => {
    // Generate quests if none exist for today
    if (!isLoading && (!quests || quests.length === 0)) {
      generateQuests.mutate();
    }
  }, [isLoading, quests, generateQuests]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = quests?.filter(q => q.completed).length ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-quest" />
            Daily Quests
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{quests?.length ?? 3} completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {quests?.map((quest) => {
          const progress = Math.min((quest.current_value / quest.target_value) * 100, 100);
          
          return (
            <div
              key={quest.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                quest.completed 
                  ? "bg-success/5 border-success/20" 
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {quest.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={cn(
                      "font-medium text-sm",
                      quest.completed && "line-through text-muted-foreground"
                    )}>
                      {quest.title}
                    </h4>
                    <span className="text-xs font-medium text-xp">+{quest.xp_reward} XP</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {quest.description}
                  </p>
                  {!quest.completed && (
                    <div className="mt-2 space-y-1">
                      <Progress value={progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">
                        {quest.current_value} / {quest.target_value}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
