import React from 'react';
import { StatusIndicator } from '@/components/StatusIndicator';
import { SOSButton } from '@/components/SOSButton';
import { LocationPreview } from '@/components/LocationPreview';
import { RecordingStatus } from '@/components/RecordingStatus';
import { useSOS } from '@/context/SOSContext';

export function Home() {
  const { 
    appState, 
    location, 
    locationError, 
    isRecording, 
    audioUrl, 
    recordingDuration,
    stopRecording,
    getSelectedContacts 
  } = useSOS();

  const selectedContacts = getSelectedContacts();

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">SilentSignal</h1>
          <p className="text-sm text-muted-foreground">Silent protection when you need it</p>
        </div>

        {/* Status */}
        <StatusIndicator />

        {/* SOS Button */}
        <div className="flex justify-center py-8">
          <SOSButton />
        </div>

        {/* Active SOS Info */}
        {appState.isSOSActive && (
          <div className="space-y-4 fade-in">
            <LocationPreview
              location={location}
              error={locationError}
              isTracking={true}
            />
            <RecordingStatus
              isRecording={isRecording}
              duration={recordingDuration}
              audioUrl={audioUrl}
              onStop={stopRecording}
            />
          </div>
        )}

        {/* Quick Stats */}
        {!appState.isSOSActive && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-2xl font-semibold text-foreground">{selectedContacts.length}</p>
              <p className="text-sm text-muted-foreground">Active Contacts</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-2xl font-semibold text-foreground">
                {appState.isArmed ? 'Ready' : 'Off'}
              </p>
              <p className="text-sm text-muted-foreground">Protection Status</p>
            </div>
          </div>
        )}

        {/* Hint */}
        {!appState.isSOSActive && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Android integration: Shake device or use volume button pattern to trigger SOS silently
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
