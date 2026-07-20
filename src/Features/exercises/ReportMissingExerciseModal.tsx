import { colors } from '@/colors';
import { useReportMissingExercise } from '@/src/hooks/useReportMissingExercise';
import { useAuthStore } from '@/src/store/useAuthStore';
import ActionButton from '@/src/ui/ActionButton';
import ModalBottom from '@/src/ui/ModalButtom';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const isValidUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

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
  const [exampleUrl, setExampleUrl] = useState('');

  useEffect(() => {
    if (visible) {
      setSearchQuery(initialQuery);
      setSuggestedName('');
      setNote('');
      setExampleUrl('');
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible, initialQuery]);

  const trimmedUrl = exampleUrl.trim();
  const urlError = useMemo(
    () => (trimmedUrl.length > 0 && !isValidUrl(trimmedUrl) ? 'הקישור לא תקין' : null),
    [trimmedUrl]
  );

  const handleSubmit = useCallback(() => {
    if (!searchQuery.trim() || urlError) return;
    reportMissingExercise(
      {
        search_query: searchQuery.trim(),
        suggested_name: suggestedName.trim() || null,
        note: note.trim() || null,
        example_url: trimmedUrl || null,
      },
      { onSuccess: onClose }
    );
  }, [searchQuery, suggestedName, note, trimmedUrl, urlError, reportMissingExercise, onClose]);

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

        <View>
          <Text className="typo-label text-background-400 mb-2">
            קישור לדוגמה <Text className="text-background-600">(רשות)</Text>
          </Text>
          <View
            className="flex-row items-center bg-zinc-900 border rounded-2xl px-4"
            style={{ borderColor: urlError ? colors.red[400] : '#27272a' }}
          >
            <Ionicons
              name="link-outline"
              size={18}
              color={colors.background[400]}
              importantForAccessibility="no"
            />
            <TextInput
              value={exampleUrl}
              onChangeText={setExampleUrl}
              placeholder="קישור לסרטון או תמונה שממחישים את התרגיל"
              placeholderTextColor="#525252"
              className="flex-1 typo-input text-white text-right py-3 px-2"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="קישור לדוגמה איך התרגיל נראה"
            />
          </View>
          {urlError && <Text className="typo-caption text-red-400 mt-1 text-right">{urlError}</Text>}
        </View>

        <ActionButton
          onPress={handleSubmit}
          label="שלח דיווח"
          iconName="flag-outline"
          variant="secondary"
          size="md"
          fullWidth
          loading={isPending}
          disabled={!searchQuery.trim() || !!urlError}
          accessibilityLabel="שלח דיווח על תרגיל חסר"
        />
      </View>
    </ModalBottom>
  );
};

export default ReportMissingExerciseModal;
