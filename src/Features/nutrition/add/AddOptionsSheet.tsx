import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectFromList: () => void;
  onAddNewFood: () => void;
  onAddMeal: () => void;
  onCameraAI: () => void;
}

interface SecondaryOption {
  key: 'list' | 'food' | 'meal';
  icon: 'search' | 'add-circle-outline' | 'restaurant-outline';
  label: string;
  description: string;
  color: string;
  iconBg: string;
}

const SECONDARY_OPTIONS: SecondaryOption[] = [
  { key: 'list', icon: 'search', label: 'הוסף מתוך הרשימה', description: 'בחר מהמאגר שלך', color: '#60a5fa', iconBg: 'bg-blue-500/15' },
  { key: 'food', icon: 'add-circle-outline', label: 'מאכל חדש', description: 'צור מאכל מותאם אישית', color: '#a78bfa', iconBg: 'bg-violet-500/15' },
  { key: 'meal', icon: 'restaurant-outline', label: 'ארוחה חדשה', description: 'בנה ממספר מרכיבים', color: '#fb923c', iconBg: 'bg-orange-500/15' },
];

const AddOptionsSheet = ({ visible, onClose, onSelectFromList, onAddNewFood, onAddMeal, onCameraAI }: Props) => {
  const handlers = useMemo<Record<SecondaryOption['key'] | 'camera', () => void>>(
    () => ({ list: onSelectFromList, food: onAddNewFood, meal: onAddMeal, camera: onCameraAI }),
    [onSelectFromList, onAddNewFood, onAddMeal, onCameraAI]
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-background-900 rounded-t-3xl px-5 pt-5 pb-10">

            {/* Handle */}
            <View className="items-center mb-5">
              <View className="w-12 h-1.5 bg-white/10 rounded-full" />
            </View>

            <Text className="typo-h3 text-white text-right mb-4">מה תרצה להוסיף?</Text>

            {/* ─── Hero Card: AI Camera ─── */}
            <Pressable
              onPress={handlers.camera}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel="צלם עם AI"
              className="rounded-3xl overflow-hidden mb-4 border border-lime-500/30 bg-lime-500/10"
            >
              <View className="p-5 flex-row items-center justify-between">
                {/* טקסט */}
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-lime-500 rounded-md px-2 py-0.5">
                      <Text className="typo-caption-bold text-black">AI</Text>
                    </View>
                    <Text className="typo-caption text-lime-400">✦ ✦</Text>
                  </View>
                  <Text className="typo-h2 text-lime-300 text-right">צלם עם AI</Text>
                  <Text className="typo-label text-lime-500/80 text-right mt-1">
                    צלם ארוחה ו-AI יזהה אוטומטית את המרכיבים והערכים התזונתיים
                  </Text>
                  <View className="flex-row items-center mt-3 gap-1">
                    <Text className="typo-caption-bold text-lime-400">התחל עכשיו</Text>
                    <Ionicons name="chevron-back" size={12} color="rgb(163,230,53)" />
                  </View>
                </View>
                {/* אייקון גדול */}
                <View className="bg-lime-500/20 w-20 h-20 rounded-2xl items-center justify-center border border-lime-500/30">
                  <Ionicons name="camera" size={48} color="rgb(163,230,53)" />
                </View>
              </View>
              {/* פס תחתון */}
              <View className="h-0.5 bg-lime-500/30" />
            </Pressable>

            {/* ─── כותרת מתחה ─── */}
            <Text className="typo-caption-bold text-background-400 text-right mb-3">
              אפשרויות נוספות
            </Text>

            {/* ─── 3 כרטיסים קומפקטיים ─── */}
            <View className="gap-2">
              {SECONDARY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={handlers[opt.key]}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  accessibilityRole="button"
                  accessibilityLabel={opt.label}
                  className="flex-row items-center p-4 rounded-2xl border border-white/5 bg-background-800"
                >
                  <View className={`w-10 h-10 rounded-xl items-center justify-center ml-3 ${opt.iconBg}`}>
                    <Ionicons name={opt.icon} size={20} color={opt.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="typo-body-primary text-white text-right">{opt.label}</Text>
                    <Text className="typo-caption text-gray-500 text-right mt-0.5">{opt.description}</Text>
                  </View>
                  <Ionicons name="chevron-back" size={14} color="#4b5563" />
                </Pressable>
              ))}
            </View>

            {/* ביטול */}
            <Pressable onPress={onClose} className="mt-4 h-12 items-center justify-center" accessibilityRole="button" accessibilityLabel="ביטול">
              <Text className="typo-body-primary text-gray-400">ביטול</Text>
            </Pressable>

          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddOptionsSheet;
