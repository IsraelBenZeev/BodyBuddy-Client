import { colors } from '@/colors';
import type { NutritionEntry } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatPortion(entry: NutritionEntry): string {
  if (entry.portion_unit === 'unit') return `× ${entry.portion_size}`;
  return `${entry.portion_size} גרם`;
}

interface MacroChipProps {
  label: string;
  value: number;
  unit?: string;
  color: string;
  bg: string;
}

const MacroChip = React.memo(function MacroChip({ label, value, unit = 'g', color, bg }: MacroChipProps) {
  return (
    <View className="items-center flex-1">
      <Text className="typo-caption text-background-400 mb-1">{label}</Text>
      <View style={{ backgroundColor: bg }} className="rounded-xl px-3 py-1.5 min-w-[56px] items-center">
        <Text style={{ color }} className="typo-h4">
          {Math.round(value)}{unit}
        </Text>
      </View>
    </View>
  );
});

interface SingleEntryContentProps {
  entry: NutritionEntry;
}

const SingleEntryContent = React.memo(function SingleEntryContent({ entry }: SingleEntryContentProps) {
  return (
    <View className="items-center px-2">
      <View className="bg-background-700 rounded-2xl w-16 h-16 items-center justify-center mb-4">
        <Ionicons name="nutrition-outline" size={30} color={colors.orange[400]} />
      </View>
      <Text className="typo-h2 text-white text-center mb-1">{entry.food_name}</Text>
      <Text className="typo-label text-background-400 mb-6">{formatPortion(entry)}</Text>

      <View className="items-center mb-6">
        <Text style={{ fontSize: 52, fontWeight: '900', color: colors.lime[400], lineHeight: 56 }}>
          {Math.round(entry.calories)}
        </Text>
        <Text className="typo-label text-background-400">קק״ל</Text>
      </View>

      <View className="flex-row w-full justify-around">
        <MacroChip
          label="חלבון"
          value={entry.protein}
          color={colors.lime[400]}
          bg="rgba(132,204,22,0.12)"
        />
        <MacroChip
          label="פחמימות"
          value={entry.carbs}
          color={colors.orange[300]}
          bg="rgba(251,146,60,0.12)"
        />
        <MacroChip
          label="שומן"
          value={entry.fat}
          color="#94a3b8"
          bg="rgba(148,163,184,0.1)"
        />
      </View>
    </View>
  );
});

interface GroupEntryContentProps {
  entries: NutritionEntry[];
  groupName: string;
}

const GroupEntryContent = React.memo(function GroupEntryContent({ entries, groupName }: GroupEntryContentProps) {
  const totalCal = Math.round(entries.reduce((s, e) => s + e.calories, 0));
  const totalProtein = Math.round(entries.reduce((s, e) => s + e.protein, 0));
  const totalCarbs = Math.round(entries.reduce((s, e) => s + e.carbs, 0));
  const totalFat = Math.round(entries.reduce((s, e) => s + e.fat, 0));

  return (
    <View>
      <View className="items-center px-2 mb-6">
        <View className="bg-lime-500/10 rounded-2xl w-16 h-16 items-center justify-center mb-4">
          <Ionicons name="restaurant" size={30} color={colors.lime[400]} />
        </View>
        <Text className="typo-h2 text-white text-center mb-5">{groupName}</Text>

        <View className="items-center mb-5">
          <Text style={{ fontSize: 52, fontWeight: '900', color: colors.lime[400], lineHeight: 56 }}>
            {totalCal}
          </Text>
          <Text className="typo-label text-background-400">קק״ל סה״כ</Text>
        </View>
      </View>

      <View className="bg-background-700/50 rounded-2xl p-3 mb-5">
        {entries.map((entry, idx) => (
          <View
            key={entry.id}
            className={`flex-row items-center py-2.5 ${idx < entries.length - 1 ? 'border-b border-white/5' : ''}`}
          >
            <View className="flex-1">
              <Text className="typo-body-primary text-white" numberOfLines={1}>{entry.food_name}</Text>
              <Text className="typo-caption text-background-400">{formatPortion(entry)}</Text>
            </View>
            <View className="items-end gap-0.5">
              <Text className="typo-label text-lime-400">{Math.round(entry.calories)} קק״ל</Text>
              <Text className="typo-caption text-background-400">
                חלבון: {Math.round(entry.protein)}g  פחמימות: {Math.round(entry.carbs)}g
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="bg-background-700/30 rounded-2xl p-4 border border-white/5">
        <Text className="typo-caption-bold text-background-400 tracking-widest text-center mb-3">
          סיכום ארוחה
        </Text>
        <View className="flex-row">
          <MacroChip
            label="חלבון"
            value={totalProtein}
            color={colors.lime[400]}
            bg="rgba(132,204,22,0.12)"
          />
          <MacroChip
            label="פחמימות"
            value={totalCarbs}
            color={colors.orange[300]}
            bg="rgba(251,146,60,0.12)"
          />
          <MacroChip
            label="שומן"
            value={totalFat}
            color="#94a3b8"
            bg="rgba(148,163,184,0.1)"
          />
        </View>
      </View>
    </View>
  );
});

interface Props {
  visible: boolean;
  onClose: () => void;
  entry?: NutritionEntry;
  groupEntries?: NutritionEntry[];
  groupName?: string;
}

const EntryDetailModal = ({ visible, onClose, entry, groupEntries, groupName }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        accessible={false}
      >
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="סגור פרטים"
        />
        <View className="bg-background-900 rounded-t-3xl px-5 pt-4 max-h-[85%]" style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="flex-row justify-between items-center mb-5">
            <Text className="typo-h3 text-white">פרטים</Text>
            <Pressable
              onPress={onClose}
              className="bg-background-700 rounded-full w-9 h-9 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="סגור פרטים"
            >
              <Ionicons name="close" size={20} color={colors.background[300]} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {entry != null && <SingleEntryContent entry={entry} />}
            {groupEntries != null && groupEntries.length > 0 && (
              <GroupEntryContent entries={groupEntries} groupName={groupName ?? 'ארוחה'} />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EntryDetailModal;
