import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import type { AppState, ChatMessage, SOSPayload } from '../shared/types'
import { speak } from './voiceService'
import { triggerSOS } from './sosService'
import { sendMessage } from '../agent/survivalAgent'

const MOCK_AGENT = process.env.EXPO_PUBLIC_MOCK_AGENT === 'true'

function mockSend(text: string): Promise<string> {
  return new Promise((r) => setTimeout(() => r(`Mock reply to: ${text}`), 1000))
}

type Props = { appState: AppState }

export default function SurvivalChat({ appState }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sosModalVisible, setSosModalVisible] = useState(false)
  const [sosSending, setSosSending] = useState(false)

  // Pressable long-press fallback (works without GestureHandlerRootView)
  const sosTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sosProgress, setSosProgress] = useState(false)

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const onSend = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return

    setInput('')
    setSending(true)

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    }
    addMessage(userMsg)

    try {
      const reply = MOCK_AGENT
        ? await mockSend(text)
        : await sendMessage(text, appState, messages)

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
        timestamp: Date.now(),
      }
      addMessage(assistantMsg)
      await speak(reply, appState.isOffline)
    } catch (err) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Error getting response. Try again.',
        timestamp: Date.now(),
      })
    } finally {
      setSending(false)
    }
  }, [input, sending, appState, messages, addMessage])

  const onSOSPressIn = useCallback(() => {
    setSosProgress(true)
    sosTimer.current = setTimeout(() => {
      setSosModalVisible(true)
      setSosProgress(false)
    }, 3000)
  }, [])

  const onSOSPressOut = useCallback(() => {
    if (sosTimer.current) {
      clearTimeout(sosTimer.current)
      sosTimer.current = null
    }
    setSosProgress(false)
  }, [])

  const onConfirmSOS = useCallback(async () => {
    if (!appState.position) {
      Alert.alert('No GPS', 'Cannot send SOS without a GPS fix.')
      setSosModalVisible(false)
      return
    }

    setSosModalVisible(false)
    setSosSending(true)

    const payload: SOSPayload = {
      position: appState.position,
      locationHistory: [appState.position],
      batteryLevel: appState.batteryLevel,
      timestamp: Date.now(),
    }

    try {
      await triggerSOS(payload)
      Alert.alert('SOS Sent', 'Your distress signal has been dispatched.')
    } catch {
      Alert.alert('SOS Failed', 'Could not send SOS. It will retry when back online.')
    } finally {
      setSosSending(false)
    }
  }, [appState])

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user'
    return (
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
          {item.text}
        </Text>
      </View>
    )
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask TrailSafe…"
          placeholderTextColor="#999"
          editable={!sending}
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendBtnText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* SOS button — Pressable + setTimeout fallback (works in Expo Go) */}
      <Pressable
        onPressIn={onSOSPressIn}
        onPressOut={onSOSPressOut}
        disabled={sosSending}
        style={[styles.sosBtn, sosProgress && styles.sosBtnActive, sosSending && styles.sosBtnDisabled]}
      >
        {sosSending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sosBtnText}>
            {sosProgress ? 'HOLD…' : 'HOLD 3s FOR SOS'}
          </Text>
        )}
      </Pressable>

      {/* SOS confirmation modal */}
      <Modal
        visible={sosModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSosModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Send SOS?</Text>
            <Text style={styles.modalBody}>
              This will dispatch your location and battery level as a distress signal.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setSosModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={onConfirmSOS}
              >
                <Text style={styles.modalBtnConfirmText}>Send SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  messageList: { padding: 12, paddingBottom: 4 },

  bubble: { maxWidth: '80%', borderRadius: 14, padding: 10, marginVertical: 4 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: '#1a6ef5' },
  bubbleAssistant: { alignSelf: 'flex-start', backgroundColor: '#2a2a2a' },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextAssistant: { color: '#e8e8e8' },

  inputRow: { flexDirection: 'row', padding: 8, gap: 8, borderTopWidth: 1, borderTopColor: '#222' },
  input: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendBtn: { backgroundColor: '#1a6ef5', borderRadius: 20, paddingHorizontal: 18, justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  sosBtn: {
    margin: 8,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#c0392b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBtnActive: { backgroundColor: '#e74c3c', opacity: 0.75 },
  sosBtnDisabled: { opacity: 0.4 },
  sosBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1.5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#1c1c1c', borderRadius: 16, padding: 24, width: '80%' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  modalBody: { color: '#aaa', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#333' },
  modalBtnCancelText: { color: '#ccc', fontWeight: '600' },
  modalBtnConfirm: { backgroundColor: '#c0392b' },
  modalBtnConfirmText: { color: '#fff', fontWeight: '700' },
})
