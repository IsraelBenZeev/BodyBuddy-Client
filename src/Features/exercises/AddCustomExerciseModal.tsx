import { colors } from '@/colors';
import { useCreateCustomExercise } from '@/src/hooks/useEcercises';
import { useAuthStore } from '@/src/store/useAuthStore';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { CUSTOM_EQUIPMENT_OPTIONS } from '@/src/types/customExercise';
import ActionButton from '@/src/ui/ActionButton';
import ModalBottom from '@/src/ui/ModalButtom';
import AppButton from '@/src/ui/PressableOpacity';
import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

interface AddCustomExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  initialName?: string;
}

const BODY_PART_OPTIONS = Object.keys(partsBodyHebrew) as BodyPart[];

const AddCustomExerciseModal = ({ visible, onClose, initialName = '' }: AddCustomExerciseModalProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const user = useAuthStore((state) => state.user);
  const { mutate: createCustomExercise, isPending } = useCreateCustomExercise(user?.id);

  const [name, setName] = useState(initialName);
  const [bodyPart, setBodyPart] = useState<BodyPart | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [homeFriendly, setHomeFriendly] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setBodyPart(null);
      setEquipment(null);
      setHomeFriendly(false);
      setNotes('');
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible, initialName]);

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !bodyPart) return;
    createCustomExercise(
      {
        name: name.trim(),
        body_part: bodyPart,
        equipment,
        home_friendly: homeFriendly,
        notes: notes.trim() || null,
      },
      { onSuccess: onClose }
    );
  }, [name, bodyPart, equipment, homeFriendly, notes, createCustomExercise, onClose]);

  const canSubmit = name.trim().length > 0 && !!bodyPart;

  return (
    <ModalBottom
      ref={sheetRef}
      initialIndex={-1}
      enablePanDownToClose
      minHeight="75%"
      maxHeight="90%"
      title="הוספת תרגיל ידנית"
      onChange={(isOpen) => !isOpen && onClose()}
      onClosePress={() => sheetRef.current?.close()}
    >
      <View className="gap-6 pb-6">
        <View>
          <Text className="typo-label text-background-400 mb-2">שם התרגיל</Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="לדוגמה: לחיצת חזה בקייבל"
              placeholderTextColor="#525252"
              className="typo-input text-white text-right py-3"
              accessibilityLabel="שם התרגיל"
            />
          </View>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">חלק גוף</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {BODY_PART_OPTIONS.map((part) => (
              <AppButton
                key={part}
                animationType="opacity"
                haptic="light"
                onPress={() => setBodyPart(part)}
                className={`px-4 py-2 rounded-full border ${
                  bodyPart === part ? 'bg-lime-500 border-lime-500' : 'bg-transparent border-zinc-700'
                }`}
                accessibilityLabel={`בחר חלק גוף: ${partsBodyHebrew[part]}`}
                accessibilityRole="button"
                accessibilityState={{ selected: bodyPart === part }}
              >
                <Text className={bodyPart === part ? 'typo-btn-cta text-black' : 'typo-body text-white'}>
                  {partsBodyHebrew[part]}
                </Text>
              </AppButton>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            ציוד <Text className="text-background-600">(רשות)</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CUSTOM_EQUIPMENT_OPTIONS.map((option) => (
              <AppButton
                key={option.value}
                animationType="opacity"
                haptic="light"
                onPress={() => setEquipment(equipment === option.value ? null : option.value)}
                className={`px-4 py-2 rounded-full border ${
                  equipment === option.value
                    ? 'bg-lime-500/20 border-lime-500'
                    : 'bg-transparent border-zinc-700'
                }`}
                accessibilityLabel={`בחר ציוד: ${option.label_he}`}
                accessibilityRole="button"
                accessibilityState={{ selected: equipment === option.value }}
              >
                <Text
                  className={`typo-label ${equipment === option.value ? 'text-lime-400' : 'text-zinc-400'}`}
                >
                  {option.label_he}
                </Text>
              </AppButton>
            ))}
          </ScrollView>
        </View>

        <AppButton
          animationType="opacity"
          haptic="light"
          onPress={() => setHomeFriendly((prev) => !prev)}
          className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border ${
            homeFriendly ? 'bg-lime-500/15 border-lime-500/50' : 'bg-zinc-900 border-zinc-800'
          }`}
          accessibilityLabel="מתאים לאימון ביתי"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: homeFriendly }}
        >
          <Text className={`typo-body-primary ${homeFriendly ? 'text-lime-300' : 'text-white'}`}>
            מתאים לאימון ביתי
          </Text>
          <View
            className={`w-6 h-6 rounded-full border items-center justify-center ${
              homeFriendly ? 'bg-lime-500 border-lime-500' : 'border-zinc-600'
            }`}
          >
            {homeFriendly && <Text className="text-black text-xs">✓</Text>}
          </View>
        </AppButton>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            הערות <Text className="text-background-600">(רשות)</Text>
          </Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="הוראות ביצוע, טיפים..."
              placeholderTextColor="#525252"
              className="typo-input text-white text-right py-3"
              multiline
              numberOfLines={3}
              accessibilityLabel="הערות לתרגיל"
            />
          </View>
        </View>

        <ActionButton
          onPress={handleSubmit}
          label="שמור תרגיל"
          iconName="checkmark"
          variant="primary"
          size="md"
          fullWidth
          loading={isPending}
          disabled={!canSubmit}
          accessibilityLabel="שמור תרגיל חדש"
        />
      </View>
    </ModalBottom>
  );
};

export default AddCustomExerciseModal;
