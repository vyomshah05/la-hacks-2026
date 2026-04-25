import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Pressable, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RoutePath } from '../routes';
import { MapPreview, Screen, StatusRow } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { AppButton, Badge, Card, Icon, Row, SectionTitle, text, type FeatherName } from '../ui';

type ConnectivityStatus = 'checking' | 'online' | 'offline';
const DEVICE_STATUS_REFRESH_MS = 5000;
type DeviceStatus = {
  batteryLevel: number | null;
  connectivity: ConnectivityStatus;
};
type DeviceStatusOptions = {
  forceFreshBattery?: boolean;
};

function getConnectivityStatus(state: Network.NetworkState): ConnectivityStatus {
  if (state.isInternetReachable ?? state.isConnected) {
    return 'online';
  }

  return 'offline';
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getBatteryLevel(forceFresh = false) {
  const powerState = await Battery.getPowerStateAsync().catch(() => null);
  const batteryLevel = powerState?.batteryLevel ?? (await Battery.getBatteryLevelAsync().catch(() => null));

  if (!forceFresh) {
    return batteryLevel;
  }

  await wait(350);

  const freshPowerState = await Battery.getPowerStateAsync().catch(() => null);
  return freshPowerState?.batteryLevel ?? (await Battery.getBatteryLevelAsync().catch(() => batteryLevel));
}

async function getDeviceStatus(options: DeviceStatusOptions = {}): Promise<DeviceStatus> {
  const [networkState, currentBatteryLevel] = await Promise.all([
    Network.getNetworkStateAsync().catch(() => null),
    getBatteryLevel(options.forceFreshBattery),
  ]);

  return {
    batteryLevel: currentBatteryLevel === undefined ? null : currentBatteryLevel,
    connectivity: networkState ? getConnectivityStatus(networkState) : 'offline',
  };
}

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>('checking');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const quickActions: Array<{ icon: FeatherName; label: string; path: RoutePath; color: string }> = [
    { icon: 'play', label: 'Start Hike', path: '/map', color: colors.primary },
    { icon: 'map', label: 'Offline Map', path: '/map', color: colors.accent },
    { icon: 'message-square', label: 'AI Agent', path: '/ai', color: colors.warning },
    { icon: 'camera', label: 'AR Guide', path: '/ar', color: colors.secondary },
  ];
  const debugLinks: Array<{ icon: FeatherName; label: string; path: RoutePath; color: string }> = [
    { icon: 'alert-triangle', label: 'Lost Mode', path: '/lost', color: colors.destructive },
    { icon: 'phone-call', label: 'SOS', path: '/sos', color: colors.warning },
    { icon: 'navigation', label: 'Navigate', path: '/navigate', color: colors.primary },
    { icon: 'compass', label: 'Onboarding', path: '/onboarding', color: colors.mutedForeground },
  ];
  const checklist = [
    { label: 'Offline map downloaded', completed: true },
    { label: 'Emergency contacts set', completed: true },
    { label: 'Battery above 50%', completed: true },
    { label: 'Share trip details', completed: false },
  ];
  const batteryPercent = batteryLevel === null || batteryLevel < 0 ? null : Math.round(batteryLevel * 100);
  const connectivityLabel =
    connectivity === 'checking' ? 'Checking...' : connectivity === 'online' ? 'Online' : 'Offline';
  const connectivityColor =
    connectivity === 'checking' ? colors.mutedForeground : connectivity === 'online' ? colors.success : colors.destructive;
  const batteryLabel = batteryPercent === null ? 'Checking...' : `${batteryPercent}%`;
  const batteryColor =
    batteryPercent === null
      ? colors.mutedForeground
      : batteryPercent >= 50
        ? colors.success
        : batteryPercent >= 20
          ? colors.warning
          : colors.destructive;
  const isSystemReady = connectivity === 'online' && batteryPercent !== null && batteryPercent >= 20;
  const systemStatusLabel =
    connectivity === 'checking' || batteryPercent === null ? 'Checking' : isSystemReady ? 'All Ready' : 'Needs Attention';
  const systemStatusTone =
    connectivity === 'checking' || batteryPercent === null ? 'muted' : isSystemReady ? 'success' : 'warning';
  const applyDeviceStatus = useCallback((status: DeviceStatus) => {
    setConnectivity(status.connectivity);
    setBatteryLevel(status.batteryLevel);
  }, []);
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setBatteryLevel(null);

    try {
      applyDeviceStatus(await getDeviceStatus({ forceFreshBattery: true }));
    } finally {
      setIsRefreshing(false);
    }
  }, [applyDeviceStatus]);

  useEffect(() => {
    let isMounted = true;

    async function refreshIfMounted() {
      const nextStatus = await getDeviceStatus();

      if (!isMounted) {
        return;
      }

      applyDeviceStatus(nextStatus);
    }

    refreshIfMounted();

    const networkSubscription = Network.addNetworkStateListener((state) => {
      setConnectivity(getConnectivityStatus(state));
    });
    const batterySubscription = Battery.addBatteryLevelListener(({ batteryLevel: nextBatteryLevel }) => {
      setBatteryLevel(nextBatteryLevel);
    });
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refreshIfMounted();
      }
    });
    const refreshInterval = setInterval(refreshIfMounted, DEVICE_STATUS_REFRESH_MS);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
      appStateSubscription.remove();
      networkSubscription.remove();
      batterySubscription.remove();
    };
  }, [applyDeviceStatus]);

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.primary} translucent={false} />
      <Screen
        edges={['left', 'right']}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.card}
          />
        }
        scrollStyle={styles.homeScrollBackground}
        style={styles.noPadding}
      >
        <View style={[styles.homeHero, { paddingTop: insets.top + 24 }]}>
          <Text style={[text.h1, styles.whiteText]}>TrailSafe</Text>
          <Text style={styles.whiteMuted}>Ready for your next adventure</Text>
        </View>

        <View style={[styles.padded, styles.homeBody]}>
          <Card style={styles.homeStatusCard}>
            <Row style={styles.between}>
              <Text style={text.h3}>System Status</Text>
              <Badge tone={systemStatusTone}>{systemStatusLabel}</Badge>
            </Row>
            <View style={styles.stack}>
              <StatusRow icon="wifi" label="Connectivity" value={connectivityLabel} color={connectivityColor} />
              <StatusRow icon="battery" label="Battery" value={batteryLabel} color={batteryColor} />
            </View>
          </Card>

          <SectionTitle>Quick Actions</SectionTitle>
          <View style={styles.grid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => router.push(action.path)}
                style={({ pressed }) => [styles.actionTile, { backgroundColor: action.color }, pressed && styles.pressed]}
              >
                <Icon name={action.icon} color={colors.white} size={32} />
                <Text style={styles.actionText}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <Card>
            <MapPreview />
            <Row style={styles.between}>
              <Text style={text.muted}>Coverage: 10 km2</Text>
              <Pressable onPress={() => router.push('/download')}>
                <Row style={styles.gapSmall}>
                  <Icon name="download" color={colors.primary} size={18} />
                  <Text style={styles.linkText}>Update</Text>
                </Row>
              </Pressable>
            </Row>
          </Card>

          <Card>
            <SectionTitle>Safety Checklist</SectionTitle>
            {checklist.map((item) => (
              <Row key={item.label} style={[styles.gap, styles.listItem]}>
                <View style={[styles.checkCircle, { backgroundColor: item.completed ? colors.success : colors.muted }]}>
                  {item.completed ? <Icon name="check" color={colors.white} size={13} /> : null}
                </View>
                <Text style={item.completed ? text.body : text.muted}>{item.label}</Text>
              </Row>
            ))}
          </Card>

          <Card>
            <SectionTitle>Debug Only</SectionTitle>
            <Text style={text.muted}>Temporary links for testing pages not shown in the main home actions.</Text>
            <View style={styles.stack}>
              {debugLinks.map((link) => (
                <AppButton key={link.path} icon={link.icon} color={link.color} onPress={() => router.push(link.path)}>
                  {link.label}
                </AppButton>
              ))}
            </View>
          </Card>
        </View>
      </Screen>
    </>
  );
}
