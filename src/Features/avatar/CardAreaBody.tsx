import { colors } from '@/colors';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { modeListExercises } from '@/src/types/mode';
import AppButton from '@/src/ui/PressableOpacity';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
interface CardAreaBodyProps {
  selectedPart: BodyPart[];
  isLoading?: boolean;
}

const CardAreaBody = ({ selectedPart }: CardAreaBodyProps) => {
  const router = useRouter();

  return (
    <View className="">
      <View className="flex-row-reverse items-center justify-between mb-8 ">
        <View className="flex-row-reverse items-center gap-4 ">
          <View style={styles.iconCircleMain}>
            <Ionicons name="body" size={24} color="black" />
          </View>
          <View className="w-full flex-1">
            {/* <Text className="text-zinc-500 text-xs font-bold text-right uppercase tracking-tighter">
              האזור הנבחר
            </Text> */}
            <Text className="text-white text-2xl font-black text-right">
              {selectedPart.map((part, index) => (
                <Text key={part}>
                  {partsBodyHebrew[part]}
                  {index < selectedPart.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </Text>
          </View>
        </View>
      </View>
      {/* 3. כפתור הנעה לפעולה (CTA) */}
      <AppButton
        className="bg-lime-500 flex-row items-center justify-center py-[18px] rounded-[20px] gap-[12px] shadow-lime-500 shadow-offset-[0/8] shadow-opacity-30 shadow-radius-[15px] elevation-5"
        haptic="medium"
        animationType="opacity"
        onPress={() => {
          if (selectedPart.length > 0) {
            router.push({
              pathname: '/exercises/[parts]',
              params: {
                parts: JSON.stringify(selectedPart),
                mode: 'view' as modeListExercises,
              },
            });
          }
        }}
      >
        <AntDesign name="arrow-left" size={20} color="black" />
        <Text style={styles.buttonText}>למעבר לתרגילים</Text>
      </AppButton>
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircleMain: {
    backgroundColor: colors.lime[500],
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
 
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default CardAreaBody;
