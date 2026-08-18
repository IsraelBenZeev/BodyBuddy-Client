import { colors } from '@/colors';
import ValueStepper from '@/src/ui/ValueStepper';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  initialValue: number;
  isManual: boolean;
  onSave: (value: number) => void;
  onResetToAuto: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const MIN_CALORIES = 800;
const MAX_CALORIES = 6000;
const STEP = 50;

export default function ManualCaloriesModal({
  visible,
  initialValue,
  isManual,
  onSave,
  onResetToAuto,
  onCancel,
  isSaving = false,
}: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const handleChange = (v: number) => {
    setValue(Math.min(MAX_CALORIES, Math.max(MIN_CALORIES, v)));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="bg-background-800 rounded-3xl w-full border border-white/10 overflow-hidden">
          <View className="items-center pt-6 pb-2 px-6">
            <View className="bg-lime-500/15 rounded-full p-3 mb-3">
              <Ionicons name="create-outline" size={28} color={colors.lime[300]} />
            </View>
            <Text className="typo-h3 text-white text-center">יעד קלוריות ידני</Text>
            <Text className="typo-label text-background-400 text-center mt-2 leading-5">
              קביעת יעד קבוע תחליף את החישוב האוטומטי לפי BMR ופעילות, ולא תתעדכן אם המשקל או
              הפעילות שלך ישתנו
            </Text>
          </View>

          <View className="py-6 items-center">
            <ValueStepper
              value={value}
              onChange={handleChange}
              step={STEP}
              min={MIN_CALORIES}
              unit="קק״ל ליום"
            />
          </View>

          {isManual && (
            <Pressable
              onPress={onResetToAuto}
              disabled={isSaving}
              className="flex-row items-center justify-center gap-1.5 mx-6 mb-4 py-2"
              accessibilityRole="button"
              accessibilityLabel="חזרה לחישוב אוטומטי"
              accessibilityHint="מבטל את היעד הידני ומחשב את הקלוריות מחדש לפי הפרופיל"
            >
              <Ionicons name="refresh-outline" size={15} color={colors.background[400]} />
              <Text className="typo-label text-background-400">חזרה לחישוב אוטומטי</Text>
            </Pressable>
          )}

          <View className="flex-row border-t border-white/10">
            <Pressable
              onPress={onCancel}
              disabled={isSaving}
              className="flex-1 py-4 items-center border-l border-white/10"
              accessibilityRole="button"
              accessibilityLabel="ביטול"
            >
              <Text className="typo-btn-cta text-white">ביטול</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(value)}
              disabled={isSaving}
              className="flex-1 py-4 items-center bg-lime-500/10"
              accessibilityRole="button"
              accessibilityLabel="שמירת יעד קלוריות"
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
}
