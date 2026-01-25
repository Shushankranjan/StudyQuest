import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DurationSelectorProps {
  selectedDuration: number;
  onSelect: (seconds: number) => void;
  disabled?: boolean;
}

const PRESET_DURATIONS = [
  { label: '15 min', seconds: 15 * 60 },
  { label: '25 min', seconds: 25 * 60 },
  { label: '45 min', seconds: 45 * 60 },
  { label: '60 min', seconds: 60 * 60 },
];

export function DurationSelector({ selectedDuration, onSelect, disabled }: DurationSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {PRESET_DURATIONS.map((preset) => (
        <Button
          key={preset.seconds}
          variant={selectedDuration === preset.seconds ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(preset.seconds)}
          disabled={disabled}
          className={cn(
            "min-w-[80px]",
            selectedDuration === preset.seconds && "ring-2 ring-primary ring-offset-2"
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
