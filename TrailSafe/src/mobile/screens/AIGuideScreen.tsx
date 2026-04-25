import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeButton, IconButton, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { Card, CircleIcon, Icon, Row, text } from '../ui';

export function AIGuideScreen() {
  const [message, setMessage] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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
            contentContainerStyle={styles.chatScrollContent}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
          >
            <Pressable onPress={Keyboard.dismiss} style={styles.chatContent}>
              <ChatBubble type="ai" content="Hi! I'm your AI guide. I can help you navigate back to safety using your offline map and location history. How can I assist you?" time="10:23 AM" />
              <View style={styles.tipBox}>
                <Row style={styles.gap}>
                  <Icon name="zap" color={colors.accent} />
                  <View style={styles.flex}>
                    <Text style={text.body}>Safety Tip</Text>
                    <Text style={text.muted}>Stay hydrated and conserve your phone's battery. Your offline map is ready and your last known location has been saved.</Text>
                    <Text style={text.small}>10:24 AM</Text>
                  </View>
                </Row>
              </View>
              <Text style={text.small}>Suggested questions</Text>
              <View style={styles.grid}>
                {suggestions.map((suggestion) => (
                  <Pressable key={suggestion} style={styles.suggestion}>
                    <Text style={text.body}>{suggestion}</Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </ScrollView>

          <SafeAreaView edges={['bottom']} style={styles.chatInputBar}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask your AI guide..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.chatInput}
            />
            <IconButton name="send" color={colors.white} onPress={() => setMessage('')} style={styles.sendButton} />
          </SafeAreaView>
        </View>
      </Screen>
    </>
  );
}

function ChatBubble({ content, time }: { type: 'ai'; content: string; time: string }) {
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
