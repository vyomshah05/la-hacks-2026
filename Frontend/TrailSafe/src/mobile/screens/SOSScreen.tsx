import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { AppState } from '../../shared/types';
import { startRecording, stopRecordingAndTranscribe } from '../../voice/speechToTextService';
import { triggerSOS } from '../../voice/sosService';
import { BackButton, FeatureRow, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { Card, CircleIcon, Icon, Row, SectionTitle, text } from '../ui';

const mockAppState: AppState = {
  position: { lat: 47.6062, lon: -122.3321, heading: 0, accuracy: 8, timestamp: Date.now() },
  destination: null,
  isOffline: false,
  isStationary: false,
  batteryLevel: 0.78,
};

export function SOSScreen() {
  const [isListening, setIsListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [sosProgress, setSosProgress] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const sosTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMicPress = useCallback(async () => {
    if (isListening) {
      setIsListening(false);
      setTranscribing(true);
      try {
        const t = await stopRecordingAndTranscribe(mockAppState.isOffline);
        setTranscript(t);
      } catch {
        // ignore
      } finally {
        setTranscribing(false);
      }
    } else {
      try {
        await startRecording();
        setIsListening(true);
      } catch {
        Alert.alert('Microphone Error', 'Could not access the microphone. Please check permissions.');
      }
    }
  }, [isListening]);

  const onSOSPressIn = useCallback(() => {
    setSosProgress(true);
    sosTimer.current = setTimeout(() => {
      setSosProgress(false);
      setSosModalVisible(true);
    }, 3000);
  }, []);

  const onSOSPressOut = useCallback(() => {
    if (sosTimer.current) clearTimeout(sosTimer.current);
    setSosProgress(false);
  }, []);

  const onConfirmSOS = useCallback(async () => {
    if (!mockAppState.position) {
      Alert.alert('No Location', 'GPS position is unavailable. Cannot send SOS.');
      return;
    }
    setSosSending(true);
    try {
      await triggerSOS({
        position: mockAppState.position,
        locationHistory: [mockAppState.position],
        batteryLevel: mockAppState.batteryLevel,
        timestamp: Date.now(),
      });
      setSosModalVisible(false);
      Alert.alert('SOS Sent', 'Your location has been dispatched to emergency services.');
    } catch {
      Alert.alert('Error', 'Failed to send SOS. Please try again.');
    } finally {
      setSosSending(false);
    }
  }, []);

  return (
    <>
      <Screen style={styles.noHorizontalPadding}>
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
            {transcribing ? (
              <View style={[styles.micButton, { backgroundColor: colors.primary }]}>
                <ActivityIndicator color={colors.white} size="large" />
              </View>
            ) : (
              <Pressable
                onPress={onMicPress}
                style={[styles.micButton, { backgroundColor: isListening ? colors.destructive : colors.primary }]}
              >
                <Icon name={isListening ? 'square' : 'mic'} color={colors.white} size={44} />
              </Pressable>
            )}
            <Text style={[text.body, styles.center]}>
              {transcribing ? 'Transcribing…' : isListening ? 'Listening… tap to stop' : 'Tap to speak'}
            </Text>
            <Text style={[text.muted, styles.center]}>
              Ask for directions or describe your situation
            </Text>
            {(transcript || isListening) ? (
              <View style={styles.tipBox}>
                <Text style={text.muted}>{transcript ?? '"Speak now…"'}</Text>
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
            <FeatureRow icon="battery" title="Battery Level" description={`${Math.round(mockAppState.batteryLevel * 100)}%`} />
          </Card>

          <Card>
            <SectionTitle>Emergency Contacts</SectionTitle>
            <Contact name="John Doe" label="Primary Contact" />
            <Contact name="Jane Smith" label="Secondary Contact" accent />
          </Card>

          <Pressable
            onPressIn={onSOSPressIn}
            onPressOut={onSOSPressOut}
            style={({ pressed }) => [
              localStyles.sosButton,
              { backgroundColor: sosProgress ? '#a01010' : colors.destructive },
              pressed && { opacity: 0.92 },
            ]}
          >
            <Icon name="alert-triangle" color={colors.white} size={26} />
            <Text style={localStyles.sosLabel}>{sosProgress ? 'HOLD…' : 'HOLD 3s FOR SOS'}</Text>
          </Pressable>
        </View>
      </Screen>

      <Modal visible={sosModalVisible} transparent animationType="fade">
        <View style={localStyles.modalOverlay}>
          <Card style={localStyles.modalCard}>
            <Text style={[text.h3, styles.center]}>Confirm SOS</Text>
            <Text style={[text.body, styles.center, localStyles.modalBody]}>
              This will dispatch your location to emergency services. Continue?
            </Text>
            <View style={[styles.gap, localStyles.modalActions]}>
              {sosSending ? (
                <ActivityIndicator color={colors.destructive} />
              ) : (
                <>
                  <Pressable style={localStyles.confirmButton} onPress={onConfirmSOS}>
                    <Text style={localStyles.confirmText}>Send SOS</Text>
                  </Pressable>
                  <Pressable
                    style={localStyles.cancelButton}
                    onPress={() => setSosModalVisible(false)}
                  >
                    <Text style={[text.body, styles.center]}>Cancel</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Card>
        </View>
      </Modal>
    </>
  );
}

function Contact({ name, label, accent = false }: { name: string; label: string; accent?: boolean }) {
  return (
    <Row style={styles.contact}>
      <CircleIcon
        name="user"
        color={accent ? colors.accent : colors.primary}
        backgroundColor={accent ? `${colors.accent}18` : `${colors.primary}18`}
      />
      <View style={styles.flex}>
        <Text style={text.body}>{name}</Text>
        <Text style={text.small}>{label}</Text>
      </View>
      <Icon name="phone" color={colors.mutedForeground} />
    </Row>
  );
}

const localStyles = StyleSheet.create({
  sosButton: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 12,
    height: 80,
    justifyContent: 'center',
  },
  sosLabel: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: '#000000b3',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    width: '100%',
  },
  modalBody: {
    marginTop: 8,
  },
  modalActions: {
    marginTop: 18,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.destructive,
    borderRadius: 16,
    padding: 16,
  },
  confirmText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 16,
  },
});
