import React from 'react';
import { Shield, ShieldAlert, ShieldOff } from 'lucide-react';
import { useSOS } from '@/context/SOSContext';

export function StatusIndicator() {
  const { appState } = useSOS();

  if (appState.isSOSActive) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-alert/10 border border-alert/20">
        <div className="relative">
          <ShieldAlert className="w-6 h-6 text-alert" />
          <div className="absolute inset-0 rounded-full pulse-alert" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-alert">SOS Active</p>
          <p className="text-xs text-alert/70">Recording & sharing location</p>
        </div>
      </div>
    );
  }

  if (appState.isArmed) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-armed/10 border border-armed/20">
        <div className="relative">
          <Shield className="w-6 h-6 text-armed" />
          <div className="absolute inset-0 rounded-full pulse-armed" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-armed">Armed</p>
          <p className="text-xs text-armed/70">Ready to protect</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border">
      <ShieldOff className="w-6 h-6 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">Disarmed</p>
        <p className="text-xs text-muted-foreground/70">Protection inactive</p>
      </div>
    </div>
  );
}
