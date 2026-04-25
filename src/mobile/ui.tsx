import { Feather } from '@expo/vector-icons';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from './theme';

export type FeatherName = ComponentProps<typeof Feather>['name'];

type IconProps = {
  name: FeatherName;
  color?: string;
  size?: number;
};

export function Icon({ name, color = colors.foreground, size = 22 }: IconProps) {
  return <Feather name={name} color={color} size={size} />;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({
  children,
  tone = 'primary',
}: PropsWithChildren<{ tone?: 'primary' | 'success' | 'warning' | 'muted' }>) {
  const toneColor =
    tone === 'success'
      ? colors.success
      : tone === 'warning'
        ? colors.warning
        : tone === 'muted'
          ? colors.mutedForeground
          : colors.primary;

  return (
    <View style={[styles.badge, { backgroundColor: `${toneColor}18` }]}>
      <Text style={[styles.badgeText, { color: toneColor }]}>{children}</Text>
    </View>
  );
}

export function CircleIcon({
  name,
  backgroundColor = `${colors.primary}18`,
  color = colors.primary,
  size = 22,
  style,
}: IconProps & { backgroundColor?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.circleIcon, { backgroundColor }, style]}>
      <Icon name={name} color={color} size={size} />
    </View>
  );
}

export function AppButton({
  children,
  icon,
  onPress,
  color = colors.primary,
  disabled,
  style,
}: PropsWithChildren<{
  icon?: FeatherName;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: disabled ? colors.muted : color, opacity: pressed ? 0.86 : 1 },
        style,
      ]}
    >
      {icon ? <Icon name={icon} color={disabled ? colors.mutedForeground : colors.white} /> : null}
      <Text style={[styles.buttonText, disabled && { color: colors.mutedForeground }]}>{children}</Text>
    </Pressable>
  );
}

export function Row({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export const text = StyleSheet.create({
  h1: {
    color: colors.foreground,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    color: colors.foreground,
    fontSize: 24,
    fontWeight: '700',
  },
  h3: {
    color: colors.foreground,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    color: colors.foreground,
    fontSize: 15,
    lineHeight: 22,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    color: colors.mutedForeground,
    fontSize: 12,
    lineHeight: 16,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  circleIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});
