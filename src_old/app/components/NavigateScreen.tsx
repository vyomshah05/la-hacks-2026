import { Navigation, MapPin, Camera, Map, ArrowRight, Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NavigateScreen() {
  const navigate = useNavigate();

  const routeProgress = {
    current: 0.4,
    total: 1.4,
    percentage: 29,
  };

  const nextStep = {
    direction: 'Northeast',
    distance: '120 m',
    instruction: 'Continue on the main trail',
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('/lost')}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-95 transition-transform mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl text-foreground">Navigation</h1>
          <div className="px-3 py-1.5 bg-success/10 rounded-full">
            <span className="text-sm text-success">On Track</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Guiding you back to safety</p>
      </div>

      <div className="px-6 mb-4">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress to Trailhead</span>
            <span className="text-sm text-foreground">{routeProgress.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary"
              style={{ width: `${routeProgress.percentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{routeProgress.current} km traveled</span>
            <span>{routeProgress.total} km total</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6">
        <div className="h-64 bg-gradient-to-br from-primary/20 via-accent/10 to-success/20 rounded-2xl relative overflow-hidden mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-dashed border-primary/50 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 50 200 Q 150 100 250 150 T 400 200"
              stroke="currentColor"
              fill="none"
              strokeWidth="4"
              strokeDasharray="10 5"
              className="text-primary"
            />
          </svg>

          <div className="absolute top-4 left-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="text-xs text-foreground">Recommended Route</span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => navigate('/map')}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <Map className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => navigate('/ar')}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <Camera className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="bg-primary rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-1">Next Step</p>
              <h2 className="text-white text-xl mb-2">{nextStep.instruction}</h2>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white/20 rounded-lg">
                  <span className="text-sm text-white">{nextStep.direction}</span>
                </div>
                <div className="px-3 py-1.5 bg-white/20 rounded-lg">
                  <span className="text-sm text-white">{nextStep.distance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/20 my-4"></div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-white/70 text-xs mb-1">Distance Left</p>
              <p className="text-white">1.0 km</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Est. Time</p>
              <p className="text-white">18 min</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Elevation</p>
              <p className="text-white">-45 m</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Continue on main trail</p>
              <p className="text-xs text-muted-foreground">120 m northeast</p>
            </div>
            <Navigation className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-4 opacity-50">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Turn right at fork</p>
              <p className="text-xs text-muted-foreground">340 m northeast</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-4 opacity-50">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Arrive at trailhead</p>
              <p className="text-xs text-muted-foreground">1.0 km north</p>
            </div>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-background border-t border-border">
        <button
          onClick={() => navigate('/ar')}
          className="w-full py-4 px-6 bg-accent text-white rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Camera className="w-5 h-5" />
          Switch to AR View
        </button>
      </div>
    </div>
  );
}
