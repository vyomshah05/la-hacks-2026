import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { RoutePath } from '../routes';
import { MapPreview, Screen, StatusRow } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { Badge, Card, Icon, Row, SectionTitle, text, type FeatherName } from '../ui';

export function HomeScreen() {
  const router = useRouter();
  const quickActions: Array<{ icon: FeatherName; label: string; path: RoutePath; color: string }> = [
    { icon: 'play', label: 'Start Hike', path: '/map', color: colors.primary },
    { icon: 'map', label: 'Offline Map', path: '/map', color: colors.accent },
    { icon: 'message-square', label: 'AI Agent', path: '/ai', color: colors.warning },
    { icon: 'camera', label: 'AR Guide', path: '/ar', color: colors.secondary },
  ];
  const checklist = [
    { label: 'Offline map downloaded', completed: true },
    { label: 'Emergency contacts set', completed: true },
    { label: 'Battery above 50%', completed: true },
    { label: 'Share trip details', completed: false },
  ];

  return (
    <Screen style={styles.noHorizontalPadding}>
      <View style={styles.homeHero}>
        <Text style={[text.h1, styles.whiteText]}>TrailSafe</Text>
        <Text style={styles.whiteMuted}>Ready for your next adventure</Text>
      </View>

      <View style={styles.padded}>
        <Card style={styles.raisedCard}>
          <Row style={styles.between}>
            <Text style={text.h3}>System Status</Text>
            <Badge tone="success">All Ready</Badge>
          </Row>
          <View style={styles.stack}>
            <StatusRow icon="wifi" label="Connectivity" value="Online" color={colors.success} />
            <StatusRow icon="download" label="Offline Map" value="Ready" color={colors.success} />
            <StatusRow icon="battery" label="Battery" value="78%" color={colors.success} />
            <StatusRow icon="map-pin" label="Last Refresh" value="2 hours ago" />
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
      </View>
    </Screen>
  );
}
