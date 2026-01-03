import { colors } from '@/colors';
import { Exercise } from '@/src/types/exercise';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
interface HeaderProps {
  navigateToPicker: () => void;
  selectedExercisesData: Exercise[];
}

const HeaderForm = ({ navigateToPicker, selectedExercisesData }: HeaderProps) => {
  return (
    <View className="flex-row justify-between items-center " >
      <View>
        <Text className="text-white text-2xl font-bold tracking-tight">תרגילים באימון</Text>
        <Text className="text-zinc-500 text-sm">{selectedExercisesData.length} תרגילים נבחרו</Text>
      </View>

      {/* <TouchableOpacity
        activeOpacity={0.7}
        onPress={navigateToPicker}
        className="bg-lime-400 h-12 w-12 rounded-full items-center justify-center shadow-lg shadow-lime-400/20"
      >
        <MaterialCommunityIcons name="plus" size={28} color="black" />
      </TouchableOpacity> */}
    </View>
  );
};

export default HeaderForm;
