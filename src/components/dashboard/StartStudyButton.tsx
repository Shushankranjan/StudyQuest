import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function StartStudyButton() {
  return (
    <Link to="/study" className="block">
      <Button 
        size="lg" 
        className="w-full h-14 text-lg font-semibold gap-3 animate-pulse-glow"
      >
        <Play className="h-5 w-5" />
        Start Studying
      </Button>
    </Link>
  );
}
