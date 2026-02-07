import React, { useState, useRef } from 'react';
import { ShieldAlert, ShieldOff } from 'lucide-react';
import { useSOS } from '@/context/SOSContext';

export function SOSButton() {
  const { appState, triggerSOS, deactivateSOS } = useSOS();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const HOLD_DURATION = 2000; // 2 seconds to activate

  const handleStart = () => {
    if (appState.isSOSActive) return;
    
    startTimeRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        clearInterval(holdTimerRef.current!);
        triggerSOS('manual');
        setHoldProgress(0);
      }
    }, 16);
  };

  const handleEnd = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setHoldProgress(0);
  };

  if (appState.isSOSActive) {
    return (
      <button
        onClick={deactivateSOS}
        className="relative w-32 h-32 rounded-full bg-alert/20 border-4 border-alert flex items-center justify-center transition-all active:scale-95 shadow-glow-alert"
      >
        <div className="absolute inset-0 rounded-full pulse-alert" />
        <div className="text-center">
          <ShieldOff className="w-10 h-10 text-alert mx-auto mb-1" />
          <span className="text-xs font-medium text-alert">DEACTIVATE</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      className="relative w-32 h-32 rounded-full bg-card border-4 border-armed/50 flex items-center justify-center transition-all active:scale-95 hover:border-armed"
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="60"
          fill="none"
          stroke="hsl(var(--armed))"
          strokeWidth="4"
          strokeDasharray={`${holdProgress * 377} 377`}
          className="transition-all"
        />
      </svg>
      
      <div className="text-center z-10">
        <ShieldAlert className="w-10 h-10 text-armed mx-auto mb-1" />
        <span className="text-xs font-medium text-armed">HOLD FOR SOS</span>
      </div>
    </button>
  );
}
