import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { BackButton, IconButton, Metric, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { Icon, Row } from '../ui';

export function ARGuidanceScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false} style={styles.arScreen}>
      <Row style={styles.between}>
        <Row style={styles.gap}>
          <View style={styles.glassBadge}>
            <Text style={styles.glassText}>GPS 8m</Text>
          </View>
          <View style={styles.glassBadge}>
            <Text style={styles.glassText}>95%</Text>
          </View>
        </Row>
        <BackButton name="x" color={colors.white} style={styles.glassButton} />
      </Row>

      <View style={styles.arCenter}>
        <View style={styles.compassCircle}>
          <Icon name="arrow-up" color={colors.white} size={82} />
        </View>
        <Text style={styles.arDistance}>1.4 km</Text>
        <View style={styles.glassPill}>
          <Icon name="map-pin" color={colors.primary} size={18} />
          <Text style={styles.glassTextLarge}>Main Trailhead</Text>
        </View>
        <View style={styles.successPill}>
          <Text style={styles.successPillText}>Likely trail ahead</Text>
        </View>
      </View>

      <View style={styles.arFooter}>
        <Row style={styles.between}>
          <Metric label="Heading" value="42°" />
          <Metric label="Direction" value="NE" />
          <IconButton name="map" color={colors.white} onPress={() => router.push('/map')} style={styles.glassButton} />
        </Row>
      </View>
    </Screen>
  );
}
