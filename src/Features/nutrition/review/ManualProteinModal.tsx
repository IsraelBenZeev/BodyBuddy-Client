import { colors } from '@/colors';
import ValueStepper from '@/src/ui/ValueStepper';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  initialValue: number;
  onSave: (value: number) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const MIN_PROTEIN_PER_KG = 0.8;
const MAX_PROTEIN_PER_KG = 3;
const STEP = 0.1;

const ManualProteinModal = ({
  visible,
  initialValue,
  onSave,
  onCancel,
  isSaving = false,
}: Props) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const handleChange = (nextValue: number) => {
    setValue(
      Math.min(MAX_PROTEIN_PER_KG, Math.max(MIN_PROTEIN_PER_KG, Number(nextValue.toFixed(1))))
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="bg-background-800 rounded-3xl w-full border border-white/10 overflow-hidden">
          <View className="items-center pt-6 pb-2 px-6">
            <View className="bg-lime-500/15 rounded-full p-3 mb-3">
              <Ionicons name="create-outline" size={28} color={colors.lime[300]} />
            </View>
            <Text className="typo-h3 text-white text-center">יעד חלבון יומי</Text>
            <Text className="typo-label text-background-400 text-center mt-2 leading-5">
              קביעת כמות החלבון לכל ק״ג משקל לחישוב היעד היומי
            </Text>
          </View>

          <View className="py-6 items-center">
            <ValueStepper
              value={value}
              onChange={handleChange}
              step={STEP}
              min={MIN_PROTEIN_PER_KG}
              unit="גרם/ק״ג"
            />
          </View>

          <View className="flex-row border-t border-white/10">
            <Pressable
              onPress={onCancel}
              disabled={isSaving}
              className="flex-1 py-4 items-center border-l border-white/10"
              accessibilityRole="button"
              accessibilityLabel="ביטול"
              accessibilityState={{ disabled: isSaving }}
            >
              <Text className="typo-btn-cta text-white">ביטול</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(value)}
              disabled={isSaving}
              className="flex-1 py-4 items-center bg-lime-500/10"
              accessibilityRole="button"
              accessibilityLabel="שמירת יעד חלבון"
              accessibilityState={{ disabled: isSaving, busy: isSaving }}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.lime[300]} />
              ) : (
                <Text className="typo-btn-cta text-lime-300">שמירה</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ManualProteinModal;
