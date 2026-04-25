import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AppState, ChatMessage } from '../../shared/types';
import { sendMessage } from '../../agent/survivalAgent';
import { startRecording, stopRecordingAndTranscribe } from '../../voice/speechToTextService';
import { speak } from '../../voice/voiceService';
import { HomeButton, IconButton, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { Card, CircleIcon, Icon, Row, text, type FeatherName } from '../ui';

const MOCK_AGENT = process.env.EXPO_PUBLIC_MOCK_AGENT === 'true';

const mockAppState: AppState = {
  position: { lat: 34.0522, lon: -118.2437, heading: 45, accuracy: 5, timestamp: Date.now() },
  destination: null,
  isOffline: false,
  isStationary: false,
  batteryLevel: 0.78,
};

const INITIAL_MESSAGE: ChatMessage = {
  id: '0',
  role: 'assistant',
  text: "Hi! I'm your AI guide. I can help you navigate back to safety using your offline map and location history. How can I assist you?",
  timestamp: Date.now(),
};

const SUGGESTIONS = [
  'Am I going the right way?',
  'Guide me back to the trailhead',
  'What should I do if I stay offline?',
  'Remind me to conserve battery',
];

export function AIGuideScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const appendMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  const sendText = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || sending) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSending(true);

      try {
        let reply: string;
        if (MOCK_AGENT) {
          await new Promise((r) => setTimeout(r, 800));
          reply = `[Mock] You said: "${trimmed}"`;
        } else {
          reply = await sendMessage(trimmed, mockAppState, [...messages, userMsg]);
        }

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: reply,
          timestamp: Date.now(),
        };
        appendMessage(assistantMsg);
        await speak(reply, mockAppState.isOffline);
      } catch {
        // voice/agent errors are silent to the UI
      } finally {
        setSending(false);
      }
    },
    [sending, messages, appendMessage],
  );

  const onMicPress = useCallback(async () => {
    if (recording) {
      setRecording(false);
      setTranscribing(true);
      try {
        const transcript = await stopRecordingAndTranscribe(mockAppState.isOffline);
        if (transcript) await sendText(transcript);
      } catch {
        // ignore
      } finally {
        setTranscribing(false);
      }
    } else {
      try {
        await startRecording();
        setRecording(true);
      } catch {
        Alert.alert('Microphone Error', 'Could not access the microphone. Please check permissions.');
      }
    }
  }, [recording, sendText]);

  const disabled = sending || recording || transcribing;

  return (
    <Screen scroll={false} style={styles.noPadding}>
      <View style={styles.primaryHeader}>
        <HomeButton color={colors.white} style={styles.headerBack} />
        <Row style={styles.gap}>
          <CircleIcon name="message-square" backgroundColor="#ffffff22" color={colors.white} />
          <View>
            <Text style={[text.h2, styles.whiteText]}>AI Guide</Text>
            <Text style={styles.whiteMuted}>Here to help you stay safe</Text>
          </View>
        </Row>
        <Row style={[styles.gapSmall, styles.wrap, styles.topGap]}>
          <HeaderPill
            icon={mockAppState.isOffline ? 'wifi-off' : 'wifi'}
            label={mockAppState.isOffline ? 'Offline' : 'Online'}
          />
          <HeaderPill icon="map-pin" label="Map Ready" />
          <HeaderPill icon="battery" label={`${Math.round(mockAppState.batteryLevel * 100)}%`} />
        </Row>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg) =>
          msg.role === 'assistant' ? (
            <ChatBubble key={msg.id} content={msg.text} time={formatTime(msg.timestamp)} />
          ) : (
            <UserBubble key={msg.id} content={msg.text} time={formatTime(msg.timestamp)} />
          ),
        )}
        {messages.length === 1 && (
          <>
            <Text style={text.small}>Suggested questions</Text>
            <View style={styles.grid}>
              {SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  style={styles.suggestion}
                  onPress={() => sendText(s)}
                  disabled={disabled}
                >
                  <Text style={text.body}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {sending && (
          <Row style={styles.chatRow}>
            <CircleIcon
              name="message-square"
              backgroundColor={colors.primary}
              color={colors.white}
              size={16}
              style={styles.chatAvatar}
            />
            <ActivityIndicator color={colors.primary} />
          </Row>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.chatInputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask your AI guide..."
          placeholderTextColor={colors.mutedForeground}
          style={styles.chatInput}
          editable={!disabled}
          onSubmitEditing={() => sendText(input)}
          returnKeyType="send"
        />
        {transcribing ? (
          <View style={localStyles.micSpinner}>
            <ActivityIndicator color={colors.white} size="small" />
          </View>
        ) : (
          <IconButton
            name={recording ? 'square' : 'mic'}
            color={colors.white}
            onPress={onMicPress}
            style={recording ? localStyles.micActive : localStyles.micIdle}
          />
        )}
        <IconButton
          name="send"
          color={colors.white}
          onPress={() => sendText(input)}
          style={disabled ? [styles.sendButton, localStyles.dimmed] : styles.sendButton}
        />
      </SafeAreaView>
    </Screen>
  );
}

function HeaderPill({ icon, label }: { icon: FeatherName; label: string }) {
  return (
    <View style={styles.headerPill}>
      <Icon name={icon} color={colors.white} size={13} />
      <Text style={styles.headerPillText}>{label}</Text>
    </View>
  );
}

function ChatBubble({ content, time }: { content: string; time: string }) {
  return (
    <Row style={styles.chatRow}>
      <CircleIcon
        name="message-square"
        backgroundColor={colors.primary}
        color={colors.white}
        size={16}
        style={styles.chatAvatar}
      />
      <View style={styles.flex}>
        <Card style={styles.chatBubble}>
          <Text style={text.body}>{content}</Text>
        </Card>
        <Text style={text.small}>{time}</Text>
      </View>
    </Row>
  );
}

function UserBubble({ content, time }: { content: string; time: string }) {
  return (
    <View style={localStyles.userBubbleWrap}>
      <View style={localStyles.userBubble}>
        <Text style={localStyles.userBubbleText}>{content}</Text>
      </View>
      <Text style={[text.small, localStyles.userTime]}>{time}</Text>
    </View>
  );
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const localStyles = StyleSheet.create({
  micIdle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  micActive: {
    backgroundColor: colors.destructive,
    borderColor: colors.destructive,
  },
  micSpinner: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  dimmed: {
    opacity: 0.5,
  },
  userBubbleWrap: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    borderBottomRightRadius: 6,
    maxWidth: '80%',
    padding: 14,
  },
  userBubbleText: {
    color: colors.white,
    fontSize: 15,
  },
  userTime: {
    marginTop: 4,
  },
});
