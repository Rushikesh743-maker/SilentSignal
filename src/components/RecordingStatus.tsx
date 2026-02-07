import React from 'react';
import { Mic, MicOff, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingStatusProps {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  onStop: () => void;
}

export function RecordingStatus({ isRecording, duration, audioUrl, onStop }: RecordingStatusProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioUrl && !isRecording) {
    return (
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-armed/10 flex items-center justify-center">
            <Mic className="w-5 h-5 text-armed" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Recording Saved</p>
            <p className="text-xs text-muted-foreground">{formatDuration(duration)}</p>
          </div>
        </div>
        <audio src={audioUrl} controls className="w-full h-10" />
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="p-4 rounded-xl bg-alert/10 border border-alert/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-alert/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-alert" />
              </div>
              <div className="absolute inset-0 rounded-full bg-alert/30 animate-ping" />
            </div>
            <div>
              <p className="text-sm font-medium text-alert">Recording Audio</p>
              <p className="text-xs text-alert/70 font-mono">{formatDuration(duration)}</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={onStop}
            className="bg-alert hover:bg-alert/90"
          >
            <Square className="w-4 h-4 mr-1" />
            Stop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-muted border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <MicOff className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">No Recording</p>
          <p className="text-xs text-muted-foreground/70">Audio starts with SOS</p>
        </div>
      </div>
    </div>
  );
}
