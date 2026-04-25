import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { AppButton, Badge, Card, CircleIcon, Row, text, type FeatherName } from '../ui';

export function OnboardingScreen() {
  const router = useRouter();
  const permissions: Array<{ icon: FeatherName; title: string; description: string; required: boolean }> = [
    {
      icon: 'map-pin',
      title: 'Location Access',
      description: 'Track your position and navigate back to safety',
      required: true,
    },
    {
      icon: 'camera',
      title: 'Camera Access',
      description: 'AR guidance to show you the way',
      required: true,
    },
    {
      icon: 'bell',
      title: 'Notifications',
      description: 'Safety reminders and alerts',
      required: false,
    },
    {
      icon: 'users',
      title: 'Emergency Contacts',
      description: 'Quick SOS access when you need help',
      required: false,
    },
  ];

  return (
    <Screen
      footer={
        <>
          <AppButton icon="check" onPress={() => router.replace('/home')}>
            Enable Safe Hike Mode
          </AppButton>
          <Text style={[text.small, styles.center, styles.footerNote]}>
            We only access your data when necessary for your safety
          </Text>
        </>
      }
    >
      <CircleIcon name="map-pin" backgroundColor={colors.primary} color={colors.white} size={30} style={styles.heroIcon} />
      <Text style={text.h1}>Stay Safe on Every Trail</Text>
      <Text style={[text.body, styles.mutedLead]}>
        TrailSafe keeps you safe with offline maps, AR guidance, and AI support, even without signal.
      </Text>

      <View style={styles.stackLarge}>
        {permissions.map((permission) => (
          <Card key={permission.title}>
            <Row style={styles.cardRow}>
              <CircleIcon name={permission.icon} />
              <View style={styles.flex}>
                <Row style={[styles.gap, styles.wrap]}>
                  <Text style={text.h3}>{permission.title}</Text>
                  {permission.required ? <Badge tone="warning">Required</Badge> : null}
                </Row>
                <Text style={text.muted}>{permission.description}</Text>
              </View>
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
