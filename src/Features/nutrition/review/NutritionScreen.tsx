import { colors } from '@/colors';
import AddOptionsSheet from '@/src/Features/nutrition/add/AddOptionsSheet';
import CameraAIModal from '@/src/Features/nutrition/add/ai/CameraAIModal';
import ModalAddFoods from '@/src/Features/nutrition/add/ModalAddFoods';
import MacroPieChart from '@/src/Features/nutrition/review/MacroPieChart';
import NutritionEntriesList from '@/src/Features/nutrition/review/NutritionEntriesList';
import ProgressStats from '@/src/Features/nutrition/review/ProgressStats';
import {
  useDeleteNutritionEntriesByGroupId,
  useDeleteNutritionEntry,
  useNutritionEntries,
} from '@/src/hooks/useNutrition';
import { useProfile, useUpdateProfileDisplaySettings } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import { DEFAULT_PROTEIN_PER_KG } from '@/src/types/profile';
import ActionButton from '@/src/ui/ActionButton';
import BackGround from '@/src/ui/BackGround';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import {
  calculateNutritionGoals,
  getMotivationMessage,
  getTodayDate,
  sumEntriesToDailyConsumed,
} from '@/src/utils/calculateNutritionMetrics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
const toRgba = (rgb: string, alpha: number): string =>
  rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);

const NutritionScreen = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const today = getTodayDate();
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const closeAddFoodSheet = useCallback(() => setIsAddFoodOpen(false), []);
  const handleShowOptions = useCallback(() => setShowOptions(true), []);
  const handleCloseOptions = useCallback(() => setShowOptions(false), []);
  const handleSelectFromList = useCallback(() => {
    setShowOptions(false);
    setIsAddFoodOpen(true);
  }, []);
  const handleAddNewFood = useCallback(() => {
    setShowOptions(false);
    router.push('/add-food/create');
  }, [router]);
  const handleAddMeal = useCallback(() => {
    setShowOptions(false);
    router.push('/MealBuilder/create');
  }, [router]);
  const handleCameraAI = useCallback(() => {
    setShowOptions(false);
    setShowCameraModal(true);
  }, []);
  const handleCloseCameraModal = useCallback(() => setShowCameraModal(false), []);

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(16)).current;
  const isButtonVisibleRef = useRef(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const shouldShow = y > 80;
      if (shouldShow !== isButtonVisibleRef.current) {
        isButtonVisibleRef.current = shouldShow;
        setIsButtonVisible(shouldShow);
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: shouldShow ? 1 : 0,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(buttonTranslateY, {
            toValue: shouldShow ? 0 : 12,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    [buttonOpacity, buttonTranslateY]
  );

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { mutate: updateDisplaySettings } = useUpdateProfileDisplaySettings(user?.id ?? '');
  const { data: entries = [], isLoading: isEntriesLoading } = useNutritionEntries(user?.id, today);

  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteNutritionEntry(
    user?.id ?? '',
    today
  );
  const { mutate: deleteGroup, isPending: isDeletingGroup } = useDeleteNutritionEntriesByGroupId(
    user?.id ?? '',
    today
  );

  const goals = useMemo(() => {
    return calculateNutritionGoals(profile ?? null);
  }, [profile]);

  const dailyConsumed = useMemo(() => sumEntriesToDailyConsumed(entries), [entries]);

  const motivationData = useMemo(() => {
    if (!goals) return null;
    const remaining = goals.calories - dailyConsumed.calories_consumed;
    const progress = Math.min(
      100,
      Math.round((dailyConsumed.calories_consumed / goals.calories) * 100)
    );
    return getMotivationMessage(remaining, progress);
  }, [goals, dailyConsumed]);

  const [showCarbsBar, setShowCarbsBar] = useState(true);
  const [showFatBar, setShowFatBar] = useState(true);
  const profileSynced = useRef(false);

  useEffect(() => {
    if (profile && !profileSynced.current) {
      profileSynced.current = true;
      setShowCarbsBar(profile.show_carbs_bar ?? true);
      setShowFatBar(profile.show_fat_bar ?? true);
    }
  }, [profile]);

  const toggleCarbsBar = useCallback(() => {
    setShowCarbsBar((prev) => {
      updateDisplaySettings({ show_carbs_bar: !prev });
      return !prev;
    });
  }, [updateDisplaySettings]);

  const toggleFatBar = useCallback(() => {
    setShowFatBar((prev) => {
      updateDisplaySettings({ show_fat_bar: !prev });
      return !prev;
    });
  }, [updateDisplaySettings]);

  if (!user) {
    return (
      <BackGround>
        <NotSignedInMessage />
      </BackGround>
    );
  }

  if (isProfileLoading || isEntriesLoading) {
    return (
      <BackGround>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.lime[500]} size="large" />
        </View>
      </BackGround>
    );
  }

  if (!goals) {
    return (
      <BackGround>
        <View className="flex-1 items-center justify-center px-5 gap-4">
          <Ionicons name="nutrition-outline" size={60} color={colors.background[400]} />
          <Text className="typo-h3 text-white text-center">אין מספיק נתונים</Text>
          <Text className="typo-body text-background-400 text-center">
            עדכן את פרטי הפרופיל שלך כדי לראות יעדי תזונה
          </Text>
          <Pressable
            onPress={() => router.navigate('/UserSetup')}
            className="mt-2 bg-lime-500 px-8 py-4 rounded-full"
            accessibilityRole="button"
            accessibilityLabel="עדכון פרופיל"
          >
            <Text className="typo-btn-cta text-black">עדכון פרופיל</Text>
          </Pressable>
        </View>
      </BackGround>
    );
  }

  const isOverCals = dailyConsumed.calories_consumed > goals.calories;
  const remainingCals = Math.max(0, goals.calories - dailyConsumed.calories_consumed);
  const overageCals = Math.max(0, dailyConsumed.calories_consumed - goals.calories);
  const remainingCarbs = Math.max(0, goals.carbs - Math.round(dailyConsumed.carbs_consumed));
  const remainingFat = Math.max(0, goals.fat - Math.round(dailyConsumed.fat_consumed));
  const remainingAccentColor = isOverCals ? colors.red[400] : colors.lime[500];

  return (
    <BackGround>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 180,
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="flex-1 w-full bg-background-950 rounded-md py-6 px-5 shadow-black shadow-md">
            <View className="mt-2 mb-8">
              <Text className="typo-h1 text-white mb-2 text-left">תזונה</Text>
              <View
                style={{
                  height: 5,
                  width: 60,
                  backgroundColor: colors.lime[500],
                  borderRadius: 10,
                  marginBottom: 16,
                }}
                className=""
              />
            </View>

            {motivationData && (() => {
              const motivationColor =
                motivationData.severity === 'danger'
                  ? colors.red[400]
                  : motivationData.severity === 'warning'
                    ? colors.orange[400]
                    : colors.lime[500];
              return (
                <View
                  className="rounded-3xl p-4 mb-4"
                  style={{
                    borderWidth: 1,
                    backgroundColor: motivationData.severity
                      ? toRgba(motivationColor, 0.08)
                      : 'rgba(255,255,255,0.03)',
                    borderColor: motivationData.severity
                      ? toRgba(motivationColor, 0.3)
                      : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Ionicons name={motivationData.icon} size={22} color={motivationColor} />
                    <Text className="typo-body-primary flex-1 text-left" style={{ color: motivationColor }}>
                      {motivationData.message}
                    </Text>
                  </View>
                </View>
              );
            })()}

            <View
              className="rounded-3xl px-3 py-2 mb-4"
              style={{
                borderWidth: 1,
                borderColor: toRgba(remainingAccentColor, 0.3),
                backgroundColor: toRgba(remainingAccentColor, 0.07),
              }}
            >
              <Text className="typo-label text-background-400 text-left">
                {isOverCals ? 'חרגת מהיעד' : 'נותר להיום'}
              </Text>

              <View className="items-center mb-4">
                <Text style={{ fontSize: 35, fontWeight: '700', color: remainingAccentColor, lineHeight: 40 }}>
                  {(isOverCals ? overageCals : remainingCals).toLocaleString('he-IL')}
                </Text>
                <Text className="typo-body text-background-400">
                  {isOverCals ? 'קק״ל מעל היעד' : 'קק״ל לסיום היעד'}
                </Text>
              </View>

              <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

              <View className="flex-row justify-around">
                <View className="items-center gap-1 ">
                  <Text className="typo-h3" style={{ color: colors.orange[400] }}>{remainingCarbs}g</Text>
                  <Text className="typo-caption text-background-400">פחמימות</Text>
                </View>
                <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.07)' }} />
                <View className="items-center gap-1">
                  <Text className="typo-h3" style={{ color: 'rgb(234, 179, 8)' }}>{remainingFat}g</Text>
                  <Text className="typo-caption text-background-400">שומנים</Text>
                </View>
              </View>
            </View>

            <ProgressStats
              label="קלוריות"
              consumed={dailyConsumed.calories_consumed}
              goal={goals.calories}
              unit="קק״ל"
              color={colors.lime[500]}
              iconName="flame-outline"
            />

            <MacroPieChart
              proteinConsumed={dailyConsumed.protein_consumed}
              proteinGoal={goals.protein}
            />

            {showCarbsBar && (
              <ProgressStats
                label="פחמימות"
                consumed={Math.round(dailyConsumed.carbs_consumed)}
                goal={goals.carbs}
                unit="ג׳"
                color={colors.orange[400]}
                iconName="nutrition-outline"
                onHide={toggleCarbsBar}
              />
            )}

            {showFatBar && (
              <ProgressStats
                label="שומנים"
                consumed={Math.round(dailyConsumed.fat_consumed)}
                goal={goals.fat}
                unit="ג׳"
                color={'rgb(234, 179, 8)'}
                iconName="water-outline"
                onHide={toggleFatBar}
              />
            )}

            {(!showCarbsBar || !showFatBar) && (
              <View className="flex-row items-center gap-2 py-2.5 px-4 mb-3 rounded-2xl border border-background-600 bg-background-800">
                <Ionicons name="eye-off-outline" size={14} color={colors.background[400]} />
                <Text className="typo-caption text-background-400 flex-1">ערכים מוסתרים:</Text>
                {!showCarbsBar && (
                  <Pressable
                    onPress={toggleCarbsBar}
                    className="flex-row items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: toRgba(colors.orange[400], 0.12), borderWidth: 1, borderColor: toRgba(colors.orange[400], 0.3) }}
                    accessibilityRole="button"
                    accessibilityLabel="הצג פחמימות"
                  >
                    <Ionicons name="eye-outline" size={13} color={colors.orange[400]} />
                    <Text className="typo-caption" style={{ color: colors.orange[400] }}>פחמימות</Text>
                  </Pressable>
                )}
                {!showFatBar && (
                  <Pressable
                    onPress={toggleFatBar}
                    className="flex-row items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(234,179,8,0.12)', borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)' }}
                    accessibilityRole="button"
                    accessibilityLabel="הצג שומנים"
                  >
                    <Ionicons name="eye-outline" size={13} color={'rgb(234, 179, 8)'} />
                    <Text className="typo-caption" style={{ color: 'rgb(234, 179, 8)' }}>שומנים</Text>
                  </Pressable>
                )}
              </View>
            )}

            <View className="bg-white/[0.03] rounded-3xl p-5 mb-4 border border-white/[0.05]">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="information-circle-outline" size={20} color={colors.lime[500]} />
                <Text className="typo-body-primary text-white">איך אנחנו מחשבים את היעדים?</Text>
              </View>
              <Text className="typo-label text-background-400 leading-6 text-left">
                • חלבון: מחושב על פי{' '}
                {(profile?.protein_per_kg ?? DEFAULT_PROTEIN_PER_KG).toFixed(1)} גרם/ק״ג × משקל (
                {profile?.weight} ק״ג){'\n'}• קלוריות: מחושבות לפי BMR × פעילות גופנית ± יעד
              </Text>
            </View>

            <NutritionEntriesList
              entries={entries}
              onDelete={deleteEntry}
              onDeleteGroup={deleteGroup}
              isDeleting={isDeleting}
              isDeletingGroup={isDeletingGroup}
            />
          </View>
        </ScrollView>
        <Animated.View
          pointerEvents={isButtonVisible ? 'auto' : 'none'}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 112,
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          }}
        >

          <ActionButton
            onPress={handleShowOptions}
            iconName="add-circle"
            label="הוספת מאכל או ארוחה"
            variant="primary"
            fullWidth
          />
            
        </Animated.View>
      </View>

      <AddOptionsSheet
        visible={showOptions}
        onClose={handleCloseOptions}
        onSelectFromList={handleSelectFromList}
        onAddNewFood={handleAddNewFood}
        onAddMeal={handleAddMeal}
        onCameraAI={handleCameraAI}
      />

      <CameraAIModal
        visible={showCameraModal}
        onClose={handleCloseCameraModal}
        userId={user?.id ?? ''}
        date={today}
      />

      <ModalAddFoods
        visible={isAddFoodOpen}
        onClose={closeAddFoodSheet}
        userId={user?.id ?? ''}
        date={today}
      />
    </BackGround>
  );
};

export default NutritionScreen;
