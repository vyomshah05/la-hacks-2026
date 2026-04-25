import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeButton, IconButton, Screen } from '../components';
import { useChat } from '../../agent/useChat';
import { styles } from '../styles';
import { colors } from '../theme';
import { Card, CircleIcon, Row, text } from '../ui';

export function AIGuideScreen() {
  const [inputMessage, setInputMessage] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, isLoading, send } = useChat();
  const suggestions = ['Am I going the right way?', 'Guide me back to the trailhead', 'What should I do if I stay offline?', 'Remind me to conserve battery'];

  useEffect(() => {
    const handleKeyboardChange = (event: { endCoordinates: { height: number; screenY: number } }) => {
      const keyboardHeight = Platform.OS === 'ios' ? Math.max(0, windowHeight - event.endCoordinates.screenY) : event.endCoordinates.height;
      setKeyboardOffset(keyboardHeight > 0 ? Math.max(0, keyboardHeight - insets.bottom + 16) : 0);
    };
    const handleKeyboardHide = () => setKeyboardOffset(0);

    const changeEvent = Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const changeSubscription = Keyboard.addListener(changeEvent, handleKeyboardChange);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      changeSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom, windowHeight]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.primary} translucent={false} />
      <Screen edges={['left', 'right']} scroll={false} style={styles.noPadding}>
        <View style={[styles.homeHero, styles.aiHero, { paddingTop: insets.top + 24 }]}>
          <HomeButton name="x" color={colors.white} style={[styles.headerBack, styles.aiHeaderClose, { top: insets.top + 16 }]} />
          <Text style={[text.h1, styles.whiteText]}>AI Guide</Text>
          <Text style={styles.whiteMuted}>Here to help you stay safe</Text>
        </View>

        <View style={[styles.flex, keyboardOffset > 0 ? { paddingBottom: keyboardOffset } : null]}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatScrollContent}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
          >
            <Pressable onPress={Keyboard.dismiss} style={styles.chatContent}>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.text}
                  time={new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              ))}
              {messages.length === 1 && (
                <>
                  <Text style={text.small}>Suggested questions</Text>
                  <View style={styles.grid}>
                    {suggestions.map((suggestion) => (
                      <Pressable
                        key={suggestion}
                        style={styles.suggestion}
                        onPress={() => send(suggestion)}
                        disabled={isLoading}
                      >
                        <Text style={text.body}>{suggestion}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}
            </Pressable>
          </ScrollView>

          <SafeAreaView edges={['bottom']} style={styles.chatInputBar}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Ask your AI guide..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.chatInput}
              editable={!isLoading}
            />
            <IconButton
              name="send"
              color={colors.white}
              onPress={() => {
                if (isLoading || !inputMessage.trim()) return;
                send(inputMessage);
                setInputMessage('');
              }}
              style={[styles.sendButton, (isLoading || !inputMessage.trim()) && { opacity: 0.5 }]}
            />
          </SafeAreaView>
        </View>
      </Screen>
    </>
  );
}

function ChatBubble({
  role,
  content,
  time,
}: {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}) {
  if (role === 'user') {
    return (
      <Row style={[styles.chatRow, { justifyContent: 'flex-end' }]}>
        <View style={[styles.flex, { alignItems: 'flex-end' }]}>
          <Card style={[styles.chatBubble, { backgroundColor: colors.primary }]}>
            <Text style={[text.body, { color: colors.white }]}>{content}</Text>
          </Card>
          <Text style={text.small}>{time}</Text>
        </View>
      </Row>
    );
  }

  return (
    <Row style={styles.chatRow}>
      <CircleIcon name="message-square" backgroundColor={colors.primary} color={colors.white} size={16} style={styles.chatAvatar} />
      <View style={styles.flex}>
        <Card style={styles.chatBubble}>
          <Text style={text.body}>{content}</Text>
        </Card>
        <Text style={text.small}>{time}</Text>
      </View>
    </Row>
  );
}
