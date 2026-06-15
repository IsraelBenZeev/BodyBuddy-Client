import { colors } from '@/colors';
import EntryDetailModal from '@/src/Features/nutrition/review/EntryDetailModal';
import type { NutritionEntry } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

/** טווחי שעות ליום */
const TIME_SLOTS: { key: string; label: string; start: number; end: number }[] = [
  { key: 'morning', label: 'בוקר', start: 6, end: 12 },
  { key: 'noon', label: 'צהריים', start: 12, end: 15 },
  { key: 'afternoon', label: 'אחר צהריים', start: 15, end: 18 },
  { key: 'evening', label: 'ערב', start: 18, end: 21 },
  { key: 'night', label: 'לילה', start: 21, end: 30 },
];

function getHourFromIso(iso: string): number {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

function getTimeSlotKey(iso: string): string {
  const h = getHourFromIso(iso);
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 15) return 'noon';
  if (h >= 15 && h < 18) return 'afternoon';
  if (h >= 18 && h < 21) return 'evening';
  return 'night';
}

interface Props {
  entries: NutritionEntry[];
  onDelete: (entryId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  isDeleting: boolean;
  isDeletingGroup?: boolean;
}

function formatEntryPortionLine(entry: NutritionEntry): string {
  if (entry.portion_unit === 'unit') return `${entry.food_name} × ${entry.portion_size}`;
  return `${entry.food_name} ${entry.portion_size} גרם`;
}

type ListBlock =
  | { type: 'group'; groupId: string; entries: NutritionEntry[] }
  | { type: 'single'; entry: NutritionEntry };

function groupEntriesIntoBlocks(entries: NutritionEntry[]): ListBlock[] {
  const withGroup = entries.filter((e) => e.group_id);
  const withoutGroup = entries.filter((e) => !e.group_id);

  const groupMap = new Map<string, NutritionEntry[]>();
  for (const e of withGroup) {
    const id = e.group_id!;
    if (!groupMap.has(id)) groupMap.set(id, []);
    groupMap.get(id)!.push(e);
  }
  groupMap.forEach((arr) =>
    arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  );

  const blocks: ListBlock[] = [];
  const groupBlocks = Array.from(groupMap.entries()).map(
    ([groupId, groupEntries]) =>
      ({ type: 'group' as const, groupId, entries: groupEntries }) as ListBlock
  );
  groupBlocks.sort(
    (a, b) =>
      new Date((b as { entries: NutritionEntry[] }).entries[0]?.created_at ?? 0).getTime() -
      new Date((a as { entries: NutritionEntry[] }).entries[0]?.created_at ?? 0).getTime()
  );
  blocks.push(...groupBlocks);
  withoutGroup.forEach((entry) => blocks.push({ type: 'single', entry }));
  return blocks;
}

function getBlockTimestamp(block: ListBlock): string {
  if (block.type === 'group') return block.entries[0]?.created_at ?? '';
  return block.entry.created_at;
}

function groupBlocksByTimeSlot(blocks: ListBlock[]): Map<string, ListBlock[]> {
  const order = ['morning', 'noon', 'afternoon', 'evening', 'night'];
  const bySlot = new Map<string, ListBlock[]>();
  for (const key of order) bySlot.set(key, []);

  for (const block of blocks) {
    const ts = getBlockTimestamp(block);
    const key = ts ? getTimeSlotKey(ts) : 'noon';
    bySlot.get(key)!.push(block);
  }

  return bySlot;
}

// —— מאקרו-בר ——

const MacroBar = React.memo(function MacroBar({ entry }: { entry: NutritionEntry }) {
  return (
    <View className="flex-row border-t border-background-700 px-4 py-2.5 items-center justify-around">
      <Text className="typo-caption text-background-500">
        קלוריות <Text className="typo-caption-bold text-lime-400">{Math.round(entry.calories)}</Text>
      </Text>
      <View className="w-[1px] h-3 bg-background-600" />
      <Text className="typo-caption text-background-500">
        חלבון <Text className="typo-caption-bold text-blue-400">{Math.round(entry.protein)}g</Text>
      </Text>
      <View className="w-[1px] h-3 bg-background-600" />
      <Text className="typo-caption text-background-500">
        פחמימות <Text className="typo-caption-bold text-amber-400">{Math.round(entry.carbs)}g</Text>
      </Text>
    </View>
  );
});

// —— שורת מאכל ——

interface FoodEntryRowProps {
  entry: NutritionEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onPress: () => void;
}

const FoodEntryRow = React.memo(function FoodEntryRow({
  entry,
  onDelete,
  isDeleting,
  onPress,
}: FoodEntryRowProps) {
  const handleDelete = useCallback(() => {
    Alert.alert(
      'הסרה מהיומן',
      `האם להסיר את "${entry.food_name}" מהיומן?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'הסר', style: 'destructive', onPress: () => onDelete(entry.id) },
      ]
    );
  }, [onDelete, entry.id, entry.food_name]);

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-800 rounded-2xl border border-background-600 overflow-hidden "
      accessibilityRole="button"
      accessibilityLabel={`פרטי ${entry.food_name}`}
      accessibilityHint="לחץ לפרטים מלאים"
    >
      <View className="flex-row items-center p-3.5">
        <View className="bg-background-700 rounded-xl w-12 h-12 items-center justify-center mr-1">
          <Ionicons name="nutrition-outline" size={22} color={colors.orange[400]} />
        </View>
        <View className="flex-1 mr-2 items-start">
          <Text className="typo-body-primary text-white text-left" numberOfLines={2}>
            {formatEntryPortionLine(entry)}
          </Text>
          {entry.source === 'ai' && (
            <View className="flex-row items-center gap-1 bg-lime-500/15 border border-lime-500/30 rounded-full px-2 py-0.5 mt-1">
              <View className="w-1 h-1 rounded-full bg-lime-400" />
              <Text className="typo-caption text-lime-400">AI</Text>
            </View>
          )}
        </View>
        <View className="items-center mx-2">
          <Text className="typo-h4 text-white">{Math.round(entry.calories)}</Text>
          <Text className="typo-caption text-background-400">קק״ל</Text>
        </View>
        <Pressable
          onPress={handleDelete}
          disabled={isDeleting}
          className="bg-red-500/10 rounded-xl p-2"
          accessibilityRole="button"
          accessibilityLabel={`מחק ${entry.food_name}`}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
        </Pressable>
      </View>
      <MacroBar entry={entry} />
    </Pressable>
  );
});

// —— כרטיס רשומה בודדת ——

const SingleEntryCard = React.memo(function SingleEntryCard({
  entry,
  onDelete,
  isDeleting,
  onPress,
}: {
  entry: NutritionEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onPress: () => void;
}) {
  return <FoodEntryRow entry={entry} onDelete={onDelete} isDeleting={isDeleting} onPress={onPress} />;
});

// —— כרטיס ארוחה ——

const GroupBlockCard = React.memo(function GroupBlockCard({
  groupName,
  groupId,
  entries,
  onDelete,
  onDeleteGroup,
  isDeleting,
  isDeletingGroup,
  onPressEntry,
  onPressGroup,
}: {
  groupName: string;
  groupId: string;
  entries: NutritionEntry[];
  onDelete: (id: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  isDeleting: boolean;
  isDeletingGroup?: boolean;
  onPressEntry: (entry: NutritionEntry) => void;
  onPressGroup: () => void;
}) {
  const totalCal = Math.round(entries.reduce((sum, e) => sum + e.calories, 0));
  const totalProtein = Math.round(entries.reduce((s, e) => s + (e.protein || 0), 0));
  const totalCarbs = Math.round(entries.reduce((s, e) => s + (e.carbs || 0), 0));

  const handleDeleteGroup = useCallback(() => {
    Alert.alert(
      'מחיקת ארוחה',
      `האם למחוק את "${groupName}" (${entries.length} פריטים)?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'מחק', style: 'destructive', onPress: () => onDeleteGroup?.(groupId) },
      ]
    );
  }, [onDeleteGroup, groupId, groupName, entries.length]);

  return (
    <View className="bg-background-800 rounded-3xl border border-white/5 overflow-hidden shadow-lg mb-4">
      <Pressable
        onPress={onPressGroup}
        className="flex-row items-center px-4 py-4 bg-background-700/30 border-b border-white/5"
        accessibilityRole="button"
        accessibilityLabel={`פרטי ארוחה ${groupName}`}
        accessibilityHint="לחץ לפרטים מלאים"
      >
        <View className="bg-lime-500/10 rounded-xl w-12 h-12 items-center justify-center ml-3">
          <Ionicons name="restaurant" size={22} color="#84cc16" />
        </View>
        <View className="flex-1 items-start">
          <View className="flex-row items-center gap-2">
            <Text className="typo-body-primary text-white">{groupName}</Text>
            {entries[0]?.source === 'ai' && (
              <View className="flex-row items-center gap-1 bg-lime-500/15 border border-lime-500/30 rounded-full px-2 py-0.5">
                <View className="w-1 h-1 rounded-full bg-lime-400" />
                <Text className="typo-caption text-lime-400">AI</Text>
              </View>
            )}
          </View>
          <Text className="typo-caption text-gray-400 mt-0.5">
            {entries.length} פריטים •{' '}
            <Text className="text-lime-400 font-medium">{totalCal} קק״ל</Text>
          </Text>
        </View>
        {onDeleteGroup != null && (
          <Pressable
            onPress={handleDeleteGroup}
            disabled={isDeletingGroup}
            className="bg-red-500/20 rounded-xl p-2.5 ml-2 flex-row items-center"
            accessibilityRole="button"
            accessibilityLabel={`מחק ארוחה ${groupName}`}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
            <Text className="typo-caption-bold text-red-400 mt-0.5"> מחק</Text>
          </Pressable>
        )}
      </Pressable>

      {entries.map((entry) => (
        <View key={entry.id} className="px-4 py-2">
          <FoodEntryRow
            entry={entry}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onPress={() => onPressEntry(entry)}
          />
        </View>
      ))}

      <View className="bg-background-900/50 px-4 py-3 border-t border-white/5">
        <Text className="typo-caption-bold text-background-400 tracking-widest uppercase mb-2 text-center">
          סיכום ערכים לארוחה
        </Text>
        <View className="flex-row items-center justify-around">
          <Text className="typo-caption text-background-500">
            קלוריות <Text className="typo-label text-lime-400">{totalCal}</Text>
          </Text>
          <View className="w-[1px] h-3 bg-background-600" />
          <Text className="typo-caption text-background-500">
            חלבון <Text className="typo-label text-blue-400">{totalProtein}g</Text>
          </Text>
          <View className="w-[1px] h-3 bg-background-600" />
          <Text className="typo-caption text-background-500">
            פחמימות <Text className="typo-label text-amber-400">{totalCarbs}g</Text>
          </Text>
        </View>
      </View>
    </View>
  );
});

// —— סקשן ציר זמן ——

type ModalState =
  | { type: 'single'; entry: NutritionEntry }
  | { type: 'group'; entries: NutritionEntry[]; groupName: string }
  | null;

const TimeSlotSection = React.memo(function TimeSlotSection({
  slotLabel,
  slotKey,
  blocks,
  onDelete,
  onDeleteGroup,
  isDeleting,
  isDeletingGroup,
  onOpenModal,
}: {
  slotLabel: string;
  slotKey: string;
  blocks: ListBlock[];
  onDelete: (id: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  isDeleting: boolean;
  isDeletingGroup?: boolean;
  onOpenModal: (state: NonNullable<ModalState>) => void;
}) {
  if (blocks.length === 0) return null;

  const slotInfo = TIME_SLOTS.find((s) => s.key === slotKey);

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <View className="bg-background-700/80 rounded-xl px-3 py-1.5">
          <Text className="typo-label text-lime-400">{slotLabel}</Text>
          {slotInfo != null && (
            <Text className="typo-caption text-background-400">
              {slotInfo.start === 21 ? '21:00–06:00' : `${slotInfo.start}:00–${slotInfo.end}:00`}
            </Text>
          )}
        </View>
        <View className="h-[2px] flex-1 bg-background-600 rounded-full ml-3" />
      </View>
      {blocks.map((block) =>
        block.type === 'group' ? (
          <View key={block.groupId} className="mb-4">
            <GroupBlockCard
              groupName={block.entries[0]?.group_name || 'ארוחה'}
              groupId={block.groupId}
              entries={block.entries}
              onDelete={onDelete}
              onDeleteGroup={onDeleteGroup}
              isDeleting={isDeleting}
              isDeletingGroup={isDeletingGroup}
              onPressEntry={(entry) => onOpenModal({ type: 'single', entry })}
              onPressGroup={() =>
                onOpenModal({
                  type: 'group',
                  entries: block.entries,
                  groupName: block.entries[0]?.group_name || 'ארוחה',
                })
              }
            />
          </View>
        ) : (
          <View key={block.entry.id} className="mb-2.5">
            <SingleEntryCard
              entry={block.entry}
              onDelete={onDelete}
              isDeleting={isDeleting}
              onPress={() => onOpenModal({ type: 'single', entry: block.entry })}
            />
          </View>
        )
      )}
    </View>
  );
});

// —— קומפוננט ראשי ——

const NutritionEntriesList = ({
  entries,
  onDelete,
  onDeleteGroup,
  isDeleting,
  isDeletingGroup = false,
}: Props) => {
  const [modalState, setModalState] = useState<ModalState>(null);

  const blocks = useMemo(() => groupEntriesIntoBlocks(entries), [entries]);
  const bySlot = useMemo(() => groupBlocksByTimeSlot(blocks), [blocks]);

  const handleOpenModal = useCallback((state: NonNullable<ModalState>) => {
    setModalState(state);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState(null);
  }, []);

  if (entries.length === 0) {
    return (
      <View className="bg-background-800 rounded-2xl p-6 border border-background-600">
        <View className="items-center">
          <Ionicons name="nutrition-outline" size={48} color={colors.background[500]} />
          <Text className="text-background-400 text-center mt-2">עדיין לא נוספו מאכלים היום</Text>
        </View>
      </View>
    );
  }

  const slotOrder = TIME_SLOTS.map((s) => s.key);

  return (
    <View>
      <View className="flex-row items-center mb-3">
        <Ionicons name="today-outline" size={18} color={colors.lime[500]} />
        <Text className="typo-h4 text-white mr-2">מאכלים שנוספו היום</Text>
        <View className="bg-lime-500/20 rounded-full px-2 py-0.5 mr-2">
          <Text className="typo-caption-bold text-lime-400">{entries.length}</Text>
        </View>
      </View>

      {slotOrder.map((key) => {
        const label = TIME_SLOTS.find((s) => s.key === key)?.label ?? key;
        const slotBlocks = bySlot.get(key) ?? [];
        return (
          <TimeSlotSection
            key={key}
            slotKey={key}
            slotLabel={label}
            blocks={slotBlocks}
            onDelete={onDelete}
            onDeleteGroup={onDeleteGroup}
            isDeleting={isDeleting}
            isDeletingGroup={isDeletingGroup}
            onOpenModal={handleOpenModal}
          />
        );
      })}

      <EntryDetailModal
        visible={modalState !== null}
        onClose={handleCloseModal}
        entry={modalState?.type === 'single' ? modalState.entry : undefined}
        groupEntries={modalState?.type === 'group' ? modalState.entries : undefined}
        groupName={modalState?.type === 'group' ? modalState.groupName : undefined}
      />
    </View>
  );
};

export default NutritionEntriesList;
