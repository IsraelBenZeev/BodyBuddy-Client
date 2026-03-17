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
import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import BackGround from '@/src/ui/BackGround';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { DEFAULT_PROTEIN_PER_KG } from '@/src/types/profile';
import {
  calculateNutritionGoals,
  getMotivationMessage,
  getTodayDate,
  sumEntriesToDailyConsumed,
} from '@/src/utils/calculateNutritionMetrics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
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

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: entries = [], isLoading: isEntriesLoading } = useNutritionEntries(user?.id, today);

  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteNutritionEntry(
    user?.id ?? '',
    today
  );
  const { mutate: deleteGroup, isPending: isDeletingGroup } =
    useDeleteNutritionEntriesByGroupId(user?.id ?? '', today);

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
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="nutrition-outline" size={60} color={colors.background[400]} />
          <Text className="text-white text-xl font-bold text-center mt-4">אין מספיק נתונים</Text>
          <Text className="text-background-400 text-center mt-2">
            עדכן את פרטי הפרופיל שלך כדי לראות יעדי תזונה
          </Text>
        </View>
      </BackGround>
    );
  }

  return (
    <BackGround>
      <View className="flex-1">
        <ScrollView className="flex-1 px-5 py-8" contentContainerStyle={{ paddingBottom: 180 }}>
          <Text className="text-white text-3xl font-black mb-2 text-right">תזונה</Text>
          <View style={{ height: 5, width: 60, backgroundColor: colors.lime[500], borderRadius: 10, alignSelf: 'flex-end', marginBottom: 16 }} />

          {motivationData && (
            <View className="flex-row-reverse items-center justify-center gap-2 bg-lime-500/10 border border-lime-500/30 rounded-2xl p-4 mb-6">
              <Ionicons name={motivationData.icon} size={24} color={colors.lime[500]} />
              <Text className="text-lime-400 font-bold flex-1 text-right">
                {motivationData.message}
              </Text>
            </View>
          )}

          <ProgressStats
            label="קלוריות"
            consumed={dailyConsumed.calories_consumed}
            goal={goals.calories}
            unit="קק״ל"
            color={colors.white}
            iconName="flame-outline"
          />

          <MacroPieChart
            proteinConsumed={dailyConsumed.protein_consumed}
            proteinGoal={goals.protein}
          />

          <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
            <View className="flex-row-reverse items-center justify-between mb-3">
              <Text className="text-white text-base font-bold">איך אנחנו מחשבים את היעדים?</Text>
              <Ionicons name="information-circle-outline" size={20} color={colors.lime[500]} />
            </View>
            <Text className="text-background-400 text-sm text-right leading-6">
              • חלבון: מחושב על פי {(profile?.protein_per_kg ?? DEFAULT_PROTEIN_PER_KG).toFixed(1)} גרם/ק״ג × משקל ({profile?.weight} ק״ג){'\n'}• קלוריות: מחושבות לפי BMR × פעילות גופנית ± יעד
            </Text>
          </View>

          <NutritionEntriesList
            entries={entries}
            onDelete={deleteEntry}
            onDeleteGroup={deleteGroup}
            isDeleting={isDeleting}
            isDeletingGroup={isDeletingGroup}
          />

        </ScrollView>

        <Pressable
          onPress={handleShowOptions}
          className="absolute left-5 right-5 flex-row items-center justify-center gap-2 rounded-full bg-lime-500 py-4 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="הוספת מאכל או ארוחה"
          style={{
            bottom: 90,
            shadowColor: colors.lime[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.45,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <Ionicons name="add-circle" size={26} color={colors.background[900]} />
          <Text className="text-background-900 font-bold text-base">הוספת מאכל או ארוחה</Text>
        </Pressable>
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
