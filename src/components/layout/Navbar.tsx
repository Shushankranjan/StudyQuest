import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Home, Clock, BarChart3, Trophy, LogOut, Flame } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/study', label: 'Study', icon: Clock },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/achievements', label: 'Badges', icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              S
            </div>
            <span className="font-semibold text-lg hidden sm:inline">StudyQuest</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {profile && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-streak">
                <Flame className="h-4 w-4 animate-streak-flame" />
                <span className="font-semibold">{profile.current_streak}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xp font-semibold">{profile.total_xp} XP</span>
                <span className="text-muted-foreground">• Lv {profile.level}</span>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex justify-around border-t py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
