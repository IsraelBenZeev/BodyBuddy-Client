import { colors } from '@/colors';
import { useRouter } from 'expo-router';
import { CircleX } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
const ButtonBack = () => {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={() => {
        router.back();
      }}
    >
      {/* <Text style={styles.text}>Back</Text> */}
      <CircleX size={36} strokeWidth={1.25} color={colors.lime[500]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // צבע כחול סטנדרטי
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start', // כדי שהכפתור לא יתפוס את כל הרוחב
    margin: 10,
    elevation: 2, // צל באנדרואיד
    shadowColor: '#000', // צל ב-iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pressed: {
    opacity: 0.7, // אפקט לחיצה
  },
  text: {
    color: 'white', // צבע טקסט לבן
    fontWeight: 'bold', // טקסט מודגש
  },
});

export default ButtonBack;
