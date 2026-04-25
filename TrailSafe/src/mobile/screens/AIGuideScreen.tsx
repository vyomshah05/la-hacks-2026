import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeButton, IconButton, Screen } from '../components';
import { styles } from '../styles';
import { colors } from '../theme';
import { Card, CircleIcon, Icon, Row, text, type FeatherName } from '../ui';

export function AIGuideScreen() {
  const [message, setMessage] = useState('');
  const suggestions = ['Am I going the right way?', 'Guide me back to the trailhead', 'What should I do if I stay offline?', 'Remind me to conserve battery'];

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
          <HeaderPill icon="wifi-off" label="Offline" />
          <HeaderPill icon="map-pin" label="Map Ready" />
          <HeaderPill icon="battery" label="78%" />
        </Row>
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
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
