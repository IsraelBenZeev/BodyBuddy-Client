import { Exercise } from '@/src/types/exercise';
import { Text, View } from 'react-native';

interface HeaderProps {
  navigateToPicker: () => void;
  selectedIds: string[];
}

const HeaderForm = ({ navigateToPicker, selectedIds }: HeaderProps) => {
  return (
    <View className="flex-row items-center justify-between mb-4 mt-2">
      <View className='flex-1 items-end'>
        <Text className="text-background-50 text-3xl font-black tracking-tight">יצירת אימון</Text>
        <Text className="text-background-400 text-sm font-medium mt-1">
          {selectedIds.length > 0
            ? `${selectedIds.length} תרגילים נבחרו לאימון`
            : "התחל בבחירת תרגילים לאימון"}
        </Text>
      </View>
    </View>
  );
};

export default HeaderForm;
