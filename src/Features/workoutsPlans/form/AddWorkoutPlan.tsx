import { colors } from '@/colors';
import { modeAddWorkoutPlan } from '@/src/types/mode';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Form from './Form';
import AppButton from '@/src/ui/PressableOpacity';
interface AddWorkoutPlanProps {
  mode: modeAddWorkoutPlan;
  workout_plan_id?: string;
}
const AddWorkoutPlan = ({ mode, workout_plan_id }: AddWorkoutPlanProps) => {
  const router = useRouter();
  const handleBack = useCallback(() => router.back(), [router]);
  return (
    <View className="flex-1 bg-background-1200/90">
      <View className="bg-background-1100 rounded-t-3xl border-b border-white/10">
        <View className="items-center pt-2 pb-1">
          <View className="w-10 h-1.5 bg-lime-500 rounded-full" />
        </View>
        <View className="flex-row justify-between items-center px-5 pb-4">
          <Text className="typo-h3 text-lime-400">{mode === "edit" ? "עריכה" : "תוכנית חדשה"}</Text>
          <AppButton
            animationType='opacity'
            haptic='medium'
            onPress={handleBack}
            className="bg-white/10 p-3 rounded-full"
            accessibilityLabel="סגור">
            <Ionicons name="close" size={20} color={colors.lime[400]} />
          </AppButton>
        </View>
      </View>

      {/* <View className='flex-1'> */}
      <Form mode={mode} workout_plan_id={workout_plan_id} />
      {/* </View> */}
    </View>
  );
};
export default AddWorkoutPlan;
