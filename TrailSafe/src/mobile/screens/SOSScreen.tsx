import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackButton, FeatureRow, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { AppButton, Card, CircleIcon, Icon, Row, SectionTitle, text } from '../ui';

export function SOSScreen() {
  const [isListening, setIsListening] = useState(false);

  return (
    <Screen
      style={styles.noHorizontalPadding}
      footer={
        <>
          <AppButton icon="alert-circle" color={colors.destructive}>
            Activate Emergency Beacon
          </AppButton>
          <Text style={[text.small, styles.center, styles.footerNote]}>
            This will send your location to emergency services and contacts
          </Text>
        </>
      }
    >
      <View style={styles.dangerHeader}>
        <BackButton fallback="/lost" color={colors.white} style={styles.headerBack} />
        <Row style={styles.gap}>
          <CircleIcon name="alert-circle" backgroundColor="#ffffff22" color={colors.white} />
          <View>
            <Text style={[text.h2, styles.whiteText]}>Emergency SOS</Text>
            <Text style={styles.whiteMuted}>Help is on the way</Text>
          </View>
        </Row>
      </View>

      <View style={styles.padded}>
        <Card style={styles.raisedCard}>
          <SectionTitle>Voice Guidance</SectionTitle>
          <Pressable onPress={() => setIsListening((value) => !value)} style={[styles.micButton, { backgroundColor: isListening ? colors.destructive : colors.primary }]}>
            <Icon name="mic" color={colors.white} size={44} />
          </Pressable>
          <Text style={[text.body, styles.center]}>{isListening ? 'Listening...' : 'Tap to speak'}</Text>
          <Text style={[text.muted, styles.center]}>Ask for directions or activate emergency beacon</Text>
          {isListening ? (
            <View style={styles.tipBox}>
              <Text style={text.muted}>"How do I get back to the trailhead?"</Text>
            </View>
          ) : null}
        </Card>

        <Card>
          <Row style={styles.between}>
            <SectionTitle>Location Payload</SectionTitle>
            <Icon name="copy" color={colors.mutedForeground} />
          </Row>
          <FeatureRow icon="map-pin" title="Coordinates" description="47.6062° N, 122.3321° W. Accuracy: 8 meters" />
          <FeatureRow icon="clock" title="Last Updated" description="Apr 25, 2026 10:23 AM" />
          <FeatureRow icon="battery" title="Battery Level" description="78%" />
        </Card>

        <Card>
          <SectionTitle>Emergency Contacts</SectionTitle>
          <Contact name="John Doe" label="Primary Contact" />
          <Contact name="Jane Smith" label="Secondary Contact" accent />
        </Card>
      </View>
    </Screen>
  );
}

function Contact({ name, label, accent = false }: { name: string; label: string; accent?: boolean }) {
  return (
    <Row style={styles.contact}>
      <CircleIcon name="user" color={accent ? colors.accent : colors.primary} backgroundColor={accent ? `${colors.accent}18` : `${colors.primary}18`} />
      <View style={styles.flex}>
        <Text style={text.body}>{name}</Text>
        <Text style={text.small}>{label}</Text>
      </View>
      <Icon name="phone" color={colors.mutedForeground} />
    </Row>
  );
}
