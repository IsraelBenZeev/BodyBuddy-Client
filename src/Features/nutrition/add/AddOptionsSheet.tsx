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

const OPTIONS = [
  {
    key: 'list',
    icon: 'search' as const,
    label: 'הוסף מתוך הרשימה',
    description: 'בחר מאכל מהמאגר שלך',
    color: '#60a5fa',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'food',
    icon: 'add-circle-outline' as const,
    label: 'מאכל חדש',
    description: 'צור מאכל מותאם אישית',
    color: '#a78bfa',
    bg: 'bg-violet-500/10',
  },
  {
    key: 'meal',
    icon: 'restaurant-outline' as const,
    label: 'ארוחה חדשה',
    description: 'בנה ארוחה ממספר מרכיבים',
    color: '#fb923c',
    bg: 'bg-orange-500/10',
  },
  {
    key: 'camera',
    icon: 'camera-outline' as const,
    label: 'צלם עם AI',
    description: 'זיהוי אוטומטי מתמונה',
    color: '#84cc16',
    bg: 'bg-lime-500/10',
    highlight: true,
  },
] as const;

const AddOptionsSheet = ({
  visible,
  onClose,
  onSelectFromList,
  onAddNewFood,
  onAddMeal,
  onCameraAI,
}: Props) => {
  const handlers = useMemo<Record<string, () => void>>(() => ({
    list: onSelectFromList,
    food: onAddNewFood,
    meal: onAddMeal,
    camera: onCameraAI,
  }), [onSelectFromList, onAddNewFood, onAddMeal, onCameraAI]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-background-900 rounded-t-3xl px-5 pt-5 pb-10">
            {/* Handle */}
            <View className="items-center mb-5">
              <View className="w-12 h-1.5 bg-white/10 rounded-full" />
            </View>

            <Text className="text-white text-xl font-black text-right mb-5">
              מה תרצה להוסיף?
            </Text>

            <View className="gap-3">
              {OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={handlers[opt.key]}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  accessibilityRole="button"
                  accessibilityLabel={opt.label}
                  className={`flex-row-reverse items-center p-4 rounded-2xl border ${
                    opt.highlight
                      ? 'border-lime-500/30 bg-lime-500/10'
                      : 'border-white/5 bg-background-800'
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center ml-4 ${opt.bg}`}
                  >
                    <Ionicons name={opt.icon} size={24} color={opt.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-black text-base text-right">{opt.label}</Text>
                    <Text className="text-gray-400 text-xs text-right mt-0.5">{opt.description}</Text>
                  </View>
                  <Ionicons name="chevron-back" size={16} color="#6b7280" />
                </Pressable>
              ))}
            </View>

            <Pressable onPress={onClose} className="mt-4 h-12 items-center justify-center" accessibilityRole="button" accessibilityLabel="ביטול">
              <Text className="text-gray-400 font-bold">ביטול</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddOptionsSheet;
