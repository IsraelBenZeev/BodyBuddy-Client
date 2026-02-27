import { colors } from '@/colors';
import ModalAddFoods from '@/src/Features/nutrition/add/ModalAddFoods';
import NutritionEntriesList from '@/src/Features/nutrition/review/NutritionEntriesList';
import ProgressStats from '@/src/Features/nutrition/review/ProgressStats';
import MacroPieChart from '@/src/Features/nutrition/review/MacroPieChart';
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
  calculateMacroSplit,
  calculateNutritionGoals,
  getMotivationMessage,
  getTodayDate,
  sumEntriesToDailyConsumed,
} from '@/src/utils/calculateNutritionMetrics';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
const NutritionScreen = () => {
  const user = useAuthStore((state) => state.user);
  const today = getTodayDate();
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);

  const openAddFoodSheet = useCallback(() => {
    setIsAddFoodOpen(true);
  }, []);

  const closeAddFoodSheet = useCallback(() => {
    setIsAddFoodOpen(false);
  }, []);

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

  const macroSplit = useMemo(() => {
    return calculateMacroSplit(
      dailyConsumed.protein_consumed,
      dailyConsumed.carbs_consumed,
      dailyConsumed.fat_consumed
    );
  }, [dailyConsumed]);

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
        <ScrollView className="flex-1 px-5 py-8">
          <Text className="text-white text-3xl font-black mb-2 text-right">תזונה</Text>

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

          <ProgressStats
            label="חלבון"
            consumed={dailyConsumed.protein_consumed}
            goal={goals.protein}
            unit="גרם"
            color={colors.lime[500]}
            iconName="barbell-outline"
          />

          <ProgressStats
            label="פחמימות"
            consumed={dailyConsumed.carbs_consumed}
            goal={goals.carbs}
            unit="גרם"
            color={colors.orange[500]}
            iconName="pizza-outline"
          />

          <ProgressStats
            label="שומן"
            consumed={dailyConsumed.fat_consumed}
            goal={goals.fat}
            unit="גרם"
            color={colors.red[500]}
            iconName="water-outline"
          />

          <MacroPieChart
            macroSplit={macroSplit}
            caloriesConsumed={dailyConsumed.calories_consumed}
            caloriesGoal={goals?.calories}
          />

          <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
            <View className="flex-row-reverse items-center justify-between mb-3">
              <Text className="text-white text-base font-bold">איך אנחנו מחשבים את היעדים?</Text>
              <Ionicons name="information-circle-outline" size={20} color={colors.lime[500]} />
            </View>
            <Text className="text-background-400 text-sm text-right leading-6">
              • חלבון: מחושב על פי {(profile?.protein_per_kg ?? DEFAULT_PROTEIN_PER_KG).toFixed(1)} גרם/ק״ג × משקל ({profile?.weight} ק״ג){'\n'}• שומן: 25% מהקלוריות היומיות{'\n'}•
              פחמימות: שאר הקלוריות
            </Text>
          </View>

          <NutritionEntriesList
            entries={entries}
            onDelete={deleteEntry}
            onDeleteGroup={deleteGroup}
            isDeleting={isDeleting}
            isDeletingGroup={isDeletingGroup}
          />

          <View className="pb-24" />
        </ScrollView>

        <Pressable
          onPress={openAddFoodSheet}
          className="absolute bottom-6 left-5 flex-row items-center gap-2 rounded-full bg-lime-500 pl-4 pr-5 py-3 border border-lime-400/40 active:opacity-90"
          style={{
            shadowColor: colors.lime[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add-circle" size={28} color={colors.background[900]} />
          <Text className="text-background-900 font-bold text-base">הוספת מאכל או ארוחה</Text>
        </Pressable>
      </View>

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
