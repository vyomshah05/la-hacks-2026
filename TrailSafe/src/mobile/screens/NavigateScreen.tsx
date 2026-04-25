import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { BackButton, MapPreview, Metric, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { AppButton, Badge, Card, CircleIcon, Icon, Row, text, type FeatherName } from '../ui';

export function NavigateScreen() {
  const router = useRouter();

  return (
    <Screen
      footer={
        <AppButton icon="camera" color={colors.accent} onPress={() => router.push('/ar')}>
          Switch to AR View
        </AppButton>
      }
    >
      <BackButton fallback="/lost" />
      <Row style={[styles.between, styles.topGap]}>
        <Text style={text.h2}>Navigation</Text>
        <Badge tone="success">On Track</Badge>
      </Row>
      <Text style={text.muted}>Guiding you back to safety</Text>

      <Card>
        <Row style={styles.between}>
          <Text style={text.muted}>Progress to Trailhead</Text>
          <Text style={text.body}>29%</Text>
        </Row>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '29%' }]} />
        </View>
        <Row style={styles.between}>
          <Text style={text.small}>0.4 km traveled</Text>
          <Text style={text.small}>1.4 km total</Text>
        </Row>
      </Card>

      <MapPreview large />

      <View style={styles.nextStepCard}>
        <Row style={styles.gap}>
          <CircleIcon name="compass" backgroundColor="#ffffff22" color={colors.white} size={30} />
          <View style={styles.flex}>
            <Text style={styles.whiteMuted}>Next Step</Text>
            <Text style={[text.h2, styles.whiteText]}>Continue on the main trail</Text>
            <Row style={[styles.gapSmall, styles.topGapSmall]}>
              <View style={styles.headerPill}>
                <Text style={styles.headerPillText}>Northeast</Text>
              </View>
              <View style={styles.headerPill}>
                <Text style={styles.headerPillText}>120 m</Text>
              </View>
            </Row>
          </View>
        </Row>
        <Row style={[styles.between, styles.topBorder]}>
          <Metric label="Distance Left" value="1.0 km" />
          <Metric label="Est. Time" value="18 min" />
          <Metric label="Elevation" value="-45 m" />
        </Row>
      </View>

      <RouteStep active title="Continue on main trail" detail="120 m northeast" icon="navigation" />
      <RouteStep title="Turn right at fork" detail="340 m northeast" icon="arrow-right" />
      <RouteStep title="Arrive at trailhead" detail="1.0 km north" icon="map-pin" />
    </Screen>
  );
}

function RouteStep({ active = false, title, detail, icon }: { active?: boolean; title: string; detail: string; icon: FeatherName }) {
  return (
    <Card style={[styles.routeStep, !active && styles.inactive]}>
      <CircleIcon name={active ? 'check' : 'circle'} size={15} backgroundColor={active ? `${colors.success}18` : colors.muted} color={active ? colors.success : colors.mutedForeground} />
      <View style={styles.flex}>
        <Text style={text.body}>{title}</Text>
        <Text style={text.small}>{detail}</Text>
      </View>
      <Icon name={icon} color={colors.mutedForeground} />
    </Card>
  );
}
