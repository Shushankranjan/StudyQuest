import { Sparkles } from 'lucide-react';

interface XpPreviewProps {
  minutes: number;
}

export function XpPreview({ minutes }: XpPreviewProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      <Sparkles className="h-4 w-4 text-xp" />
      <span className="text-sm">
        You'll earn <span className="font-semibold text-xp">~{minutes} XP</span>
      </span>
    </div>
  );
}
