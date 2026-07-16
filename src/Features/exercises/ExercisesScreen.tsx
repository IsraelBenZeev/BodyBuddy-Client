import { colors } from '@/colors';
import ListExercise from '@/src/Features/workoutsPlans/form/ListExercises';
import { useExercises, useFavoriteIds, useToggleFavorite, useUserCustomExercises } from '@/src/hooks/useEcercises';
import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import { isCustomExerciseId } from '@/src/types/customExercise';
import { Exercise } from '@/src/types/exercise';
import { modeListExercises } from '@/src/types/mode';
import BackGround from '@/src/ui/BackGround';
import EmptyState from '@/src/ui/EmptyState';
import Handle from '@/src/ui/Handle';
import Loading from '@/src/ui/Loading';
import ModalBottom from '@/src/ui/ModalButtom';
import ActionButton from '@/src/ui/ActionButton';
import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import AddCustomExerciseModal from './AddCustomExerciseModal';
import CardExercise from './CardExercise';
import Filters from './Filters';
import LocationFilter, { LocationFilterValue } from './LocationFilter';
import MiniAvatar from './MiniAvatar';
import ReportMissingExerciseModal from './ReportMissingExerciseModal';
import SubBodyPartFilters, { FilterChipItem } from './SubBodyPartFilters';

interface ExercisesScreenProps {
  bodyParts: string | string[] | undefined;
  mode: string | string[] | undefined;
}

type ExerciseListItem =
  | { kind: 'exercise'; exercise: Exercise }
  | { kind: 'section-header'; label: string };

const ExercisesScreen = ({ bodyParts, mode }: ExercisesScreenProps) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const selectedPartsArray = JSON.parse(bodyParts as string) as BodyPart[];
  const exerciseSelectedIds = useWorkoutStore((state) => state.selectedExerciseIds);
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const sheetRef = useRef<any>(null);

  const { data: profile } = useProfile(user?.id);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useExercises(
    user?.id as string,
    selectedPartsArray
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | 'all'>('all');
  const [selectedSubBodyPart, setSelectedSubBodyPart] = useState<string | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<LocationFilterValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustomExercise, setShowAddCustomExercise] = useState(false);
  const [showReportMissing, setShowReportMissing] = useState(false);
  const { data: favorites = [] } = useFavoriteIds(user?.id);
  const { mutate: toggleFavMutate } = useToggleFavorite(user?.id);
  const { data: customExercises = [] } = useUserCustomExercises(user?.id);
  const allExercises = useMemo(() => {
    const catalog = data?.pages.flatMap((page) => page.exercises) ?? [];
    // Custom exercises aren't fetched per body part like the catalog is — filter here so a
    // custom "chest" exercise doesn't leak into the "abs"/"back" screens too.
    const matchingCustom = customExercises.filter((exercise) =>
      exercise.bodyParts.some((part) => selectedPartsArray.includes(part as BodyPart))
    );
    return [...catalog, ...matchingCustom];
  }, [data, customExercises, selectedPartsArray]);

  const selectedPartsText = useMemo(
    () => selectedPartsArray.map((part) => partsBodyHebrew[part]).join(', '),
    [selectedPartsArray]
  );

  const isCardioOnly = selectedPartsArray.length === 1 && selectedPartsArray[0] === 'cardio';

  // if(mode === 'picker')
  // בונה אינדקס פעם אחת בטעינת עמוד — פילטור O(1) במקום O(n)
  const exerciseIndex = useMemo(() => {
    const index = new Map<string, typeof allExercises>();
    index.set('all', allExercises);
    for (const exercise of allExercises) {
      for (const part of exercise.bodyParts) {
        if (!index.has(part)) index.set(part, []);
        index.get(part)!.push(exercise);
      }
    }
    return index;
  }, [allExercises]);

  const uniqueBodyParts = useMemo(() => {
    return Array.from(exerciseIndex.keys()).filter((k) => k !== 'all') as BodyPart[];
  }, [exerciseIndex]);

  const handleSetSelectedFilter = useCallback((filter: string | 'all') => {
    setSelectedFilter(filter);
    setSelectedSubBodyPart('all');
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      toggleFavMutate({ exerciseId: id, isFav: favorites.includes(id) });
    },
    [favorites, toggleFavMutate]
  );

  const deferredFilter = useDeferredValue(selectedFilter);
  const deferredSubBodyPart = useDeferredValue(selectedSubBodyPart);
  const deferredSearch = useDeferredValue(searchQuery);

  // אינדוקס לפי התווית העברית (subBodyParts_he) ולא לפי המפתח האנגלי — כי ב-DB יש כמה
  // ערכים אנגליים שונים (למשל "rear shoulders" ו-"rear delts") שמתורגמים לאותה תווית
  // עברית ("כתף אחורית"), ואם מקבצים לפי המפתח האנגלי מקבלים שני צ'יפים כפולים במקום אחד
  const subBodyPartIndex = useMemo(() => {
    const index = new Map<string, typeof allExercises>();
    const base = exerciseIndex.get(deferredFilter) ?? exerciseIndex.get('all') ?? [];
    index.set('all', base);
    for (const exercise of base) {
      for (const label of exercise.subBodyParts_he) {
        if (!label) continue;
        if (!index.has(label)) index.set(label, []);
        index.get(label)!.push(exercise);
      }
    }
    return index;
  }, [exerciseIndex, deferredFilter]);

  const uniqueSubBodyParts = useMemo<FilterChipItem[]>(
    () =>
      Array.from(subBodyPartIndex.keys())
        .filter((k) => k !== 'all')
        .map((label) => ({ key: label, label })),
    [subBodyPartIndex]
  );

  const filteredExercises = useMemo(() => {
    const bySubBodyPart =
      subBodyPartIndex.get(deferredSubBodyPart) ?? subBodyPartIndex.get('all') ?? [];
    const byLocation =
      selectedLocation === 'all'
        ? bySubBodyPart
        : bySubBodyPart.filter((ex) => (selectedLocation === 'home' ? ex.homeFriendly : !ex.homeFriendly));
    if (!deferredSearch.trim()) return byLocation;
    const q = deferredSearch.toLowerCase();
    return byLocation.filter(
      (ex) => ex.name.toLowerCase().includes(q) || ex.name_he.includes(deferredSearch)
    );
  }, [subBodyPartIndex, deferredSubBodyPart, selectedLocation, deferredSearch]);

  // תרגילים אישיים מוצגים כקבוצה נפרדת בסוף הרשימה, מתחת לכותרת "תרגילים אישיים",
  // ולא מסומנים בנפרד בכל כרטיס.
  const listItems = useMemo<ExerciseListItem[]>(() => {
    const catalogItems = filteredExercises.filter((ex) => !isCustomExerciseId(ex.exerciseId));
    const customItems = filteredExercises.filter((ex) => isCustomExerciseId(ex.exerciseId));
    const items: ExerciseListItem[] = catalogItems.map((exercise) => ({ kind: 'exercise', exercise }));
    if (customItems.length > 0) {
      items.push({ kind: 'section-header', label: 'תרגילים אישיים' });
      items.push(...customItems.map((exercise) => ({ kind: 'exercise' as const, exercise })));
    }
    return items;
  }, [filteredExercises]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listEmptyComponent = useMemo(() => {
    if (allExercises.length === 0) {
      return (
        <EmptyState
          icon={<Ionicons name="construct-outline" size={64} color={colors.lime[500]} />}
          title="עדיין לא נוצרו תרגילים לאזור זה"
          description="הצוות שלנו עובד על זה, בקרוב יתווספו כאן תרגילים חדשים."
          action={{
            label: 'חזרה לבחירת אזור',
            onPress: () => router.back(),
          }}
        />
      );
    }
    return (
      <View className="flex-1">
        <EmptyState
          icon={<Ionicons name="search-outline" size={64} color={colors.lime[500]} />}
          title="לא נמצאו תרגילים"
          description="נסה לשנות את מילות החיפוש או להסיר חלק מהסינונים. לא מוצא/ת את התרגיל שלך?"
        />
        <View className="items-center gap-3 px-8 -mt-4 pb-6">
          <ActionButton
            onPress={() => setShowAddCustomExercise(true)}
            label="הוסף ידנית"
            iconName="add-circle-outline"
            variant="outline"
            size="md"
            fullWidth
            accessibilityLabel="הוסף תרגיל חדש באופן ידני"
          />
          <ActionButton
            onPress={() => setShowReportMissing(true)}
            label="דווח שהתרגיל חסר"
            iconName="flag-outline"
            variant="secondary"
            size="md"
            fullWidth
            accessibilityLabel="דווח שהתרגיל חסר מהמאגר"
          />
        </View>
      </View>
    );
  }, [allExercises.length, router]);

  return (
    <BackGround>
      {mode === 'view' && (
        <View className="pt-4">
          <View className="px-6 mb-6 flex-row items-center gap-4 ">
            <AppButton
              onPress={() => router.back()}
              haptic="light"
              animationType="scale"
              className="items-center justify-center bg-lime-500/15 border border-lime-500/40 rounded-full p-1"
              style={{ width: 60, height: 60 }}
              accessibilityLabel="חזור"
              accessibilityRole="button"
              accessibilityHint="חזרה למסך הקודם"
            >
              <Ionicons name="chevron-forward" size={40} color={colors.lime[300]} />
            </AppButton>
            {isCardioOnly ? (
              <View
                className="items-center justify-center bg-lime-500/15 border border-lime-500/40 rounded-full"
                style={{ width: 50, height: 50 }}
                accessible
                accessibilityLabel="אירובי"
                importantForAccessibility="no"
              >
                <Ionicons name="walk-outline" size={26} color="#a3e635" />
              </View>
            ) : (
              profile?.gender && (
                <MiniAvatar
                  selectedParts={selectedPartsArray}
                  gender={profile.gender as 'male' | 'female'}
                />
              )
            )}
            <View className="flex-1 items-start">
              <Text className="typo-label text-lime-50 text-right uppercase tracking-widest">
                מתאמן על
              </Text>
              <Pressable
                onPress={() => setShowTooltip(true)}
                accessibilityLabel={selectedPartsText}
                accessibilityRole="text"
                accessibilityHint="לחץ לצפייה בשם המלא"
              >
                <Text className="typo-h3 text-white" numberOfLines={2} ellipsizeMode="tail">
                  {selectedPartsText}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 pt-2 items-center px-1">
          {mode === 'picker' && <Handle />}
          {mode === 'picker' && (
            <View className="w-full px-4 mb-4">
              <Text className="typo-h3 text-white">בחר תרגילים</Text>
            </View>
          )}
          <View className="w-full flex-1">
            {selectedPartsArray.length > 1 &&
              (selectedFilter === 'all' ? (
                <Filters
                  uniqueBodyParts={uniqueBodyParts}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={handleSetSelectedFilter}
                  mode={mode as modeListExercises}
                />
              ) : (
                <SubBodyPartFilters
                  items={uniqueSubBodyParts}
                  selected={selectedSubBodyPart}
                  onSelect={setSelectedSubBodyPart}
                  onBack={() => handleSetSelectedFilter('all')}
                  breadcrumb={partsBodyHebrew[selectedFilter as BodyPart]}
                />
              ))}
            {selectedPartsArray.length === 1 && uniqueSubBodyParts.length > 0 && (
              <SubBodyPartFilters
                items={uniqueSubBodyParts}
                selected={selectedSubBodyPart}
                onSelect={setSelectedSubBodyPart}
              />
            )}
            {allExercises.length > 0 && (
              <LocationFilter selected={selectedLocation} onSelect={setSelectedLocation} />
            )}
            <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 mx-2 mb-3 mt-2">
              <Ionicons name="search" size={18} color="#a3a3a3" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="חפש תרגיל..."
                placeholderTextColor="#525252"
                className="flex-1 typo-input text-white text-right py-3 px-2"
              />
              {searchQuery.length > 0 && (
                <AppButton
                  onPress={() => setSearchQuery('')}
                  haptic="light"
                  animationType="opacity"
                  accessibilityLabel="נקה חיפוש"
                >
                  <Ionicons name="close-circle" size={18} color="#a3a3a3" />
                </AppButton>
              )}
            </View>
            {mode === 'picker' && (
              <View className="flex-row items-center justify-between bg-zinc-900 border border-zinc-800/80 rounded-2xl px-4 py-3 mx-2 mb-3">
                <AppButton
                  onPress={() =>
                    isSheetOpen ? sheetRef.current?.close() : sheetRef.current?.snapToIndex(0)
                  }
                  animationType="opacity"
                  haptic="light"
                  className="flex-row items-center gap-2"
                  accessibilityLabel="הצג תרגילים נבחרים"
                  accessibilityRole="button"
                  disabled={exerciseSelectedIds.size === 0}
                >
                  <View
                    className={`rounded-full h-8 min-w-[32px] px-2 flex-row items-center justify-center ml-3 border ${exerciseSelectedIds.size > 0 ? 'bg-lime-500/20 border-lime-500/50' : 'bg-transparent border-zinc-700'}`}
                  >
                    <Text
                      className={`typo-btn-secondary ${exerciseSelectedIds.size > 0 ? 'text-lime-300' : 'text-zinc-400'}`}
                    >
                      {exerciseSelectedIds.size}
                    </Text>
                  </View>
                  <Text className="typo-btn-secondary text-zinc-300">תרגילים נבחרו</Text>
                  {exerciseSelectedIds.size > 0 && (
                    <Ionicons
                      name={isSheetOpen ? 'chevron-down' : 'chevron-up'}
                      size={14}
                      color="#a3e635"
                    />
                  )}
                </AppButton>

                {exerciseSelectedIds.size > 0 && (
                  <AppButton
                    onPress={clearAllExercises}
                    haptic="medium"
                    animationType="scale"
                    className="bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20"
                    accessibilityLabel="נקה כל הבחירות"
                  >
                    <Text className="typo-label text-red-400">נקה הכל</Text>
                  </AppButton>
                )}
              </View>
            )}
            <View className="w-full flex-1 px-6">
              <FlashList
                data={listItems}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) =>
                  item.kind === 'section-header' ? (
                    <View className="px-2 pt-2 pb-3">
                      <Text className="typo-caption-bold text-lime-400 uppercase tracking-widest text-right">
                        {item.label}
                      </Text>
                    </View>
                  ) : (
                    <CardExercise
                      item={item.exercise}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      mode={mode as modeListExercises}
                    />
                  )
                }
                keyExtractor={(item, index) =>
                  item.kind === 'section-header' ? `section-header-${index}` : item.exercise.exerciseId
                }
                getItemType={(item) => item.kind}
                // estimatedItemSize={110}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={listEmptyComponent}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <View className="py-6 items-center">
                      <Text className="typo-body text-lime-400">טוען תרגילים נוספים...</Text>
                    </View>
                  ) : (
                    <View className="items-center gap-3 pt-4 pb-8">
                      <Text className="typo-caption text-background-500">לא מוצא/ת את התרגיל שלך?</Text>
                      <View className="flex-row gap-2">
                        <ActionButton
                          onPress={() => setShowAddCustomExercise(true)}
                          label="הוסף ידנית"
                          iconName="add-circle-outline"
                          variant="outline"
                          size="sm"
                          accessibilityLabel="הוסף תרגיל חדש באופן ידני"
                        />
                        <ActionButton
                          onPress={() => setShowReportMissing(true)}
                          label="דווח"
                          iconName="flag-outline"
                          variant="secondary"
                          size="sm"
                          accessibilityLabel="דווח שהתרגיל חסר מהמאגר"
                        />
                      </View>
                    </View>
                  )
                }
              />
            </View>
          </View>
          {mode === 'picker' && (
            <View className="absolute bottom-10 left-0 right-0 items-center px-10">
              <ActionButton
                onPress={() => router.back()}
                label="שמור וסיים"
                iconName="checkmark"
                variant="primary"
                size="md"
                fullWidth
                accessibilityLabel="שמור וסיים"
              />
            </View>
          )}
        </View>
      )}
      <Modal
        visible={showTooltip}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable
          style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 120, paddingHorizontal: 24 }}
          onPress={() => setShowTooltip(false)}
          accessibilityLabel="סגור"
          accessibilityRole="button"
        >
          <View className="bg-zinc-900 rounded-2xl border border-lime-500 px-2 py-3">
            <View className="flex pr-1 ">
              <Pressable
                onPress={() => setShowTooltip(false)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                hitSlop={8}
                accessibilityLabel="סגור"
                accessibilityRole="button"
              >
                <X size={18} color={colors.lime[500]} strokeWidth={2} />
              </Pressable>
            </View>
            <Text className="typo-h3 text-white px-1">{selectedPartsText}</Text>
          </View>
        </Pressable>
      </Modal>
      {mode === 'picker' && (
        <ModalBottom
          ref={sheetRef}
          initialIndex={-1}
          enablePanDownToClose={true}
          minHeight="50%"
          maxHeight="50%"
          title="תרגילים נבחרים"
          onChange={setIsSheetOpen}
          onClosePress={() => sheetRef.current?.close()}
        >
          <ListExercise
            mode="edit"
            toggleExercise={toggleExercise}
            selectExercisesIds={[...exerciseSelectedIds]}
          />
        </ModalBottom>
      )}
      <AddCustomExerciseModal
        visible={showAddCustomExercise}
        onClose={() => setShowAddCustomExercise(false)}
        initialName={deferredSearch}
      />
      <ReportMissingExerciseModal
        visible={showReportMissing}
        onClose={() => setShowReportMissing(false)}
        initialQuery={deferredSearch}
      />
    </BackGround>
  );
};

export default ExercisesScreen;
