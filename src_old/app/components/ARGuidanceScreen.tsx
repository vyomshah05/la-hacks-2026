import { ArrowUp, MapPin, Navigation, Map, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function ARGuidanceScreen() {
  const navigate = useNavigate();

  const gpsAccuracy = 8;
  const compassAccuracy = 95;
  const distanceToDestination = 1.4;
  const heading = 42;
  const cardinalDirection = 'NE';
  const destination = 'Main Trailhead';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${gpsAccuracy < 10 ? 'bg-success' : 'bg-warning'}`}></div>
                  <span className="text-xs text-white">GPS {gpsAccuracy}m</span>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3 h-3 text-white" />
                  <span className="text-xs text-white">{compassAccuracy}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/lost')}
              className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center backdrop-blur-sm">
                <ArrowUp className="w-20 h-20 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ strokeWidth: 3 }} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-white flex items-center justify-center">
                <Navigation className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-7xl text-white mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ fontWeight: 600 }}>
              {distanceToDestination} km
            </div>
            <div className="px-6 py-2 bg-black/70 backdrop-blur-sm rounded-xl border border-white/20 inline-block">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-lg text-white">{destination}</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 bg-success/90 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
            <p className="text-sm text-white">Likely trail ahead</p>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-white" />
                <div>
                  <p className="text-xs text-white/60">Heading</p>
                  <p className="text-lg text-white">{heading}°</p>
                </div>
              </div>

              <div className="w-px h-10 bg-white/20"></div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-white/60">Direction</p>
                  <p className="text-lg text-white">{cardinalDirection}</p>
                </div>
              </div>

              <div className="w-px h-10 bg-white/20"></div>

              <button
                onClick={() => navigate('/map')}
                className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center active:scale-95 transition-transform border border-white/20"
              >
                <Map className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
