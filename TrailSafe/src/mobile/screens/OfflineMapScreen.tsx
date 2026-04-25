import { useRouter } from 'expo-router';
import { Text, TextInput, View } from 'react-native';
import { HomeButton, MapPreview, Screen, StatusRow } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { AppButton, Badge, Card, Icon, Row, text } from '../ui';

export function OfflineMapScreen() {
  const router = useRouter();

  return (
    <Screen
      scroll={false}
      footer={
        <Card style={styles.mapSheet}>
          <Row style={styles.between}>
            <Text style={text.h3}>Offline Map Status</Text>
            <Badge tone="success">Available Offline</Badge>
          </Row>
          <View style={styles.stack}>
            <StatusRow icon="map" label="Downloaded Area" value="10.2 km2" />
            <StatusRow icon="hard-drive" label="Storage Used" value="24.8 MB" />
            <StatusRow icon="clock" label="Last Updated" value="2 hours ago" />
          </View>
          <Row style={styles.gap}>
            <AppButton icon="download" onPress={() => router.push('/download')} style={styles.flex}>
              Update Area
            </AppButton>
            <HomeButton name="home" />
          </Row>
        </Card>
      }
    >
      <View style={styles.mapCanvas}>
        <MapPreview large />
      </View>
      <View style={styles.mapControls}>
        <Row style={styles.gap}>
          <HomeButton />
          <View style={styles.searchBox}>
            <Icon name="search" color={colors.mutedForeground} />
            <TextInput placeholder="Search location..." placeholderTextColor={colors.mutedForeground} style={styles.input} />
          </View>
        </Row>
        <Row style={[styles.gap, styles.wrap]}>
          <AppButton icon="navigation" color={colors.card} style={styles.chipButton}>
            <Text style={styles.darkButtonText}>Recenter</Text>
          </AppButton>
          <AppButton icon="compass" color={colors.card} style={styles.chipButton}>
            <Text style={styles.darkButtonText}>Compass</Text>
          </AppButton>
        </Row>
      </View>
    </Screen>
  );
}
