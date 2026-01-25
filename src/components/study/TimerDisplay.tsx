import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  formattedTime: string;
  progress: number;
  isRunning: boolean;
  isComplete: boolean;
}

export function TimerDisplay({ formattedTime, progress, isRunning, isComplete }: TimerDisplayProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-64 h-64 sm:w-80 sm:h-80" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "timer-circle transition-all duration-1000",
            isComplete ? "text-success" : "text-primary"
          )}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={cn(
            "text-5xl sm:text-6xl font-mono font-bold tracking-tight",
            isComplete && "text-success"
          )}
        >
          {formattedTime}
        </span>
        <span className="text-sm text-muted-foreground mt-2">
          {isComplete ? "Session Complete!" : isRunning ? "Studying..." : "Ready"}
        </span>
      </div>
    </div>
  );
}
