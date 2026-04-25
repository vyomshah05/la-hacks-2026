import { Wifi, WifiOff, Map, Battery, Download, MapPin, AlertCircle, Camera, MessageSquare, Play, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function HomeScreen() {
  const navigate = useNavigate();

  const isOffline = false;
  const batteryLevel = 78;
  const mapReady = true;

  const quickActions = [
    { icon: Play, label: 'Start Hike', path: '/map', color: 'bg-primary' },
    { icon: Map, label: 'Offline Map', path: '/map', color: 'bg-accent' },
    { icon: AlertCircle, label: 'Lost Mode', path: '/lost', color: 'bg-warning' },
    { icon: Camera, label: 'AR Guide', path: '/ar', color: 'bg-secondary' },
  ];

  const safetyChecklist = [
    { label: 'Offline map downloaded', completed: true },
    { label: 'Emergency contacts set', completed: true },
    { label: 'Battery above 50%', completed: true },
    { label: 'Share trip details', completed: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="px-6 pt-12 pb-6 bg-primary text-white">
        <h1 className="text-3xl mb-2">TrailSafe</h1>
        <p className="text-white/80">Ready for your next adventure</p>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-card rounded-2xl p-5 shadow-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">System Status</h3>
            <span className="text-xs px-3 py-1 bg-success/10 text-success rounded-full">
              All Ready
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOffline ? (
                  <WifiOff className="w-5 h-5 text-warning" />
                ) : (
                  <Wifi className="w-5 h-5 text-success" />
                )}
                <span className="text-sm text-foreground">Connectivity</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {isOffline ? 'Offline' : 'Online'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className={`w-5 h-5 ${mapReady ? 'text-success' : 'text-muted-foreground'}`} />
                <span className="text-sm text-foreground">Offline Map</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {mapReady ? 'Ready' : 'Not Downloaded'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Battery className="w-5 h-5 text-success" />
                <span className="text-sm text-foreground">Battery</span>
              </div>
              <span className="text-sm text-muted-foreground">{batteryLevel}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Last Refresh</span>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`${action.color} text-white rounded-2xl p-6 flex flex-col items-center gap-3 active:scale-95 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="text-sm">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-card rounded-2xl p-5 border border-border">
          <div className="h-48 bg-muted rounded-xl mb-4 flex items-center justify-center text-muted-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
            <Map className="w-12 h-12 relative z-10" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Coverage: 10 km²</span>
            <button
              onClick={() => navigate('/download')}
              className="text-primary flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Update
            </button>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-2xl p-5 border border-border">
          <h3 className="text-foreground mb-4">Safety Checklist</h3>
          <div className="space-y-3">
            {safetyChecklist.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.completed ? 'bg-success' : 'bg-muted'
                }`}>
                  {item.completed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
