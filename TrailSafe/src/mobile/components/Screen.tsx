import type { ReactElement, ReactNode } from 'react';
import { ScrollView, View, type RefreshControlProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { styles } from '../styles';

export function Screen({
  children,
  edges = ['top', 'left', 'right'],
  footer,
  refreshControl,
  safeAreaStyle,
  scroll = true,
  scrollStyle,
  style,
}: {
  children: ReactNode;
  edges?: Edge[];
  footer?: ReactNode;
  refreshControl?: ReactElement<RefreshControlProps>;
  safeAreaStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  scrollStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  const contentStyle = [styles.content, style];

  return (
    <SafeAreaView style={[styles.safeArea, safeAreaStyle]} edges={edges}>
      {scroll ? (
        <ScrollView
          refreshControl={refreshControl}
          style={scrollStyle}
          contentContainerStyle={[contentStyle, footer ? styles.withFooter : null]}
        >
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
