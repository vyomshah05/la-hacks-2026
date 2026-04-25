import { useRouter } from 'expo-router';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import type { RoutePath } from '../routes';
import { styles } from '../styles';
import { colors } from '../theme';
import { Icon, type FeatherName } from '../ui';

export function IconButton({
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

export function BackButton({
  fallback = '/home',
  name = 'arrow-left',
  style,
  color,
}: {
  fallback?: RoutePath;
  name?: FeatherName;
  style?: StyleProp<ViewStyle>;
  color?: string;
}) {
  const router = useRouter();

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(fallback);
  };

  return <IconButton name={name} onPress={handlePress} style={style} color={color} />;
}

export function HomeButton({
  name = 'arrow-left',
  style,
  color,
}: {
  name?: FeatherName;
  style?: StyleProp<ViewStyle>;
  color?: string;
}) {
  const router = useRouter();

  return <IconButton name={name} onPress={() => router.dismissTo('/home')} style={style} color={color} />;
}
