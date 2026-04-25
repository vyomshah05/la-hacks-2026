import { MapPin, Camera, Bell, Users, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function OnboardingScreen() {
  const navigate = useNavigate();

  const permissions = [
    {
      icon: MapPin,
      title: 'Location Access',
      description: 'Track your position and navigate back to safety',
      required: true,
    },
    {
      icon: Camera,
      title: 'Camera Access',
      description: 'AR guidance to show you the way',
      required: true,
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Safety reminders and alerts',
      required: false,
    },
    {
      icon: Users,
      title: 'Emergency Contacts',
      description: 'Quick SOS access when you need help',
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col px-6 pt-12 pb-24">
        <div className="flex-1">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl mb-3 text-foreground">Stay Safe on Every Trail</h1>
            <p className="text-lg text-muted-foreground">
              TrailSafe keeps you safe with offline maps, AR guidance, and AI support—even without signal.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            {permissions.map((perm, index) => {
              const Icon = perm.icon;
              return (
                <div key={index} className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-foreground">{perm.title}</h3>
                        {perm.required && (
                          <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{perm.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 px-6 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Check className="w-5 h-5" />
          Enable Safe Hike Mode
        </button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          We only access your data when necessary for your safety
        </p>
      </div>
    </div>
  );
}
