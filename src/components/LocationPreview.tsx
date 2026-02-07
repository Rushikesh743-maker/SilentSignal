import React from 'react';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LocationData } from '@/types';

interface LocationPreviewProps {
  location: LocationData | null;
  error: string | null;
  isTracking: boolean;
  onRefresh?: () => void;
}

export function LocationPreview({ location, error, isTracking, onRefresh }: LocationPreviewProps) {
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
        <div className="flex items-center gap-2 text-destructive">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-medium">Location Error</span>
        </div>
        <p className="text-xs text-destructive/70 mt-1">{error}</p>
        {onRefresh && (
          <Button size="sm" variant="outline" onClick={onRefresh} className="mt-3">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!location) {
    return (
      <div className="p-4 rounded-xl bg-muted border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5" />
          <span className="text-sm">Acquiring location...</span>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`;

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      {/* Map placeholder with coordinates */}
      <div className="h-32 bg-secondary relative">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${location.longitude},${location.latitude},13,0/400x200?access_token=pk.placeholder')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Navigation className="w-8 h-8 text-armed" />
            {isTracking && (
              <div className="absolute -inset-2 rounded-full border-2 border-armed/50 animate-ping" />
            )}
          </div>
        </div>
        {isTracking && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-armed/80 text-armed-foreground text-xs font-medium">
            Live
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-sm text-foreground">
              {location.latitude.toFixed(6)}
            </div>
            <div className="font-mono text-sm text-foreground">
              {location.longitude.toFixed(6)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ±{Math.round(location.accuracy)}m accuracy
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <MapPin className="w-5 h-5 text-armed" />
          </a>
        </div>
      </div>
    </div>
  );
}
