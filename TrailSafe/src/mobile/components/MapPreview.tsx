import { View } from 'react-native';
import { styles } from '../styles';
import { colors } from '../theme';
import { Icon } from '../ui';

export function MapPreview({ large = false }: { large?: boolean }) {
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
