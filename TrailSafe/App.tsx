import { StatusBar } from 'expo-status-bar';
import MapScreen from './src/components/MapScreen';

export default function App() {
  return (
    <>
      <MapScreen />
      <StatusBar style="auto" />
    </>
  );
}
