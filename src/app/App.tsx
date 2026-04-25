import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import OfflineMapScreen from './components/OfflineMapScreen';
import DownloadAreaScreen from './components/DownloadAreaScreen';
import LostModeScreen from './components/LostModeScreen';
import ARGuidanceScreen from './components/ARGuidanceScreen';
import AIGuideScreen from './components/AIGuideScreen';
import SOSScreen from './components/SOSScreen';
import NavigateScreen from './components/NavigateScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full max-w-md mx-auto min-h-screen bg-background shadow-2xl">
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/map" element={<OfflineMapScreen />} />
          <Route path="/download" element={<DownloadAreaScreen />} />
          <Route path="/lost" element={<LostModeScreen />} />
          <Route path="/ar" element={<ARGuidanceScreen />} />
          <Route path="/ai" element={<AIGuideScreen />} />
          <Route path="/sos" element={<SOSScreen />} />
          <Route path="/navigate" element={<NavigateScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}