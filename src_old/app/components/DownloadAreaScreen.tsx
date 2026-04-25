import { Download, MapPin, HardDrive, Clock, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function DownloadAreaScreen() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    setIsDownloading(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/home'), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-95 transition-transform mb-6"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <h1 className="text-3xl mb-3 text-foreground">Download Offline Area</h1>
        <p className="text-muted-foreground">
          Save a compact offline map of your nearby area for use without internet connection.
        </p>
      </div>

      <div className="px-6">
        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-dashed border-primary/50 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs text-foreground">
              Current Location
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Selected region: 10 km² around your position
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border mb-6">
          <h3 className="text-foreground mb-4">Download Details</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <HardDrive className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground mb-1">Estimated Size</p>
                <p className="text-xs text-muted-foreground">Approximately 25-30 MB of storage</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground mb-1">Auto-Refresh</p>
                <p className="text-xs text-muted-foreground">
                  Map updates automatically every 24 hours when connected
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground mb-1">Offline Access</p>
                <p className="text-xs text-muted-foreground">
                  Browse and navigate without internet connection
                </p>
              </div>
            </div>
          </div>
        </div>

        {isDownloading && (
          <div className="bg-card rounded-2xl p-5 border border-border mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-foreground">Downloading map data...</span>
              <span className="text-sm text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {progress === 100 && (
              <div className="flex items-center gap-2 mt-3 text-success">
                <Check className="w-4 h-4" />
                <span className="text-sm">Download complete!</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform ${
            isDownloading
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-white'
          }`}
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Downloading...' : 'Save Offline Area'}
        </button>
      </div>
    </div>
  );
}
