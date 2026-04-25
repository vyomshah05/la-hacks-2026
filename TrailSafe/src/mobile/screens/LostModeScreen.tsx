import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MapPreview, Screen, StatusRow } from '../components';
import type { RoutePath } from '../routes';
import { styles } from '../styles';
import { colors } from '../theme';
import { Badge, Card, CircleIcon, Icon, Row, SectionTitle, text, type FeatherName } from '../ui';

export function LostModeScreen() {
  const router = useRouter();
  const actions: Array<{ icon: FeatherName; title: string; description: string; color: string; path: RoutePath }> = [
    { icon: 'navigation', title: 'Guide Me Back', description: 'Step-by-step navigation to safety', color: colors.primary, path: '/navigate' },
    { icon: 'map', title: 'Show Last Known Path', description: 'View your route history', color: colors.accent, path: '/map' },
    { icon: 'camera', title: 'Open AR View', description: 'Camera guidance to destination', color: colors.secondary, path: '/ar' },
    { icon: 'alert-circle', title: 'Contact SOS', description: 'Emergency assistance', color: colors.destructive, path: '/sos' },
  ];

  return (
    <Screen style={styles.noHorizontalPadding}>
      <View style={styles.warningHero}>
        <Row style={styles.gap}>
          <CircleIcon name="alert-circle" backgroundColor={colors.warning} color={colors.white} />
          <View>
            <Text style={text.h2}>Lost Mode</Text>
            <Text style={text.muted}>We're here to help</Text>
          </View>
        </Row>
        <Card>
          <Text style={text.h2}>You're Offline, but Not Lost</Text>
          <Text style={[text.muted, styles.topGapSmall]}>
            Your offline map and location history are ready to guide you back to safety.
          </Text>
        </Card>
      </View>

      <View style={styles.padded}>
        <Card>
          <SectionTitle>Current Status</SectionTitle>
          <StatusRow icon="wifi-off" label="Connection" value={<Badge tone="warning">Offline</Badge>} color={colors.warning} />
          <StatusRow icon="map-pin" label="Last Known Location" value={<Badge tone="success">Saved</Badge>} color={colors.success} />
          <StatusRow icon="battery" label="Battery Level" value="78%" color={colors.success} />
          <StatusRow icon="circle" label="Movement" value="Moving" color={colors.accent} />
        </Card>

        {actions.map((action) => (
          <Pressable
            key={action.title}
            onPress={() => router.push(action.path)}
            style={({ pressed }) => [styles.wideAction, { backgroundColor: action.color }, pressed && styles.pressed]}
          >
            <Icon name={action.icon} color={colors.white} size={26} />
            <View style={styles.flex}>
              <Text style={styles.wideActionTitle}>{action.title}</Text>
              <Text style={styles.wideActionSub}>{action.description}</Text>
            </View>
          </Pressable>
        ))}

        <Card>
          <SectionTitle>Next Steps</SectionTitle>
          <MapPreview />
          <View style={styles.tipBox}>
            <Text style={text.body}>Recommended Action</Text>
            <Text style={text.muted}>Head northeast for 1.2 km to reach the main trailhead. The path is mostly downhill.</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
