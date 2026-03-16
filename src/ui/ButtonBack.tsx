import { colors } from '@/colors';
import { useRouter } from 'expo-router';
import { CircleX } from 'lucide-react-native';
import { Pressable } from 'react-native';

const ButtonBack = () => {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-background-800 py-2.5 px-5 rounded-lg self-start m-2.5"
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="חזור"
    >
      <CircleX size={36} strokeWidth={1.25} color={colors.lime[500]} />
    </Pressable>
  );
};

export default ButtonBack;
