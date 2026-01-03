import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons'; // ספרייה שמגיעה עם Expo
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Form from './form/Form';

const AddWorkoutPlan = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-1200">
      <View className="bg-background-1100 rounded-t-3xl border-b border-white/10">
        {/* 1. הידית (Handle) */}
        <View className="items-center pt-2 pb-1">
          <View className="w-10 h-1.5 bg-lime-500 rounded-full" />
        </View>
        {/* 2. שורת הכותרת והכפתור */}
        <View className="flex-row-reverse justify-between items-center px-5 pb-4">
          <Text className="text-lime-400 text-xl font-bold">תוכנית חדשה</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-white/10 p-2 rounded-full">
            <Ionicons name="close" size={20} color={colors.lime[400]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* תוכן הטופס */}
      <ScrollView className="p-4 space-y-6">
        <View>
          <Form />
        </View>

        {/* עוד שדות כאן... */}
      </ScrollView>
    </View>
  );
};
export default AddWorkoutPlan;
