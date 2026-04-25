import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { styles } from '../styles';
import { colors } from '../theme';
import { Icon, Row, text, type FeatherName } from '../ui';

export function StatusRow({
  icon,
  label,
  value,
  color = colors.primary,
}: {
  icon: FeatherName;
  label: string;
  value: ReactNode;
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
