import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import Slider from '@react-native-community/slider';
import FormInput from '@/src/ui/FormInput';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import { colors } from '@/colors';
import type { SliderEntryFormData } from '@/src/types/nutrition';

interface Props {
  onSubmit: (data: SliderEntryFormData) => void;
  isPending: boolean;
  onBack: () => void;
}

const ManualEntryWithSliders = ({ onSubmit, isPending, onBack }: Props) => {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  const { control, handleSubmit, watch } = useForm<{ food_name: string; portion_size: number }>({
    defaultValues: {
      food_name: '',
      portion_size: 100,
    },
  });

  const portionSize = watch('portion_size');

  const calculatedCalories = useMemo(() => {
    return Math.round((protein * 4 + carbs * 4 + fat * 9) * 10) / 10;
  }, [protein, carbs, fat]);

  const portionCalories = useMemo(() => {
    const ratio = (portionSize || 0) / 100;
    return Math.round(calculatedCalories * ratio * 10) / 10;
  }, [calculatedCalories, portionSize]);

  const handleFormSubmit = (formData: { food_name: string; portion_size: number }) => {
    onSubmit({
      food_name: formData.food_name,
      protein_per_100: protein,
      carbs_per_100: carbs,
      fat_per_100: fat,
      portion_size: formData.portion_size,
      portion_unit: 'g',
    });
  };

  return (
    <View className="flex-1">
    <ScrollView className="flex-1 px-5 py-4">
      <Text className="text-lime-400 text-2xl font-black mb-2 text-right">
        הוספת מזון חדש
      </Text>
      <Text className="text-background-400 text-sm mb-6 text-right">
        המזון יישמר לשימוש חוזר
      </Text>

      <FormInput
        control={control}
        name="food_name"
        label="שם המזון"
        placeholder="לדוגמה: חזה עוף, אורז, ביצה..."
        rules={{ required: 'יש להזין שם מזון' }}
        containerStyle={{ marginBottom: 24 }}
        inputStyle={{
          backgroundColor: colors.background[800],
          borderWidth: 1,
          borderColor: colors.background[600],
          borderRadius: 12,
          padding: 12,
          color: colors.white,
          textAlign: 'right',
        }}
        labelStyle={{
          color: colors.background[400],
          fontSize: 14,
          marginBottom: 8,
          textAlign: 'right',
        }}
        isPendingCreate={isPending}
      />

      <Text className="text-white text-lg font-bold mb-4 text-right">
        ערכים תזונתיים (ל-100g)
      </Text>

      <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-lime-500/30">
        <View className="flex-row-reverse items-center justify-between mb-2">
          <Text className="text-lime-500 text-sm font-bold">חלבון</Text>
          <Text className="text-lime-500 text-lg font-black">{protein}g</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={protein}
          onValueChange={setProtein}
          minimumTrackTintColor={colors.lime[500]}
          maximumTrackTintColor={colors.background[600]}
          thumbTintColor={colors.lime[500]}
        />
      </View>

      <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-orange-500/30">
        <View className="flex-row-reverse items-center justify-between mb-2">
          <Text className="text-orange-500 text-sm font-bold">פחמימות</Text>
          <Text className="text-orange-500 text-lg font-black">{carbs}g</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={carbs}
          onValueChange={setCarbs}
          minimumTrackTintColor={colors.orange[500]}
          maximumTrackTintColor={colors.background[600]}
          thumbTintColor={colors.orange[500]}
        />
      </View>

      <View className="bg-background-800 rounded-2xl p-4 mb-3 border border-red-500/30">
        <View className="flex-row-reverse items-center justify-between mb-2">
          <Text className="text-red-500 text-sm font-bold">שומן</Text>
          <Text className="text-red-500 text-lg font-black">{fat}g</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={fat}
          onValueChange={setFat}
          minimumTrackTintColor={colors.red[500]}
          maximumTrackTintColor={colors.background[600]}
          thumbTintColor={colors.red[500]}
        />
      </View>

      <View className="bg-background-700 rounded-2xl p-4 mb-6 border border-background-600">
        <View className="flex-row-reverse items-center justify-between">
          <Text className="text-background-400 text-sm">קלוריות (חישוב אוטומטי)</Text>
          <Text className="text-white text-xl font-black">{calculatedCalories}</Text>
        </View>
      </View>

      <FormInput
        control={control}
        name="portion_size"
        label="כמה אכלת? (גרם)"
        placeholder="100"
        keyboardType="numeric"
        rules={{
          required: 'יש להזין כמות',
          min: { value: 1, message: 'כמות מינימלית: 1' },
        }}
        containerStyle={{ marginBottom: 16 }}
        inputStyle={{
          backgroundColor: colors.background[800],
          borderWidth: 1,
          borderColor: colors.background[600],
          borderRadius: 12,
          padding: 12,
          color: colors.white,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
        }}
        labelStyle={{
          color: colors.background[400],
          fontSize: 14,
          marginBottom: 8,
          textAlign: 'right',
        }}
        isPendingCreate={isPending}
      />

      <View className="bg-lime-500/10 border border-lime-500/30 rounded-2xl p-4 mb-6">
        <Text className="text-lime-400 text-center font-bold">
          תוסיף ליומן: {portionCalories} קק״ל
        </Text>
      </View>

      <View className="h-24" />
    </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 pb-32 pt-4 bg-background-900/95 border-t border-background-700">
        <View className="flex-1">
          <ButtonPrimary
            title="חזור"
            onPress={onBack}
            classNameButton="bg-background-700 border border-background-600"
            classNameText="text-background-400"
          />
        </View>
        <View className="flex-1">
          <ButtonPrimary
            title={isPending ? 'שומר...' : 'שמור והוסף'}
            onPress={handleSubmit(handleFormSubmit)}
            classNameButton={isPending ? 'opacity-50' : ''}
          />
        </View>
      </View>
    </View>
  );
};

export default ManualEntryWithSliders;
