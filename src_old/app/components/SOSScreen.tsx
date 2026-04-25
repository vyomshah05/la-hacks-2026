import { Phone, Mic, MapPin, Battery, Clock, User, AlertCircle, Copy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function SOSScreen() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  const locationPayload = {
    latitude: '47.6062° N',
    longitude: '122.3321° W',
    accuracy: '8 meters',
    timestamp: 'Apr 25, 2026 10:23 AM',
    battery: '78%',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12 pb-6 bg-destructive text-white">
        <button
          onClick={() => navigate('/lost')}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:scale-95 transition-transform mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">Emergency SOS</h1>
            <p className="text-sm text-white/70">Help is on the way</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-lg mb-6">
          <h3 className="text-foreground mb-4">Voice Guidance</h3>

          <div className="flex flex-col items-center py-8">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 active:scale-95 transition-all ${
                isListening
                  ? 'bg-destructive shadow-[0_0_0_8px_rgba(220,38,38,0.1),0_0_0_16px_rgba(220,38,38,0.05)] animate-pulse'
                  : 'bg-primary'
              }`}
            >
              <Mic className="w-12 h-12 text-white" />
            </button>

            <p className="text-foreground mb-1">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Ask for directions or activate emergency beacon
            </p>
          </div>

          {isListening && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                "How do I get back to the trailhead?"
              </p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Location Payload</h3>
            <button className="p-2 hover:bg-muted rounded-lg active:scale-95 transition-transform">
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
                <p className="text-sm text-foreground">{locationPayload.latitude}</p>
                <p className="text-sm text-foreground">{locationPayload.longitude}</p>
                <p className="text-xs text-muted-foreground mt-1">Accuracy: {locationPayload.accuracy}</p>
              </div>
            </div>

            <div className="h-px bg-border"></div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm text-foreground">{locationPayload.timestamp}</p>
              </div>
            </div>

            <div className="h-px bg-border"></div>

            <div className="flex items-start gap-3">
              <Battery className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Battery Level</p>
                <p className="text-sm text-foreground">{locationPayload.battery}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-foreground mb-4">Emergency Contacts</h3>

          <div className="space-y-3">
            <button className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">Primary Contact</p>
              </div>
              <Phone className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-foreground">Jane Smith</p>
                <p className="text-xs text-muted-foreground">Secondary Contact</p>
              </div>
              <Phone className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <button className="w-full py-4 px-6 bg-destructive text-white rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <AlertCircle className="w-5 h-5" />
          Activate Emergency Beacon
        </button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          This will send your location to emergency services and contacts
        </p>
      </div>
    </div>
  );
}
