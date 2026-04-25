import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { FeatureRow, HomeButton, MapPreview, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { AppButton, Card, Icon, Row, SectionTitle, text } from '../ui';

export function DownloadAreaScreen() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    },
    [],
  );

  const handleDownload = () => {
    setIsDownloading(true);
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => router.replace('/home'), 500);
          return 100;
        }
        return current + 10;
      });
    }, 200);
  };

  return (
    <Screen
      footer={
        <AppButton icon="download" disabled={isDownloading} onPress={handleDownload}>
          {isDownloading ? 'Downloading...' : 'Save Offline Area'}
        </AppButton>
      }
    >
      <HomeButton />
      <Text style={[text.h1, styles.topGap]}>Download Offline Area</Text>
      <Text style={[text.muted, styles.mutedLead]}>
        Save a compact offline map of your nearby area for use without internet connection.
      </Text>

      <Card>
        <MapPreview large />
        <Text style={[text.muted, styles.center]}>Selected region: 10 km2 around your position</Text>
      </Card>

      <Card>
        <SectionTitle>Download Details</SectionTitle>
        <FeatureRow icon="hard-drive" title="Estimated Size" description="Approximately 25-30 MB of storage" />
        <FeatureRow icon="clock" title="Auto-Refresh" description="Map updates automatically every 24 hours when connected" />
        <FeatureRow icon="download" title="Offline Access" description="Browse and navigate without internet connection" />
      </Card>

      {isDownloading ? (
        <Card>
          <Row style={styles.between}>
            <Text style={text.body}>Downloading map data...</Text>
            <Text style={styles.linkText}>{progress}%</Text>
          </Row>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          {progress === 100 ? (
            <Row style={[styles.gapSmall, styles.topGap]}>
              <Icon name="check" color={colors.success} />
              <Text style={{ color: colors.success }}>Download complete!</Text>
            </Row>
          ) : null}
        </Card>
      ) : null}
    </Screen>
  );
}
