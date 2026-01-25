import { useStudySessions } from '@/hooks/useStudySessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SessionHistory() {
  const { sessions, isLoading } = useStudySessions();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentSessions = sessions?.slice(0, 10) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentSessions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No sessions yet. Start studying to see your history!
          </p>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{session.duration_minutes} minutes</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(session.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xp">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">+{session.xp_earned}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
