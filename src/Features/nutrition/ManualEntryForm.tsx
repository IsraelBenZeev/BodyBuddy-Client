import { useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import FormInput from '@/src/ui/FormInput';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import { colors } from '@/colors';
import type { ManualEntryFormData } from '@/src/types/nutrition';

interface Props {
  onSubmit: (data: ManualEntryFormData) => void;
  isPending: boolean;
}

const ManualEntryForm = ({ onSubmit, isPending }: Props) => {
  const { control, handleSubmit, reset } = useForm<ManualEntryFormData>({
    defaultValues: {
      food_name: '',
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      portion_size: 100,
      portion_unit: 'g',
    },
  });

  const handleFormSubmit = useCallback(
    (data: ManualEntryFormData) => {
      onSubmit(data);
      reset();
    },
    [onSubmit, reset],
  );

  return (
    <ScrollView className="flex-1 px-5 py-4">
      <Text className="text-lime-400 text-2xl font-black mb-6 text-right">
        הוספת מזון ידנית
      </Text>

      <FormInput
        control={control}
        name="food_name"
        label="שם המזון"
        placeholder="לדוגמה: חזה עוף, אורז, ביצה..."
        rules={{ required: 'יש להזין שם מזון' }}
        containerStyle={{ marginBottom: 16 }}
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

      <View className="flex-row gap-3 mb-4">
        <FormInput
          control={control}
          name="portion_size"
          label="כמות"
          placeholder="100"
          keyboardType="numeric"
          rules={{
            required: 'יש להזין כמות',
            min: { value: 1, message: 'כמות מינימלית: 1' },
          }}
          containerStyle={{ flex: 1 }}
          inputStyle={{
            backgroundColor: colors.background[800],
            borderWidth: 1,
            borderColor: colors.background[600],
            borderRadius: 12,
            padding: 12,
            color: colors.white,
            textAlign: 'center',
          }}
          labelStyle={{
            color: colors.background[400],
            fontSize: 14,
            marginBottom: 8,
            textAlign: 'right',
          }}
          isPendingCreate={isPending}
        />

        <View className="flex-1">
          <Text className="text-background-400 text-sm mb-2 text-right">יחידה</Text>
          <View className="bg-background-800 border border-background-600 rounded-xl p-3">
            <Text className="text-white text-center">g</Text>
          </View>
        </View>
      </View>

      <Text className="text-white text-lg font-bold mb-3 text-right">
        ערכים תזונתיים (ל-100g)
      </Text>

      <View className="flex-row gap-3 mb-4">
        <FormInput
          control={control}
          name="protein"
          label="חלבון (g)"
          placeholder="0"
          keyboardType="numeric"
          rules={{ required: 'חובה', min: { value: 0, message: 'ערך מינימלי: 0' } }}
          containerStyle={{ flex: 1 }}
          inputStyle={{
            backgroundColor: colors.background[800],
            borderWidth: 1,
            borderColor: colors.lime[500] + '40',
            borderRadius: 12,
            padding: 12,
            color: colors.lime[500],
            textAlign: 'center',
            fontWeight: 'bold',
          }}
          labelStyle={{
            color: colors.lime[500],
            fontSize: 12,
            marginBottom: 8,
            textAlign: 'center',
          }}
          isPendingCreate={isPending}
        />

        <FormInput
          control={control}
          name="carbs"
          label="פחמימות (g)"
          placeholder="0"
          keyboardType="numeric"
          rules={{ required: 'חובה', min: { value: 0, message: 'ערך מינימלי: 0' } }}
          containerStyle={{ flex: 1 }}
          inputStyle={{
            backgroundColor: colors.background[800],
            borderWidth: 1,
            borderColor: colors.orange[500] + '40',
            borderRadius: 12,
            padding: 12,
            color: colors.orange[500],
            textAlign: 'center',
            fontWeight: 'bold',
          }}
          labelStyle={{
            color: colors.orange[500],
            fontSize: 12,
            marginBottom: 8,
            textAlign: 'center',
          }}
          isPendingCreate={isPending}
        />
      </View>

      <View className="flex-row gap-3 mb-6 bd">
        <FormInput
          control={control}
          name="fat"
          label="שומן (g)"
          placeholder="0"
          keyboardType="numeric"
          rules={{ required: 'חובה', min: { value: 0, message: 'ערך מינימלי: 0' } }}
          containerStyle={{ flex: 1 }}
          inputStyle={{
            backgroundColor: colors.background[800],
            borderWidth: 1,
            borderColor: colors.red[500] + '40',
            borderRadius: 12,
            padding: 12,
            color: colors.red[500],
            textAlign: 'center',
            fontWeight: 'bold',
          }}
          labelStyle={{
            color: colors.red[500],
            fontSize: 12,
            marginBottom: 8,
            textAlign: 'center',
          }}
          isPendingCreate={isPending}
        />

        <FormInput
          control={control}
          name="calories"
          label="קלוריות"
          placeholder="0"
          keyboardType="numeric"
          rules={{ required: 'חובה', min: { value: 0, message: 'ערך מינימלי: 0' } }}
          containerStyle={{ flex: 1 }}
          inputStyle={{
            backgroundColor: colors.background[800],
            borderWidth: 1,
            borderColor: colors.background[600],
            borderRadius: 12,
            padding: 12,
            color: colors.white,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
          labelStyle={{
            color: colors.background[400],
            fontSize: 12,
            marginBottom: 8,
            textAlign: 'center',
          }}
          isPendingCreate={isPending}
        />
      </View>

      <ButtonPrimary
        title={isPending ? 'מוסיף...' : 'הוסף מזון'}
        onPress={handleSubmit(handleFormSubmit)}
        classNameButton={isPending ? 'opacity-50' : ''}
      />
    </ScrollView>
  );
};

export default ManualEntryForm;
