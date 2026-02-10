import { colors } from '@/colors';
import type { NutritionEntry } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

interface Props {
  entries: NutritionEntry[];
  onDelete: (entryId: string) => void;
  isDeleting: boolean;
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
  // Sort within each group by created_at (keep order from API)
  groupMap.forEach((arr) =>
    arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  );

  const blocks: ListBlock[] = [];
  // Groups first (by first entry's created_at), then standalone
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

const NutritionEntriesList = ({ entries, onDelete, isDeleting }: Props) => {
  const blocks = useMemo(() => groupEntriesIntoBlocks(entries), [entries]);

  if (entries.length === 0) {
    return (
      <View className="bg-background-800 rounded-2xl p-6 border border-background-600">
        <View className="items-center">
          <Ionicons name="nutrition-outline" size={48} color={colors.background[500]} />
          <Text className="text-background-400 text-center mt-2">עדיין לא נוספו מזונות היום</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row-reverse items-center mb-3">
        <Ionicons name="today-outline" size={18} color={colors.lime[500]} />
        <Text className="text-white text-lg font-bold mr-2">מזונות שנוספו היום</Text>
        <View className="bg-lime-500/20 rounded-full px-2 py-0.5 mr-2">
          <Text className="text-lime-400 text-xs font-bold">{entries.length}</Text>
        </View>
      </View>

      <FlatList
        data={blocks}
        keyExtractor={(b) => (b.type === 'group' ? b.groupId : b.entry.id)}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        renderItem={({ item: block }) =>
          block.type === 'group' ? (
            <GroupBlockCard
              groupName={block.entries[0]?.group_name || 'ארוחה'}
              entries={block.entries}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ) : (
            <SingleEntryCard entry={block.entry} onDelete={onDelete} isDeleting={isDeleting} />
          )
        }
      />
    </View>
  );
};

function SingleEntryCard({
  entry,
  onDelete,
  isDeleting,
}: {
  entry: NutritionEntry;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
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

function GroupBlockCard({
  groupName,
  entries,
  onDelete,
  isDeleting,
}: {
  groupName: string;
  entries: NutritionEntry[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const totalCal = entries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <View className="bg-background-800 rounded-3xl border border-white/5 overflow-hidden shadow-lg mb-4">
      {/* Header */}
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
      </View>

      {/* רשימת המאכלים */}
      <View>
        {entries.map((entry, index) => (
          <View
            key={entry.id || index}
            className="flex-row-reverse items-center px-4 py-4 border-b border-white/5"
          >
            <View className="flex-1">
              <View className="flex-row-reverse justify-between items-center mb-1">
                <Text className="text-white text-sm font-semibold text-right flex-1" numberOfLines={2}>
                  {formatEntryPortionLine(entry)}
                </Text>
              </View>

              <View className="flex-row-reverse items-center">
                <Text className="text-lime-500/80 text-[10px] font-medium ml-2">
                  חלבון {entry.protein}g
                </Text>
                <View className="w-1 h-1 rounded-full bg-gray-600 ml-2" />
                <Text className="text-orange-500/80 text-[10px] font-medium ml-2">
                  פחמימה {entry.carbs}g
                </Text>
                <View className="w-1 h-1 rounded-full bg-gray-600 ml-2" />
                <Text className="text-red-500/80 text-[10px] font-medium ml-2">
                  שומן {entry.fat}g
                </Text>
                <View className="flex-1" />
                <Text className="text-white/60 text-[11px] font-bold">{entry.calories} קק״ל</Text>
              </View>
            </View>

            {/* כפתור מחיקה - שים לב: אם onDelete גורם לניווט, זה עלול להיות מקור השגיאה */}
            
            <Pressable
              onPress={() => onDelete && onDelete(entry.id)}
              disabled={isDeleting}
              className="ml-4 active:opacity-50 p-1 mr-4 bg-red-500/20 rounded-xl"
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.red[300]} />
            </Pressable>
          </View>
        ))}
      </View>

      <View className="bg-background-900/50 px-4 py-4 border-t border-white/5">
        {/* כותרת סיכום קטנה */}
        <View className="flex-row-reverse justify-between items-center mb-3 px-1">
          <Text className="text-background-400 text-[11px] font-bold tracking-widest uppercase">
            סיכום ערכים לארוחה
          </Text>
          <View className="h-[1px] flex-1 bg-white/5 mx-3" />
        </View>

        <View className="flex-row-reverse items-center justify-between">
          {/* חלבון */}
          <View className="items-center flex-1">
            <Text className="text-gray-400 text-[10px] mb-1">חלבון</Text>
            <View className="bg-lime-500/10 px-2 py-1 rounded-lg">
              <Text className="text-lime-500 font-bold text-sm">
                {Math.round(entries.reduce((s, e) => s + (e.protein || 0), 0))}g
              </Text>
            </View>
          </View>

          <View className="w-[1px] h-8 bg-white/10" />

          {/* פחמימות */}
          <View className="items-center flex-1">
            <Text className="text-gray-400 text-[10px] mb-1">פחמימות</Text>
            <View className="bg-orange-500/10 px-2 py-1 rounded-lg">
              <Text className="text-orange-500 font-bold text-sm">
                {Math.round(entries.reduce((s, e) => s + (e.carbs || 0), 0))}g
              </Text>
            </View>
          </View>

          <View className="w-[1px] h-8 bg-white/10" />

          {/* שומן */}
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

export default NutritionEntriesList;
