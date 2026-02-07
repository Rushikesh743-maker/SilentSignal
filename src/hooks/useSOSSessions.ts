import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { SOSSession, LocationData, TriggerType } from '@/types';

export function useSOSSessions() {
  const [sessions, setSessions] = useLocalStorage<SOSSession[]>('silentsignal_sessions', []);

  const createSession = useCallback((triggerType: TriggerType, contactIds: string[]): SOSSession => {
    const newSession: SOSSession = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      triggerType,
      location: null,
      audioRecordingStatus: 'none',
      contactsNotified: contactIds,
      isActive: true,
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  }, [setSessions]);

  const updateSession = useCallback((id: string, updates: Partial<SOSSession>) => {
    setSessions(prev => prev.map(session =>
      session.id === id
        ? { ...session, ...updates }
        : session
    ));
  }, [setSessions]);

  const updateSessionLocation = useCallback((id: string, location: LocationData) => {
    updateSession(id, { location });
  }, [updateSession]);

  const updateSessionAudioStatus = useCallback((id: string, status: SOSSession['audioRecordingStatus']) => {
    updateSession(id, { audioRecordingStatus: status });
  }, [updateSession]);

  const endSession = useCallback((id: string) => {
    updateSession(id, { isActive: false });
  }, [updateSession]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  }, [setSessions]);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
  }, [setSessions]);

  const getActiveSession = useCallback(() => {
    return sessions.find(session => session.isActive) || null;
  }, [sessions]);

  return {
    sessions,
    createSession,
    updateSession,
    updateSessionLocation,
    updateSessionAudioStatus,
    endSession,
    deleteSession,
    clearAllSessions,
    getActiveSession,
  };
}
