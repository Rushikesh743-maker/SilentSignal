import React from 'react';
import { MapPin, Mic, Clock, Trash2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SOSSession } from '@/types';

interface SessionLogProps {
  session: SOSSession;
  onDelete: (id: string) => void;
}

export function SessionLog({ session, onDelete }: SessionLogProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'shake':
        return <Smartphone className="w-4 h-4" />;
      case 'volume-pattern':
        return <Smartphone className="w-4 h-4 rotate-90" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'shake':
        return 'Shake Trigger';
      case 'volume-pattern':
        return 'Volume Pattern';
      default:
        return 'Manual Trigger';
    }
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${session.isActive ? 'bg-alert pulse-alert' : 'bg-muted-foreground'}`} />
          <span className="text-sm font-medium text-foreground">
            {session.isActive ? 'Active' : 'Ended'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatDate(session.timestamp)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          {getTriggerIcon(session.triggerType)}
          <span className="text-muted-foreground">{getTriggerLabel(session.triggerType)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          {session.location ? (
            <span className="font-mono text-xs text-muted-foreground">
              {session.location.latitude.toFixed(4)}, {session.location.longitude.toFixed(4)}
            </span>
          ) : (
            <span className="text-muted-foreground/50">No location</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Mic className="w-4 h-4" />
          <span className={`text-xs ${
            session.audioRecordingStatus === 'started' ? 'text-armed' :
            session.audioRecordingStatus === 'stopped' ? 'text-muted-foreground' :
            session.audioRecordingStatus === 'failed' ? 'text-destructive' :
            'text-muted-foreground/50'
          }`}>
            {session.audioRecordingStatus === 'started' ? 'Recording' :
             session.audioRecordingStatus === 'stopped' ? 'Recorded' :
             session.audioRecordingStatus === 'failed' ? 'Failed' :
             'No audio'}
          </span>
        </div>

        {session.contactsNotified.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {session.contactsNotified.length} contact(s) notified
          </div>
        )}
      </div>

      {!session.isActive && (
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(session.id)}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Log
          </Button>
        </div>
      )}
    </div>
  );
}
