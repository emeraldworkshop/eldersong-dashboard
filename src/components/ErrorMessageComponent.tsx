// components/ErrorMessage.tsx
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Spacing } from '@/constants/Fontsize';

type Props = {
  message: string;
  color?: string;
  style?: object;
};

export default function ErrorMessageComponent({ message,color,style }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={[style,styles.text,color && { color: color }]}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  text: {
    textAlign: 'center',
    padding: Spacing.sm,
  },
});
