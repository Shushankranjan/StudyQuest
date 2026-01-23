import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState } from '@/types/gamification';

export function useTimer(initialDuration: number = 25 * 60) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    duration: initialDuration,
    remaining: initialDuration,
    startedAt: null,
  });

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimerInterval();
    
    const now = Date.now();
    startTimeRef.current = now;
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startedAt: new Date(),
      remaining: pausedRemainingRef.current ?? prev.duration,
    }));
    
    pausedRemainingRef.current = null;
  }, [clearTimerInterval]);

  const pause = useCallback(() => {
    clearTimerInterval();
    
    setState(prev => {
      pausedRemainingRef.current = prev.remaining;
      return {
        ...prev,
        isRunning: false,
        isPaused: true,
      };
    });
  }, [clearTimerInterval]);

  const resume = useCallback(() => {
    start();
  }, [start]);

  const reset = useCallback(() => {
    clearTimerInterval();
    pausedRemainingRef.current = null;
    startTimeRef.current = null;
    
    setState(prev => ({
      isRunning: false,
      isPaused: false,
      duration: prev.duration,
      remaining: prev.duration,
      startedAt: null,
    }));
  }, [clearTimerInterval]);

  const setDuration = useCallback((seconds: number) => {
    clearTimerInterval();
    pausedRemainingRef.current = null;
    startTimeRef.current = null;
    
    setState({
      isRunning: false,
      isPaused: false,
      duration: seconds,
      remaining: seconds,
      startedAt: null,
    });
  }, [clearTimerInterval]);

  // Timer tick effect - runs in background
  useEffect(() => {
    if (!state.isRunning) return;

    const tick = () => {
      setState(prev => {
        if (!prev.isRunning) return prev;
        
        const newRemaining = Math.max(0, prev.remaining - 1);
        
        if (newRemaining === 0) {
          clearTimerInterval();
          return {
            ...prev,
            remaining: 0,
            isRunning: false,
          };
        }
        
        return {
          ...prev,
          remaining: newRemaining,
        };
      });
    };

    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      clearTimerInterval();
    };
  }, [state.isRunning, clearTimerInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = state.duration > 0 
    ? ((state.duration - state.remaining) / state.duration) * 100 
    : 0;

  const elapsedMinutes = Math.floor((state.duration - state.remaining) / 60);

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
    setDuration,
    formatTime,
    formattedRemaining: formatTime(state.remaining),
    progress,
    elapsedMinutes,
    isComplete: state.remaining === 0 && state.duration > 0,
  };
}
