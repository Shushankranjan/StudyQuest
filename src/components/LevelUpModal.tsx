import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface LevelUpModalProps {
  open: boolean;
  onClose: () => void;
  newLevel: number;
}

export function LevelUpModal({ open, onClose, newLevel }: LevelUpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Level Up! 🎉</DialogTitle>
        </DialogHeader>
        <div className="py-8">
          <div className="animate-level-up inline-flex items-center justify-center w-24 h-24 rounded-full bg-level/20 mb-4">
            <Star className="h-12 w-12 text-level fill-level" />
          </div>
          <p className="text-4xl font-bold text-level mb-2">Level {newLevel}</p>
          <p className="text-muted-foreground">
            Congratulations! Keep up the amazing work!
          </p>
        </div>
        <Button onClick={onClose} className="w-full">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
