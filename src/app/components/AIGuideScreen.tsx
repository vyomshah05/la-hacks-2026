import { MessageSquare, Send, Wifi, WifiOff, MapPin, Battery, Lightbulb, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function AIGuideScreen() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const suggestions = [
    'Am I going the right way?',
    'Guide me back to the trailhead',
    'What should I do if I stay offline?',
    'Remind me to conserve battery',
  ];

  const messages = [
    {
      type: 'ai',
      content: "Hi! I'm your AI guide. I can help you navigate back to safety using your offline map and location history. How can I assist you?",
      time: '10:23 AM',
    },
    {
      type: 'reminder',
      content: "Stay hydrated and conserve your phone's battery. Your offline map is ready and your last known location has been saved.",
      time: '10:24 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-12 pb-4 bg-primary text-white">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:scale-95 transition-transform mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">AI Guide</h1>
            <p className="text-sm text-white/70">Here to help you stay safe</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white/10 rounded-full flex items-center gap-2">
            <WifiOff className="w-3 h-3" />
            <span className="text-xs">Offline</span>
          </div>
          <div className="px-3 py-1.5 bg-white/10 rounded-full flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Map Ready</span>
          </div>
          <div className="px-3 py-1.5 bg-white/10 rounded-full flex items-center gap-2">
            <Battery className="w-3 h-3" />
            <span className="text-xs">78%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.type === 'ai' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm text-foreground">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-1">{msg.time}</p>
                  </div>
                </div>
              )}

              {msg.type === 'reminder' && (
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground mb-1">Safety Tip</p>
                      <p className="text-sm text-muted-foreground">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
                    </div>
                  </div>
                </div>
              )}

              {msg.type === 'user' && (
                <div className="flex justify-end">
                  <div className="flex-1 max-w-[80%]">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm p-4">
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mr-1 text-right">{msg.time}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-3 px-1">Suggested questions</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="p-3 bg-card border border-border rounded-xl text-left active:scale-95 transition-transform"
              >
                <p className="text-sm text-foreground">{suggestion}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your AI guide..."
            className="flex-1 px-4 py-3 bg-input-background text-foreground placeholder:text-muted-foreground rounded-xl outline-none border border-border focus:border-primary"
          />
          <button className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center active:scale-95 transition-transform">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
