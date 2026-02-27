import { colors } from '@/colors';
import type { NutritionEntry } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

/** טווחי שעות ליום */
const TIME_SLOTS: { key: string; label: string; start: number; end: number }[] = [
  { key: 'morning', label: 'בוקר', start: 6, end: 12 },
  { key: 'noon', label: 'צהריים', start: 12, end: 15 },
  { key: 'afternoon', label: 'אחר צהריים', start: 15, end: 18 },
  { key: 'evening', label: 'ערב', start: 18, end: 21 },
  { key: 'night', label: 'לילה', start: 21, end: 30 }, // 21-24 + 0-6
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
  return 'night'; // 21-24 or 0-6
}

interface Props {
  entries: NutritionEntry[];
  onDelete: (entryId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  isDeleting: boolean;
  isDeletingGroup?: boolean;
}

/** מחזיר טקסט תצוגה: "שם × כמות סה״כ X גרם (מנה×כמות)" או "שם סה״כ X גרם" */
function formatEntryPortionLine(entry: NutritionEntry): string {
  const total = entry.portion_size;
  const sw = entry.serving_weight;
  if (sw != null && sw > 0) {
    const q = Math.round(total / sw);
    if (q >= 1) return `${entry.food_name} × ${q} סה״כ ${total} גרם (${sw} × ${q})`;
  }
  return `${entry.food_name} סה״כ ${total} גרם`;
}

/** בלוק לתצוגה: קבוצה (ארוחה) או רשומה בודדת */
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

/** מחזיר את ה-created_at של בלוק (לשיוך לציר זמן) */
function getBlockTimestamp(block: ListBlock): string {
  if (block.type === 'group') return block.entries[0]?.created_at ?? '';
  return block.entry.created_at;
}

/** מקובץ בלוקים לפי טווחי שעות, ממוין בוקר -> לילה */
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

// —— קומפוננטת רינדור מאכל אחת (אותה תצוגה לרשומה בודדת ולבתוך ארוחה) ——

interface FoodEntryRowProps {
  entry: NutritionEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function FoodEntryRow({ entry, onDelete, isDeleting }: FoodEntryRowProps) {
  return (
    <View className="bg-background-800 rounded-2xl border border-background-600 overflow-hidden">
      <View className="flex-row-reverse items-center p-3.5">
        <View className="bg-background-700 rounded-xl w-12 h-12 items-center justify-center mr-1">
          <Ionicons name="nutrition-outline" size={22} color={colors.orange[400]} />
        </View>
        <View className="flex-1 mr-3">
          <Text className="text-white text-base font-bold text-right" numberOfLines={2}>
            {formatEntryPortionLine(entry)}
          </Text>
          <Text className="text-background-400 text-xs text-right mt-0.5">
            {entry.calories} קק״ל
          </Text>
        </View>
        <Pressable
          onPress={() => onDelete(entry.id)}
          disabled={isDeleting}
          className="bg-red-500/10 rounded-xl p-2"
        >
          <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
        </Pressable>
      </View>
      <MacroBar entry={entry} />
    </View>
  );
}

function MacroBar({ entry }: { entry: NutritionEntry }) {
  return (
    <View className="flex-row-reverse border-t border-background-700 px-3.5 py-2.5">
      <View className="flex-row-reverse items-center flex-1 justify-around">
        <View className="flex-row-reverse items-center">
          <View className="w-2 h-2 rounded-full bg-lime-500 ml-1.5" />
          <Text className="text-background-300 text-xs">
            חלבון <Text className="text-lime-500 font-bold">{entry.protein}g</Text>
          </Text>
        </View>
        <View className="flex-row-reverse items-center">
          <View className="w-2 h-2 rounded-full bg-orange-500 ml-1.5" />
          <Text className="text-background-300 text-xs">
            פחמימות <Text className="text-orange-500 font-bold">{entry.carbs}g</Text>
          </Text>
        </View>
        <View className="flex-row-reverse items-center">
          <View className="w-2 h-2 rounded-full bg-red-500 ml-1.5" />
          <Text className="text-background-300 text-xs">
            שומן <Text className="text-red-500 font-bold">{entry.fat}g</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

// —— כרטיס רשומה בודדת (משתמש ב-FoodEntryRow) ——

function SingleEntryCard({
  entry,
  onDelete,
  isDeleting,
}: {
  entry: NutritionEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return <FoodEntryRow entry={entry} onDelete={onDelete} isDeleting={isDeleting} />;
}

// —— כרטיס ארוחה (משתמש ב-FoodEntryRow לכל מאכל + אופציה למחיקת ארוחה) ——

function GroupBlockCard({
  groupName,
  groupId,
  entries,
  onDelete,
  onDeleteGroup,
  isDeleting,
  isDeletingGroup,
}: {
  groupName: string;
  groupId: string;
  entries: NutritionEntry[];
  onDelete: (id: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  isDeleting: boolean;
  isDeletingGroup?: boolean;
}) {
  const totalCal = entries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <View className="bg-background-800 rounded-3xl border border-white/5 overflow-hidden shadow-lg mb-4">
      <View className="flex-row-reverse items-center px-4 py-4 bg-background-700/30 border-b border-white/5">
        <View className="bg-lime-500/10 rounded-xl w-12 h-12 items-center justify-center ml-3">
          <Ionicons name="restaurant" size={22} color="#84cc16" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-bold text-right">{groupName}</Text>
          <Text className="text-gray-400 text-xs text-right mt-0.5">
            {entries.length} פריטים •{' '}
            <Text className="text-lime-400 font-medium">{totalCal} קק״ל</Text>
          </Text>
        </View>
        {onDeleteGroup != null && (
          <Pressable
            onPress={() => onDeleteGroup(groupId)}
            disabled={isDeletingGroup}
            className="bg-red-500/20 rounded-xl p-2.5 mr-2 flex-row-reverse items-center"
          >
            <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
            <Text className="text-red-400 text-[10px] font-bold mt-0.5">מחק ארוחה</Text>
          </Pressable>
        )}
      </View>

      {entries.map((entry, index) => (
        <View key={entry.id || index} className="px-4 py-2">
          <FoodEntryRow entry={entry} onDelete={onDelete} isDeleting={isDeleting} />
        </View>
      ))}

      <View className="bg-background-900/50 px-4 py-4 border-t border-white/5">
        <View className="flex-row-reverse justify-between items-center mb-3 px-1">
          <Text className="text-background-400 text-[11px] font-bold tracking-widest uppercase">
            סיכום ערכים לארוחה
          </Text>
          <View className="h-[1px] flex-1 bg-white/5 mx-3" />
        </View>
        <View className="flex-row-reverse items-center justify-between">
          <View className="items-center flex-1">
            <Text className="text-gray-400 text-[10px] mb-1">חלבון</Text>
            <View className="bg-lime-500/10 px-2 py-1 rounded-lg">
              <Text className="text-lime-500 font-bold text-sm">
                {Math.round(entries.reduce((s, e) => s + (e.protein || 0), 0))}g
              </Text>
            </View>
          </View>
          <View className="w-[1px] h-8 bg-white/10" />
          <View className="items-center flex-1">
            <Text className="text-gray-400 text-[10px] mb-1">פחמימות</Text>
            <View className="bg-orange-500/10 px-2 py-1 rounded-lg">
              <Text className="text-orange-500 font-bold text-sm">
                {Math.round(entries.reduce((s, e) => s + (e.carbs || 0), 0))}g
              </Text>
            </View>
          </View>
          <View className="w-[1px] h-8 bg-white/10" />
          <View className="items-center flex-1">
            <Text className="text-gray-400 text-[10px] mb-1">שומן</Text>
            <View className="bg-red-500/10 px-2 py-1 rounded-lg">
              <Text className="text-red-500 font-bold text-sm">
                {Math.round(entries.reduce((s, e) => s + (e.fat || 0), 0))}g
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// —— רינדור סקשן ציר זמן (כותרת + רשימת בלוקים) ——

function TimeSlotSection({
  slotLabel,
  slotKey,
  blocks,
  onDelete,
  onDeleteGroup,
  isDeleting,
  isDeletingGroup,
}: {
  slotLabel: string;
  slotKey: string;
  blocks: ListBlock[];
  onDelete: (id: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  isDeleting: boolean;
  isDeletingGroup?: boolean;
}) {
  if (blocks.length === 0) return null;

  const slotInfo = TIME_SLOTS.find((s) => s.key === slotKey);

  return (
    <View className="mb-6">
      <View className="flex-row-reverse items-center mb-3">
        <View className="bg-background-700/80 rounded-xl px-3 py-1.5">
          <Text className="text-lime-400 font-bold text-sm">{slotLabel}</Text>
          {slotInfo != null && (
            <Text className="text-background-400 text-[10px] text-right">
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
            />
          </View>
        ) : (
          <View key={block.entry.id} className="mb-2.5">
            <SingleEntryCard
              entry={block.entry}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </View>
        )
      )}
    </View>
  );
}

const NutritionEntriesList = ({
  entries,
  onDelete,
  onDeleteGroup,
  isDeleting,
  isDeletingGroup = false,
}: Props) => {
  const blocks = useMemo(() => groupEntriesIntoBlocks(entries), [entries]);
  const bySlot = useMemo(() => groupBlocksByTimeSlot(blocks), [blocks]);

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
      <View className="flex-row-reverse items-center mb-3">
        <Ionicons name="today-outline" size={18} color={colors.lime[500]} />
        <Text className="text-white text-lg font-bold mr-2">מאכלים שנוספו היום</Text>
        <View className="bg-lime-500/20 rounded-full px-2 py-0.5 mr-2">
          <Text className="text-lime-400 text-xs font-bold">{entries.length}</Text>
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
          />
        );
      })}
    </View>
  );
};

export default NutritionEntriesList;
