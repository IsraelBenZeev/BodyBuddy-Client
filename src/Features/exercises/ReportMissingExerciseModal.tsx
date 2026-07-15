import { useReportMissingExercise } from '@/src/hooks/useReportMissingExercise';
import { useAuthStore } from '@/src/store/useAuthStore';
import ActionButton from '@/src/ui/ActionButton';
import ModalBottom from '@/src/ui/ModalButtom';
import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

interface ReportMissingExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  initialQuery: string;
}

const ReportMissingExerciseModal = ({ visible, onClose, initialQuery }: ReportMissingExerciseModalProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const user = useAuthStore((state) => state.user);
  const { mutate: reportMissingExercise, isPending } = useReportMissingExercise(user?.id);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [suggestedName, setSuggestedName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (visible) {
      setSearchQuery(initialQuery);
      setSuggestedName('');
      setNote('');
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible, initialQuery]);

  const handleSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    reportMissingExercise(
      {
        search_query: searchQuery.trim(),
        suggested_name: suggestedName.trim() || null,
        note: note.trim() || null,
      },
      { onSuccess: onClose }
    );
  }, [searchQuery, suggestedName, note, reportMissingExercise, onClose]);

  return (
    <ModalBottom
      ref={sheetRef}
      initialIndex={-1}
      enablePanDownToClose
      minHeight="55%"
      maxHeight="75%"
      title="דיווח על תרגיל חסר"
      onChange={(isOpen) => !isOpen && onClose()}
      onClosePress={() => sheetRef.current?.close()}
    >
      <View className="gap-6 pb-6">
        <View>
          <Text className="typo-label text-background-400 mb-2">מה חיפשת?</Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="שם התרגיל שחיפשת"
              placeholderTextColor="#525252"
              className="typo-input text-white text-right py-3"
              accessibilityLabel="שאילתת החיפוש שהובילה לדיווח"
            />
          </View>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            שם מוצע <Text className="text-background-600">(רשות)</Text>
          </Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
            <TextInput
              value={suggestedName}
              onChangeText={setSuggestedName}
              placeholder="איך היית קורא לתרגיל?"
              placeholderTextColor="#525252"
              className="typo-input text-white text-right py-3"
              accessibilityLabel="שם מוצע לתרגיל"
            />
          </View>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            הערה <Text className="text-background-600">(רשות)</Text>
          </Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="פרטים נוספים שיעזרו לנו למצוא את התרגיל"
              placeholderTextColor="#525252"
              className="typo-input text-white text-right py-3"
              multiline
              numberOfLines={3}
              accessibilityLabel="הערה נוספת לדיווח"
            />
          </View>
        </View>

        <ActionButton
          onPress={handleSubmit}
          label="שלח דיווח"
          iconName="flag-outline"
          variant="secondary"
          size="md"
          fullWidth
          loading={isPending}
          disabled={!searchQuery.trim()}
          accessibilityLabel="שלח דיווח על תרגיל חסר"
        />
      </View>
    </ModalBottom>
  );
};

export default ReportMissingExerciseModal;
