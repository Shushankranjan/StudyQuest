import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onComplete: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  isComplete,
  onStart,
  onPause,
  onResume,
  onReset,
  onComplete,
}: TimerControlsProps) {
  if (isComplete) {
    return (
      <div className="flex gap-3">
        <Button onClick={onComplete} size="lg" className="gap-2">
          <Check className="h-5 w-5" />
          Claim XP
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="h-5 w-5" />
          New Session
        </Button>
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className="flex gap-3">
        <Button onClick={onPause} variant="outline" size="lg" className="gap-2">
          <Pause className="h-5 w-5" />
          Pause
        </Button>
        <Button onClick={onComplete} variant="secondary" size="lg" className="gap-2">
          <Check className="h-5 w-5" />
          End Early
        </Button>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="flex gap-3">
        <Button onClick={onResume} size="lg" className="gap-2">
          <Play className="h-5 w-5" />
          Resume
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="h-5 w-5" />
          Reset
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onStart} size="lg" className="gap-2 px-8">
      <Play className="h-5 w-5" />
      Start Session
    </Button>
  );
}
