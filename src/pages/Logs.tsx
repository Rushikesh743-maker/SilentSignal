import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionLog } from '@/components/SessionLog';
import { useSOS } from '@/context/SOSContext';

export function Logs() {
  const { sessions, deleteSession, clearAllSessions } = useSOS();

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Session Logs</h1>
            <p className="text-sm text-muted-foreground">History of SOS activations</p>
          </div>
          {sessions.length > 0 && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={clearAllSessions}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {sessions.map(session => (
            <SessionLog
              key={session.id}
              session={session}
              onDelete={deleteSession}
            />
          ))}
        </div>

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No sessions yet</h3>
            <p className="text-sm text-muted-foreground">
              SOS activation logs will appear here
            </p>
          </div>
        )}

        {/* Info */}
        {sessions.length > 0 && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              Logs are stored locally on your device for your privacy. Active sessions show live location updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logs;
