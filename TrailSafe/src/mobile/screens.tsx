import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Badge, Card, CircleIcon, Icon, Row, SectionTitle, text, type FeatherName } from './ui';
import { colors, spacing } from './theme';

type RoutePath = '/home' | '/map' | '/download' | '/lost' | '/ar' | '/ai' | '/sos' | '/navigate';

function Screen({
  children,
  footer,
  scroll = true,
  style,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const contentStyle = [styles.content, style];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={[contentStyle, footer ? styles.withFooter : null]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[contentStyle, styles.flex]}>{children}</View>
      )}
      {footer ? (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          {footer}
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}

function IconButton({
  name,
  onPress,
  style,
  color = colors.foreground,
}: {
  name: FeatherName;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.iconButton, style, pressed && styles.pressed]}>
      <Icon name={name} color={color} size={21} />
    </Pressable>
  );
}

function StatusRow({
  icon,
  label,
  value,
  color = colors.primary,
}: {
  icon: FeatherName;
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <Row style={styles.statusRow}>
      <Row style={styles.gap}>
        <Icon name={icon} color={color} />
        <Text style={text.body}>{label}</Text>
      </Row>
      {typeof value === 'string' ? <Text style={text.muted}>{value}</Text> : value}
    </Row>
  );
}

function MapPreview({ large = false }: { large?: boolean }) {
  return (
    <View style={[styles.mapPreview, large && styles.mapPreviewLarge]}>
      <View style={styles.mapRing}>
        <Icon name="map-pin" color={colors.primary} size={large ? 38 : 30} />
      </View>
      <View style={[styles.mapDot, { top: '22%', left: '18%', backgroundColor: colors.primary }]} />
      <View style={[styles.mapDot, { bottom: '20%', right: '20%', backgroundColor: colors.accent }]} />
      <View style={styles.routeLine} />
    </View>
  );
}

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

export function HomeScreen() {
  const router = useRouter();
  const quickActions: Array<{ icon: FeatherName; label: string; path: RoutePath; color: string }> = [
    { icon: 'play', label: 'Start Hike', path: '/map', color: colors.primary },
    { icon: 'map', label: 'Offline Map', path: '/map', color: colors.accent },
    { icon: 'alert-circle', label: 'Lost Mode', path: '/lost', color: colors.warning },
    { icon: 'camera', label: 'AR Guide', path: '/ar', color: colors.secondary },
  ];
  const checklist = [
    { label: 'Offline map downloaded', completed: true },
    { label: 'Emergency contacts set', completed: true },
    { label: 'Battery above 50%', completed: true },
    { label: 'Share trip details', completed: false },
  ];

  return (
    <Screen style={styles.noHorizontalPadding}>
      <View style={styles.homeHero}>
        <Text style={[text.h1, styles.whiteText]}>TrailSafe</Text>
        <Text style={styles.whiteMuted}>Ready for your next adventure</Text>
      </View>

      <View style={styles.padded}>
        <Card style={styles.raisedCard}>
          <Row style={styles.between}>
            <Text style={text.h3}>System Status</Text>
            <Badge tone="success">All Ready</Badge>
          </Row>
          <View style={styles.stack}>
            <StatusRow icon="wifi" label="Connectivity" value="Online" color={colors.success} />
            <StatusRow icon="download" label="Offline Map" value="Ready" color={colors.success} />
            <StatusRow icon="battery" label="Battery" value="78%" color={colors.success} />
            <StatusRow icon="map-pin" label="Last Refresh" value="2 hours ago" />
          </View>
        </Card>

        <SectionTitle>Quick Actions</SectionTitle>
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => router.push(action.path)}
              style={({ pressed }) => [styles.actionTile, { backgroundColor: action.color }, pressed && styles.pressed]}
            >
              <Icon name={action.icon} color={colors.white} size={32} />
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <Card>
          <MapPreview />
          <Row style={styles.between}>
            <Text style={text.muted}>Coverage: 10 km2</Text>
            <Pressable onPress={() => router.push('/download')}>
              <Row style={styles.gapSmall}>
                <Icon name="download" color={colors.primary} size={18} />
                <Text style={styles.linkText}>Update</Text>
              </Row>
            </Pressable>
          </Row>
        </Card>

        <Card>
          <SectionTitle>Safety Checklist</SectionTitle>
          {checklist.map((item) => (
            <Row key={item.label} style={[styles.gap, styles.listItem]}>
              <View style={[styles.checkCircle, { backgroundColor: item.completed ? colors.success : colors.muted }]}>
                {item.completed ? <Icon name="check" color={colors.white} size={13} /> : null}
              </View>
              <Text style={item.completed ? text.body : text.muted}>{item.label}</Text>
            </Row>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

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
            <IconButton name="home" onPress={() => router.push('/home')} />
          </Row>
        </Card>
      }
    >
      <View style={styles.mapCanvas}>
        <MapPreview large />
      </View>
      <View style={styles.mapControls}>
        <Row style={styles.gap}>
          <IconButton name="arrow-left" onPress={() => router.push('/home')} />
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
      <IconButton name="arrow-left" onPress={() => router.push('/home')} />
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

function FeatureRow({ icon, title, description }: { icon: FeatherName; title: string; description: string }) {
  return (
    <Row style={styles.featureRow}>
      <CircleIcon name={icon} />
      <View style={styles.flex}>
        <Text style={text.body}>{title}</Text>
        <Text style={text.small}>{description}</Text>
      </View>
    </Row>
  );
}

export function LostModeScreen() {
  const router = useRouter();
  const actions: Array<{ icon: FeatherName; title: string; description: string; color: string; path: RoutePath }> = [
    { icon: 'navigation', title: 'Guide Me Back', description: 'Step-by-step navigation to safety', color: colors.primary, path: '/navigate' },
    { icon: 'map', title: 'Show Last Known Path', description: 'View your route history', color: colors.accent, path: '/map' },
    { icon: 'camera', title: 'Open AR View', description: 'Camera guidance to destination', color: colors.secondary, path: '/ar' },
    { icon: 'alert-circle', title: 'Contact SOS', description: 'Emergency assistance', color: colors.destructive, path: '/sos' },
  ];

  return (
    <Screen style={styles.noHorizontalPadding}>
      <View style={styles.warningHero}>
        <Row style={styles.gap}>
          <CircleIcon name="alert-circle" backgroundColor={colors.warning} color={colors.white} />
          <View>
            <Text style={text.h2}>Lost Mode</Text>
            <Text style={text.muted}>We're here to help</Text>
          </View>
        </Row>
        <Card>
          <Text style={text.h2}>You're Offline, but Not Lost</Text>
          <Text style={[text.muted, styles.topGapSmall]}>
            Your offline map and location history are ready to guide you back to safety.
          </Text>
        </Card>
      </View>

      <View style={styles.padded}>
        <Card>
          <SectionTitle>Current Status</SectionTitle>
          <StatusRow icon="wifi-off" label="Connection" value={<Badge tone="warning">Offline</Badge>} color={colors.warning} />
          <StatusRow icon="map-pin" label="Last Known Location" value={<Badge tone="success">Saved</Badge>} color={colors.success} />
          <StatusRow icon="battery" label="Battery Level" value="78%" color={colors.success} />
          <StatusRow icon="circle" label="Movement" value="Moving" color={colors.accent} />
        </Card>

        {actions.map((action) => (
          <Pressable
            key={action.title}
            onPress={() => router.push(action.path)}
            style={({ pressed }) => [styles.wideAction, { backgroundColor: action.color }, pressed && styles.pressed]}
          >
            <Icon name={action.icon} color={colors.white} size={26} />
            <View style={styles.flex}>
              <Text style={styles.wideActionTitle}>{action.title}</Text>
              <Text style={styles.wideActionSub}>{action.description}</Text>
            </View>
          </Pressable>
        ))}

        <Card>
          <SectionTitle>Next Steps</SectionTitle>
          <MapPreview />
          <View style={styles.tipBox}>
            <Text style={text.body}>Recommended Action</Text>
            <Text style={text.muted}>Head northeast for 1.2 km to reach the main trailhead. The path is mostly downhill.</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

export function ARGuidanceScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false} style={styles.arScreen}>
      <Row style={styles.between}>
        <Row style={styles.gap}>
          <View style={styles.glassBadge}>
            <Text style={styles.glassText}>GPS 8m</Text>
          </View>
          <View style={styles.glassBadge}>
            <Text style={styles.glassText}>95%</Text>
          </View>
        </Row>
        <IconButton name="x" color={colors.white} onPress={() => router.push('/lost')} style={styles.glassButton} />
      </Row>

      <View style={styles.arCenter}>
        <View style={styles.compassCircle}>
          <Icon name="arrow-up" color={colors.white} size={82} />
        </View>
        <Text style={styles.arDistance}>1.4 km</Text>
        <View style={styles.glassPill}>
          <Icon name="map-pin" color={colors.primary} size={18} />
          <Text style={styles.glassTextLarge}>Main Trailhead</Text>
        </View>
        <View style={styles.successPill}>
          <Text style={styles.successPillText}>Likely trail ahead</Text>
        </View>
      </View>

      <View style={styles.arFooter}>
        <Row style={styles.between}>
          <Metric label="Heading" value="42°" />
          <Metric label="Direction" value="NE" />
          <IconButton name="map" color={colors.white} onPress={() => router.push('/map')} style={styles.glassButton} />
        </Row>
      </View>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function AIGuideScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const suggestions = ['Am I going the right way?', 'Guide me back to the trailhead', 'What should I do if I stay offline?', 'Remind me to conserve battery'];

  return (
    <Screen scroll={false} style={styles.noPadding}>
      <View style={styles.primaryHeader}>
        <IconButton name="arrow-left" color={colors.white} onPress={() => router.push('/home')} style={styles.headerBack} />
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

export function SOSScreen() {
  const router = useRouter();
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
        <IconButton name="arrow-left" color={colors.white} onPress={() => router.push('/lost')} style={styles.headerBack} />
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

export function NavigateScreen() {
  const router = useRouter();

  return (
    <Screen
      footer={
        <AppButton icon="camera" color={colors.accent} onPress={() => router.push('/ar')}>
          Switch to AR View
        </AppButton>
      }
    >
      <IconButton name="arrow-left" onPress={() => router.push('/lost')} />
      <Row style={[styles.between, styles.topGap]}>
        <Text style={text.h2}>Navigation</Text>
        <Badge tone="success">On Track</Badge>
      </Row>
      <Text style={text.muted}>Guiding you back to safety</Text>

      <Card>
        <Row style={styles.between}>
          <Text style={text.muted}>Progress to Trailhead</Text>
          <Text style={text.body}>29%</Text>
        </Row>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '29%' }]} />
        </View>
        <Row style={styles.between}>
          <Text style={text.small}>0.4 km traveled</Text>
          <Text style={text.small}>1.4 km total</Text>
        </Row>
      </Card>

      <MapPreview large />

      <View style={styles.nextStepCard}>
        <Row style={styles.gap}>
          <CircleIcon name="compass" backgroundColor="#ffffff22" color={colors.white} size={30} />
          <View style={styles.flex}>
            <Text style={styles.whiteMuted}>Next Step</Text>
            <Text style={[text.h2, styles.whiteText]}>Continue on the main trail</Text>
            <Row style={[styles.gapSmall, styles.topGapSmall]}>
              <View style={styles.headerPill}>
                <Text style={styles.headerPillText}>Northeast</Text>
              </View>
              <View style={styles.headerPill}>
                <Text style={styles.headerPillText}>120 m</Text>
              </View>
            </Row>
          </View>
        </Row>
        <Row style={[styles.between, styles.topBorder]}>
          <Metric label="Distance Left" value="1.0 km" />
          <Metric label="Est. Time" value="18 min" />
          <Metric label="Elevation" value="-45 m" />
        </Row>
      </View>

      <RouteStep active title="Continue on main trail" detail="120 m northeast" icon="navigation" />
      <RouteStep title="Turn right at fork" detail="340 m northeast" icon="arrow-right" />
      <RouteStep title="Arrive at trailhead" detail="1.0 km north" icon="map-pin" />
    </Screen>
  );
}

function RouteStep({ active = false, title, detail, icon }: { active?: boolean; title: string; detail: string; icon: FeatherName }) {
  return (
    <Card style={[styles.routeStep, !active && styles.inactive]}>
      <CircleIcon name={active ? 'check' : 'circle'} size={15} backgroundColor={active ? `${colors.success}18` : colors.muted} color={active ? colors.success : colors.mutedForeground} />
      <View style={styles.flex}>
        <Text style={text.body}>{title}</Text>
        <Text style={text.small}>{detail}</Text>
      </View>
      <Icon name={icon} color={colors.mutedForeground} />
    </Card>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 20,
    padding: spacing.screenX,
  },
  noPadding: {
    padding: 0,
  },
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  padded: {
    gap: 20,
    padding: spacing.screenX,
  },
  flex: {
    flex: 1,
  },
  withFooter: {
    paddingBottom: 120,
  },
  footer: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingHorizontal: spacing.screenX,
    paddingTop: 16,
  },
  footerNote: {
    marginBottom: 4,
  },
  heroIcon: {
    height: 64,
    width: 64,
  },
  mutedLead: {
    color: colors.mutedForeground,
    fontSize: 17,
    lineHeight: 25,
  },
  stack: {
    gap: 14,
    marginTop: 16,
  },
  stackLarge: {
    gap: 16,
    marginTop: 24,
  },
  cardRow: {
    alignItems: 'flex-start',
    gap: 14,
  },
  gap: {
    gap: 12,
  },
  gapSmall: {
    gap: 6,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  between: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: {
    textAlign: 'center',
  },
  topGap: {
    marginTop: 12,
  },
  topGapSmall: {
    marginTop: 6,
  },
  homeHero: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingBottom: 44,
  },
  whiteText: {
    color: colors.white,
  },
  whiteMuted: {
    color: '#ffffffb8',
    fontSize: 14,
  },
  raisedCard: {
    marginTop: -40,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  statusRow: {
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTile: {
    alignItems: 'center',
    borderRadius: 20,
    flexBasis: '47%',
    gap: 12,
    minHeight: 126,
    justifyContent: 'center',
    padding: 18,
  },
  actionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  mapPreview: {
    alignItems: 'center',
    backgroundColor: '#e6f0e2',
    borderRadius: 16,
    height: 190,
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapPreviewLarge: {
    height: 280,
  },
  mapRing: {
    alignItems: 'center',
    borderColor: '#2f7d4f55',
    borderRadius: 70,
    borderStyle: 'dashed',
    borderWidth: 4,
    height: 118,
    justifyContent: 'center',
    width: 118,
  },
  mapDot: {
    borderRadius: 999,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  routeLine: {
    backgroundColor: '#2f7d4f55',
    borderRadius: 999,
    height: 5,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
    width: '70%',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  listItem: {
    marginBottom: 12,
  },
  mapCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e7efe4',
    justifyContent: 'center',
    padding: 24,
  },
  mapControls: {
    gap: 16,
    paddingTop: 6,
  },
  mapSheet: {
    shadowColor: colors.black,
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
  },
  input: {
    color: colors.foreground,
    flex: 1,
    minHeight: 48,
  },
  chipButton: {
    borderColor: colors.border,
    borderWidth: 1,
    minHeight: 44,
  },
  darkButtonText: {
    color: colors.foreground,
    fontWeight: '700',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  featureRow: {
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  progressTrack: {
    backgroundColor: colors.muted,
    borderRadius: 999,
    height: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: '100%',
  },
  warningHero: {
    backgroundColor: '#fff7ed',
    gap: 18,
    padding: 24,
  },
  wideAction: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    padding: 20,
  },
  wideActionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  wideActionSub: {
    color: '#ffffffb8',
    fontSize: 12,
  },
  tipBox: {
    backgroundColor: `${colors.primary}0f`,
    borderColor: `${colors.primary}33`,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  arScreen: {
    backgroundColor: '#334155',
    flex: 1,
  },
  glassBadge: {
    backgroundColor: '#00000088',
    borderColor: '#ffffff33',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  glassButton: {
    backgroundColor: '#00000077',
    borderColor: '#ffffff33',
  },
  glassText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  glassTextLarge: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  glassPill: {
    alignItems: 'center',
    backgroundColor: '#00000099',
    borderColor: '#ffffff33',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  arCenter: {
    alignItems: 'center',
    flex: 1,
    gap: 18,
    justifyContent: 'center',
  },
  compassCircle: {
    alignItems: 'center',
    backgroundColor: '#2f7d4f44',
    borderColor: colors.primary,
    borderRadius: 80,
    borderWidth: 4,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  arDistance: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '800',
  },
  successPill: {
    backgroundColor: `${colors.success}dd`,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  successPillText: {
    color: colors.white,
    fontWeight: '700',
  },
  arFooter: {
    backgroundColor: '#00000099',
    borderColor: '#ffffff33',
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  metricLabel: {
    color: '#ffffffaa',
    fontSize: 12,
  },
  metricValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  primaryHeader: {
    backgroundColor: colors.primary,
    gap: 14,
    padding: 24,
  },
  dangerHeader: {
    backgroundColor: colors.destructive,
    gap: 14,
    padding: 24,
  },
  headerBack: {
    backgroundColor: '#ffffff22',
    borderColor: '#ffffff33',
  },
  headerPill: {
    alignItems: 'center',
    backgroundColor: '#ffffff22',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  headerPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  chatContent: {
    gap: 16,
    padding: 24,
  },
  chatInputBar: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  chatInput: {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.foreground,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  suggestion: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '47%',
    padding: 14,
  },
  chatRow: {
    alignItems: 'flex-start',
    gap: 10,
  },
  chatAvatar: {
    height: 34,
    width: 34,
  },
  chatBubble: {
    borderTopLeftRadius: 6,
  },
  micButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 70,
    height: 130,
    justifyContent: 'center',
    marginVertical: 18,
    width: 130,
  },
  contact: {
    backgroundColor: colors.muted,
    borderRadius: 16,
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  nextStepCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
  },
  topBorder: {
    borderColor: '#ffffff33',
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 18,
  },
  routeStep: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  inactive: {
    opacity: 0.55,
  },
});
