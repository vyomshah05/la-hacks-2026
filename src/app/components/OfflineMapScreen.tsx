import { Search, Navigation, Compass, Download, MapPin, Circle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function OfflineMapScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-success/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute top-1/3 left-1/4">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/4">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
        </div>
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20">
          <path
            d="M 100 300 Q 200 200 300 300 T 500 300"
            stroke="currentColor"
            fill="none"
            strokeWidth="3"
            strokeDasharray="10 5"
            className="text-primary"
          />
        </svg>
        <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-3xl m-12"></div>
      </div>

      <div className="relative z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1 bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search location..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-card border border-border rounded-xl flex items-center gap-2 active:scale-95 transition-transform">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Recenter</span>
            </button>
            <button className="px-4 py-2 bg-card border border-border rounded-xl flex items-center gap-2 active:scale-95 transition-transform">
              <Compass className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">Compass</span>
            </button>
            <button className="px-4 py-2 bg-card border border-border rounded-xl flex items-center gap-2 active:scale-95 transition-transform">
              <Download className="w-4 h-4 text-secondary" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Offline Map Status</h3>
            <span className="text-xs px-3 py-1 bg-success/10 text-success rounded-full flex items-center gap-1">
              <Circle className="w-2 h-2 fill-current" />
              Available Offline
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Downloaded Area</span>
              <span className="text-foreground">10.2 km²</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="text-foreground">24.8 MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-foreground">2 hours ago</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/download')}
                className="flex-1 py-3 bg-primary text-white rounded-xl active:scale-95 transition-transform"
              >
                Update Area
              </button>
              <button
                onClick={() => navigate('/home')}
                className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <Home className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
