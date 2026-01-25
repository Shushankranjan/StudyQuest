import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface XpPopupProps {
  amount: number;
  onComplete?: () => void;
}

export function XpPopup({ amount, onComplete }: XpPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-xp-popup flex items-center gap-2 bg-xp text-xp-foreground px-6 py-3 rounded-full text-xl font-bold shadow-lg">
        <Sparkles className="h-6 w-6" />
        +{amount} XP
      </div>
    </div>
  );
}
