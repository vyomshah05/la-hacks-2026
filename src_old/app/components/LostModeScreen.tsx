import { WifiOff, MapPin, Battery, Navigation, Camera, Route, AlertCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function LostModeScreen() {
  const navigate = useNavigate();

  const currentStatus = {
    online: false,
    locationSaved: true,
    batteryLevel: 78,
    isStationary: false,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12 pb-6 bg-gradient-to-br from-warning/10 to-warning/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground">Lost Mode</h1>
            <p className="text-sm text-muted-foreground">We're here to help</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="text-xl mb-2 text-foreground">You're Offline, but Not Lost</h2>
          <p className="text-sm text-muted-foreground">
            Your offline map and location history are ready to guide you back to safety.
          </p>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-foreground mb-4">Current Status</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5 text-warning" />
                <span className="text-sm text-foreground">Connection</span>
              </div>
              <span className="text-sm px-3 py-1 bg-warning/10 text-warning rounded-full">
                Offline
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${currentStatus.locationSaved ? 'text-success' : 'text-muted-foreground'}`} />
                <span className="text-sm text-foreground">Last Known Location</span>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                currentStatus.locationSaved
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStatus.locationSaved ? 'Saved' : 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery className="w-5 h-5 text-success" />
                <span className="text-sm text-foreground">Battery Level</span>
              </div>
              <span className="text-sm text-foreground">{currentStatus.batteryLevel}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle className={`w-5 h-5 ${currentStatus.isStationary ? 'text-primary' : 'text-accent'}`} />
                <span className="text-sm text-foreground">Movement</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {currentStatus.isStationary ? 'Stationary' : 'Moving'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => navigate('/navigate')}
            className="w-full py-5 px-6 bg-primary text-white rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <Navigation className="w-6 h-6" />
            <div className="flex-1 text-left">
              <p className="text-sm">Guide Me Back</p>
              <p className="text-xs text-white/70">Step-by-step navigation to safety</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/map')}
            className="w-full py-5 px-6 bg-accent text-white rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <Route className="w-6 h-6" />
            <div className="flex-1 text-left">
              <p className="text-sm">Show Last Known Path</p>
              <p className="text-xs text-white/70">View your route history</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/ar')}
            className="w-full py-5 px-6 bg-secondary text-white rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <Camera className="w-6 h-6" />
            <div className="flex-1 text-left">
              <p className="text-sm">Open AR View</p>
              <p className="text-xs text-white/70">Camera guidance to destination</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/sos')}
            className="w-full py-5 px-6 bg-destructive text-white rounded-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <AlertCircle className="w-6 h-6" />
            <div className="flex-1 text-left">
              <p className="text-sm">Contact SOS</p>
              <p className="text-xs text-white/70">Emergency assistance</p>
            </div>
          </button>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-foreground mb-3">Next Steps</h3>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden mb-3">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-foreground mb-1">Recommended Action</p>
            <p className="text-xs text-muted-foreground">
              Head northeast for 1.2 km to reach the main trailhead. The path is mostly downhill.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
