export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  isSelected: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface SOSSession {
  id: string;
  timestamp: number;
  triggerType: 'shake' | 'volume-pattern' | 'manual';
  location: LocationData | null;
  audioRecordingStatus: 'started' | 'stopped' | 'failed' | 'none';
  audioBlob?: Blob;
  contactsNotified: string[];
  isActive: boolean;
}

export interface AppState {
  isArmed: boolean;
  isFakeScreenActive: boolean;
  isSOSActive: boolean;
  currentSession: SOSSession | null;
}

export type TriggerType = 'shake' | 'volume-pattern' | 'manual';
