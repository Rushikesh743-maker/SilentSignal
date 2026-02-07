import React from 'react';
import { Shield, ShieldOff, Calculator, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSOS } from '@/context/SOSContext';

export function Settings() {
  const { appState, armSystem, disarmSystem, activateFakeScreen } = useSOS();

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your protection</p>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {/* Arm/Disarm */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {appState.isArmed ? (
                  <Shield className="w-5 h-5 text-armed" />
                ) : (
                  <ShieldOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">Protection Armed</p>
                  <p className="text-xs text-muted-foreground">
                    {appState.isArmed ? 'Ready to respond to triggers' : 'Triggers disabled'}
                  </p>
                </div>
              </div>
              <Switch
                checked={appState.isArmed}
                onCheckedChange={(checked) => checked ? armSystem() : disarmSystem()}
                className="data-[state=checked]:bg-armed"
              />
            </div>
          </div>

          {/* Test Fake Screen */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Test Fake Screen</p>
                  <p className="text-xs text-muted-foreground">
                    Press C-C-C-= to exit
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={activateFakeScreen}
              >
                Test
              </Button>
            </div>
          </div>

          {/* Android Integration Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-2">Android Integration</p>
                <p className="text-xs text-muted-foreground mb-3">
                  This PWA is designed to work with an Android Lite app that handles background triggers:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>5-second rapid shake detection</li>
                  <li>Volume button patterns</li>
                  <li>Background service for always-on protection</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  The Android app calls <code className="text-armed font-mono">window.triggerSOS(type)</code> via WebView JavaScript interface.
                </p>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SilentSignal</p>
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
              <a 
                href="#" 
                className="text-sm text-armed hover:underline flex items-center gap-1"
              >
                About <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="font-medium text-foreground mb-2">Privacy</h3>
          <p className="text-xs text-muted-foreground">
            All data is stored locally on your device. No server connections are made. 
            Location and audio data remain on your device unless you choose to share them.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
