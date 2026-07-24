import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FanArcCarousel, { FanArcItem } from '@/src/ui/FanArcCarousel';

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
  arcLabel: string;
  description: string;
  colors: {
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    labelColor: string;
  };
}

const SECONDARY_OPTIONS: SecondaryOption[] = [
  {
    key: 'list',
    icon: 'search',
    label: 'הוסף מתוך הרשימה',
    arcLabel: 'רשימה',
    description: 'בחר מהמאגר שלך',
    colors: {
      iconBg: 'rgba(96,165,250,0.28)',
      iconBorder: 'rgba(147,197,253,0.5)',
      iconColor: '#bfdbfe',
      labelColor: '#dbeafe',
    },
  },
  {
    key: 'food',
    icon: 'add-circle-outline',
    label: 'מאכל חדש',
    arcLabel: 'מאכל',
    description: 'צור מאכל מותאם אישית',
    colors: {
      iconBg: 'rgba(167,139,250,0.28)',
      iconBorder: 'rgba(196,181,253,0.5)',
      iconColor: '#ede9fe',
      labelColor: '#ede9fe',
    },
  },
  {
    key: 'meal',
    icon: 'restaurant-outline',
    label: 'ארוחה חדשה',
    arcLabel: 'ארוחה',
    description: 'בנה ממספר מרכיבים',
    colors: {
      iconBg: 'rgba(251,146,60,0.28)',
      iconBorder: 'rgba(253,186,116,0.5)',
      iconColor: '#fed7aa',
      labelColor: '#ffedd5',
    },
  },
];

const AddOptionsSheet = ({ visible, onClose, onSelectFromList, onAddNewFood, onAddMeal, onCameraAI }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const handlers = useMemo<Record<SecondaryOption['key'] | 'camera', () => void>>(
    () => ({ list: onSelectFromList, food: onAddNewFood, meal: onAddMeal, camera: onCameraAI }),
    [onSelectFromList, onAddNewFood, onAddMeal, onCameraAI]
  );
  const fanItems = useMemo<FanArcItem[]>(
    () =>
      SECONDARY_OPTIONS.map((opt) => ({
        key: opt.key,
        icon: opt.icon,
        label: opt.label,
        arcLabel: opt.arcLabel,
        onPress: handlers[opt.key],
        accessibilityLabel: opt.label,
        accessibilityHint: opt.description,
        colors: {
          iconBg: opt.colors.iconBg,
          iconBorder: opt.colors.iconBorder,
          iconColor: opt.colors.iconColor,
          labelColor: opt.colors.labelColor,
        },
      })),
    [handlers]
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-background-900 rounded-t-3xl px-5 pt-5   flex flex-col" style={{ paddingBottom: bottom}}>

            {/* Handle */}
            <View className="items-center mb-6">
              <View className="w-10 h-1 bg-white/10 rounded-full" />
            </View>

            <Text className="typo-h3 text-white mb-5 text-left">מה תרצה להוסיף?</Text>

            {/* ─── Hero: AI Camera ─── */}
            <Pressable
              onPress={handlers.camera}
              style={({ pressed }) => [{
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
                backgroundColor: 'rgba(132,204,22,0.15)',
                borderColor: 'rgba(132,204,22,0.5)',
                borderWidth: 1,
              }]}
              accessibilityRole="button"
              accessibilityLabel="צלם ארוחה עם AI"
              className="rounded-3xl mb-5"
            >
              <View className="flex-row items-center gap-4 p-5 border border-slate-700 rounded-3xl">
                {/* Icon */}
                <View
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                    backgroundColor: 'rgba(132,204,22,0.25)',
                    borderWidth: 1,
                    borderColor: 'rgba(132,204,22,0.55)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="camera" size={30} color="#a3e635" />
                </View>

                {/* Text */}
                <View className="flex-1 items-start gap-1 ">
                  <View
                    style={{
                      backgroundColor: 'rgba(132,204,22,0.18)',
                      borderWidth: 1,
                      borderColor: 'rgba(132,204,22,0.4)',
                      borderRadius: 99,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      marginBottom: 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Ionicons name="sparkles" size={15} color="#a3e635" />
                    {/* <Text className="typo-caption-bold text-lime-300">AI</Text> */}
                  </View>
                  <Text className="typo-h3 text-lime-300 text-left">צלם עם AI</Text>
                  <Text className="typo-caption text-lime-500/70 text-left">
                    זהוי אוטומטי של מרכיבים וערכים תזונתיים
                  </Text>
                  <View className="flex-row items-center mt-1 gap-1">
                    <Text className="typo-caption-bold text-lime-400">התחל עכשיו</Text>
                    <Ionicons name="chevron-back" size={11} color="#a3e635" />
                  </View>
                </View>
              </View>
            </Pressable>

            {/* ─── Section label ─── */}
            <Text className="typo-caption-bold text-white/25 mb-1 text-left">
              אפשרויות נוספות
            </Text>
            <Text className="typo-caption text-white/25 mb-2 text-left">
              גרור כדי לשחק עם התפריט
            </Text>

            {/* ─── Secondary options: draggable fan arc ─── */}
            <FanArcCarousel items={fanItems} />

            {/* ─── Cancel ─── */}
            <Pressable
              onPress={onClose}
              className="mt-5 min-h-[44px] items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="ביטול"
            >
              <Text className="typo-btn-secondary text-background-400">ביטול</Text>
            </Pressable>

          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddOptionsSheet;
