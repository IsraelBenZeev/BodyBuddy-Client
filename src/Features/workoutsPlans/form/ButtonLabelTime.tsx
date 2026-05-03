import { colors } from '@/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';
interface ButtonLabelTimeProps {
  totalMinutes: number;
  setVisible: (visible: boolean) => void;
  isPendingCreate: boolean;
}
const ButtonLabelTime = ({ totalMinutes, setVisible, isPendingCreate }: ButtonLabelTimeProps) => {
  return (
    <View className="mb-6">
      <Text className="typo-label text-gray-400 mb-2 mr-1">משך התרגיל</Text>
      <Pressable
        onPress={() => {
          if (isPendingCreate) {
            return;
          }
          setVisible(true);
        }}
        className="flex-row items-center justify-between p-4 bg-background-800 border border-background-700 rounded-2xl active:opacity-70"
        style={{ height: 56 }}
        accessibilityRole="button"
        accessibilityLabel="בחר משך אימון"
      >
        <Text className="typo-h4 text-white">
          {totalMinutes > 0 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : '00:00'}
        </Text>
        <View className="opacity-50">
          <MaterialCommunityIcons name="clock-outline" size={20} color={colors.lime[500]} />
        </View>
      </Pressable>
    </View>
  );
};
export default ButtonLabelTime;
