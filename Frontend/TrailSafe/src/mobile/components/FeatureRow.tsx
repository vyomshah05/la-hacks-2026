import { Text, View } from 'react-native';
import { styles } from '../styles';
import { CircleIcon, Row, text, type FeatherName } from '../ui';

export function FeatureRow({ icon, title, description }: { icon: FeatherName; title: string; description: string }) {
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
