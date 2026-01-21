export interface Profile {
  id: string;
  email: string | null;
  total_xp: number;
  level: number;
  current_streak: number;
  last_session_date: string | null;
  total_sessions: number;
  total_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  duration_minutes: number;
  xp_earned: number;
  started_at: string;
  completed_at: string;
  created_at: string;
}

export interface DailyQuest {
  id: string;
  user_id: string;
  quest_type: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  xp_reward: number;
  quest_date: string;
  completed: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  unlocked_at: string;
}

export interface XpLog {
  id: string;
  user_id: string;
  xp_amount: number;
  source: 'session' | 'quest' | 'mission' | 'achievement';
  source_id: string | null;
  created_at: string;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  duration: number; // in seconds
  remaining: number; // in seconds
  startedAt: Date | null;
}

export const ACHIEVEMENT_DEFINITIONS = [
  // Streak achievements
  { type: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', requirement: 7 },
  { type: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', requirement: 30 },
  { type: 'streak_100', name: 'Centurion', description: 'Maintain a 100-day streak', requirement: 100 },
  
  // XP achievements
  { type: 'xp_1000', name: 'XP Explorer', description: 'Earn 1,000 total XP', requirement: 1000 },
  { type: 'xp_5000', name: 'XP Hunter', description: 'Earn 5,000 total XP', requirement: 5000 },
  { type: 'xp_10000', name: 'XP Champion', description: 'Earn 10,000 total XP', requirement: 10000 },
  
  // Session achievements
  { type: 'sessions_10', name: 'Getting Started', description: 'Complete 10 study sessions', requirement: 10 },
  { type: 'sessions_50', name: 'Dedicated Learner', description: 'Complete 50 study sessions', requirement: 50 },
  { type: 'sessions_100', name: 'Study Master', description: 'Complete 100 study sessions', requirement: 100 },
  
  // Minutes achievements
  { type: 'minutes_60', name: 'First Hour', description: 'Study for 60 total minutes', requirement: 60 },
  { type: 'minutes_600', name: '10 Hour Club', description: 'Study for 10 total hours', requirement: 600 },
  { type: 'minutes_3000', name: '50 Hour Legend', description: 'Study for 50 total hours', requirement: 3000 },
] as const;

export type AchievementType = typeof ACHIEVEMENT_DEFINITIONS[number]['type'];

export const QUEST_TEMPLATES = [
  {
    type: 'complete_sessions',
    title: 'Session Sprint',
    description: 'Complete {target} Pomodoro sessions today',
    target: 2,
  },
  {
    type: 'study_minutes',
    title: 'Time Warrior',
    description: 'Study for {target} minutes today',
    target: 50,
  },
  {
    type: 'long_session',
    title: 'Deep Focus',
    description: 'Complete a session of {target}+ minutes',
    target: 45,
  },
] as const;
