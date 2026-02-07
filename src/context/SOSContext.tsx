import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useContacts } from '@/hooks/useContacts';
import { useSOSSessions } from '@/hooks/useSOSSessions';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import type { TriggerType, SOSSession, AppState } from '@/types';

interface SOSContextType {
  // State
  appState: AppState;
  currentSession: SOSSession | null;
  
  // Actions
  triggerSOS: (triggerType: TriggerType) => void;
  deactivateSOS: () => void;
  activateFakeScreen: () => void;
  deactivateFakeScreen: () => void;
  armSystem: () => void;
  disarmSystem: () => void;
  
  // Geolocation
  location: ReturnType<typeof useGeolocation>['location'];
  locationError: ReturnType<typeof useGeolocation>['error'];
  
  // Audio
  isRecording: boolean;
  audioUrl: string | null;
  recordingDuration: number;
  stopRecording: () => void;
  
  // Contacts
  contacts: ReturnType<typeof useContacts>['contacts'];
  addContact: ReturnType<typeof useContacts>['addContact'];
  updateContact: ReturnType<typeof useContacts>['updateContact'];
  deleteContact: ReturnType<typeof useContacts>['deleteContact'];
  toggleContactSelection: ReturnType<typeof useContacts>['toggleContactSelection'];
  getSelectedContacts: ReturnType<typeof useContacts>['getSelectedContacts'];
  
  // Sessions
  sessions: ReturnType<typeof useSOSSessions>['sessions'];
  deleteSession: ReturnType<typeof useSOSSessions>['deleteSession'];
  clearAllSessions: ReturnType<typeof useSOSSessions>['clearAllSessions'];
}

const SOSContext = createContext<SOSContextType | null>(null);

export function SOSProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState>({
    isArmed: true,
    isFakeScreenActive: false,
    isSOSActive: false,
    currentSession: null,
  });

  const {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    toggleContactSelection,
    getSelectedContacts,
  } = useContacts();

  const {
    sessions,
    createSession,
    updateSessionLocation,
    updateSessionAudioStatus,
    endSession,
    deleteSession,
    clearAllSessions,
    getActiveSession,
  } = useSOSSessions();

  const {
    location,
    error: locationError,
    startTracking,
    stopTracking,
    getCurrentLocation,
  } = useGeolocation();

  const {
    isRecording,
    audioUrl,
    duration: recordingDuration,
    startRecording,
    stopRecording: stopAudioRecording,
  } = useAudioRecorder();

  const sessionRef = useRef<SOSSession | null>(null);

  // Update session location when location changes
  useEffect(() => {
    if (sessionRef.current && location) {
      updateSessionLocation(sessionRef.current.id, location);
    }
  }, [location, updateSessionLocation]);

  const triggerSOS = useCallback(async (triggerType: TriggerType) => {
    if (appState.isSOSActive) return;

    // Get selected contacts
    const selectedContacts = getSelectedContacts();
    const contactIds = selectedContacts.map(c => c.id);

    // Create new session
    const session = createSession(triggerType, contactIds);
    sessionRef.current = session;

    // Update app state - activate fake screen immediately
    setAppState(prev => ({
      ...prev,
      isSOSActive: true,
      isFakeScreenActive: true,
      currentSession: session,
    }));

    // Start location tracking
    const initialLocation = await getCurrentLocation();
    if (initialLocation) {
      updateSessionLocation(session.id, initialLocation);
    }
    startTracking();

    // Start audio recording
    const recordingStarted = await startRecording();
    updateSessionAudioStatus(session.id, recordingStarted ? 'started' : 'failed');

    // In a real app, this is where you would send SMS/notifications
    // For now, we just log the action
    console.log('[SilentSignal] SOS triggered:', {
      triggerType,
      contacts: selectedContacts.map(c => ({ name: c.name, phone: c.phone })),
      location: initialLocation,
    });
  }, [
    appState.isSOSActive,
    getSelectedContacts,
    createSession,
    getCurrentLocation,
    startTracking,
    startRecording,
    updateSessionLocation,
    updateSessionAudioStatus,
  ]);

  const deactivateSOS = useCallback(() => {
    if (sessionRef.current) {
      endSession(sessionRef.current.id);
      if (isRecording) {
        stopAudioRecording();
        updateSessionAudioStatus(sessionRef.current.id, 'stopped');
      }
    }
    stopTracking();
    sessionRef.current = null;

    setAppState(prev => ({
      ...prev,
      isSOSActive: false,
      isFakeScreenActive: false,
      currentSession: null,
    }));
  }, [endSession, isRecording, stopAudioRecording, stopTracking, updateSessionAudioStatus]);

  const activateFakeScreen = useCallback(() => {
    setAppState(prev => ({ ...prev, isFakeScreenActive: true }));
  }, []);

  const deactivateFakeScreen = useCallback(() => {
    if (!appState.isSOSActive) {
      setAppState(prev => ({ ...prev, isFakeScreenActive: false }));
    }
  }, [appState.isSOSActive]);

  const armSystem = useCallback(() => {
    setAppState(prev => ({ ...prev, isArmed: true }));
  }, []);

  const disarmSystem = useCallback(() => {
    setAppState(prev => ({ ...prev, isArmed: false }));
  }, []);

  const stopRecording = useCallback(() => {
    stopAudioRecording();
    if (sessionRef.current) {
      updateSessionAudioStatus(sessionRef.current.id, 'stopped');
    }
  }, [stopAudioRecording, updateSessionAudioStatus]);

  // Expose triggerSOS to window for Android WebView
  useEffect(() => {
    (window as any).triggerSOS = triggerSOS;
    return () => {
      delete (window as any).triggerSOS;
    };
  }, [triggerSOS]);

  const value: SOSContextType = {
    appState,
    currentSession: getActiveSession(),
    triggerSOS,
    deactivateSOS,
    activateFakeScreen,
    deactivateFakeScreen,
    armSystem,
    disarmSystem,
    location,
    locationError,
    isRecording,
    audioUrl,
    recordingDuration,
    stopRecording,
    contacts,
    addContact,
    updateContact,
    deleteContact,
    toggleContactSelection,
    getSelectedContacts,
    sessions,
    deleteSession,
    clearAllSessions,
  };

  return (
    <SOSContext.Provider value={value}>
      {children}
    </SOSContext.Provider>
  );
}

export function useSOS() {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOS must be used within a SOSProvider');
  }
  return context;
}
