import { colors } from '@/colors';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserWorkoutStats } from '@/src/hooks/useSession';
import { signOut } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import {
  activityLevelOptions,
  DEFAULT_PROTEIN_PER_KG,
  genderOptions,
  getOffsetIntensity,
  Goal,
  goalOptions,
} from '@/src/types/profile';
import BackGround from '@/src/ui/BackGround';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { calculateDailyCalories } from '@/src/utils/calculateMetrics';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** --- פונקציות עזר למיפוי ערכים --- **/

const getGenderLabel = (gender: string | null): string => {
  if (!gender) return '--';
  return genderOptions.find((o) => o.value === gender)?.label ?? gender;
};

const getActivityLabel = (level: string | null): string => {
  if (!level) return '--';
  return activityLevelOptions.find((o) => o.value === level)?.label ?? level;
};

const getGoalLabel = (goal: string | null): string => {
  if (!goal) return '--';
  return goalOptions.find((o) => o.value === goal)?.label ?? goal;
};

/** --- קומפוננטת עזר לכרטיסי הנתונים --- **/

const StatBox = ({
  title,
  value,
  icon,
  fullWidth,
}: {
  title: string;
  value: string;
  icon: string;
  fullWidth?: boolean;
}) => (
  <View
    className={`${fullWidth ? 'w-full' : 'w-[48%]'} bg-background-800 border border-white/5 rounded-[30px] p-5 mb-4 items-end shadow-sm`}
  >
    <View className="bg-background-700 p-2 rounded-xl mb-3 border border-white/5">
        <Ionicons name={icon as any} size={18} color={colors.lime[500]} />
    </View>
    <Text className="text-white/40 text-[10px] font-bold uppercase mb-1 tracking-wider">{title}</Text>
    <Text className="text-white text-xl font-black">{value}</Text>
  </View>
);

const formatMinutes = (minutes: number): string => {
  if (minutes === 0) return '0 דק׳';
  if (minutes < 60) return `${minutes} דק׳`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}:${String(m).padStart(2, '0')} שע׳` : `${h} שע׳`;
};

const WorkoutStatItem = ({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) => (
  <View className="items-center flex-1 px-1">
    <View className="bg-background-700 p-3 rounded-2xl mb-3 border border-white/5">
      <Ionicons name={icon as any} size={22} color={colors.lime[500]} />
    </View>
    <Text className="text-white text-2xl font-black">{value}</Text>
    <Text className="text-white/30 text-[10px] font-bold text-center mt-1">{label}</Text>
  </View>
);

/** --- מסך הפרופיל המרכזי --- **/

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [loading, setLoading] = useState(false);
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: workoutStats, isLoading: isStatsLoading } = useUserWorkoutStats(user?.id);

  const dailyCalories = useMemo(() => {
    if (!profile) return null;
    return calculateDailyCalories(
      profile.gender,
      profile.weight,
      profile.height,
      profile.age,
      profile.activity_level,
      profile.goal,
      profile.calorie_offset,
    );
  }, [profile]);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    const { error } = await signOut();
    setLoading(false);

    if (error) {
      triggerSuccess('שגיאה בהתנתקות', 'failed');
    } else {
      triggerSuccess('התנתקת בהצלחה', 'success');
    }
  }, [triggerSuccess]);

  if (!user) {
    return (
      <BackGround>
        <NotSignedInMessage />
      </BackGround>
    );
  }

  return (
    <BackGround>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 + bottomInset + 20 }}
      >

        {/* Header Section */}
        <View className="px-6 pt-12 pb-8">
          <View className="flex-row-reverse items-center justify-start gap-4">
            <View className="overflow-hidden rounded-full">
              <Image
                source={profile?.avatar_url ?? user.user_metadata.avatar_url}
                style={{ width: 56, height: 56 }}
                contentFit="cover"
              />
            </View>
            <View>
              <Text className="text-white/60 text-lg font-medium text-right">הפרופיל שלי,</Text>
              <Text className="text-white text-3xl font-black text-right tracking-tighter">
                {profile?.full_name ?? (user?.user_metadata?.full_name as string) ?? user?.email}
              </Text>
              <Text className="text-white/30 text-xs text-right mt-1">{user?.email ?? ''}</Text>
            </View>
          </View>
        </View>

        {isProfileLoading ? (
          <View className="items-center py-20">
            <ActivityIndicator color={colors.lime[500]} size="large" />
          </View>
        ) : (
          <>
            {/* Compact Calorie Row */}
            {dailyCalories && (
              <View className="mx-6 mb-6 bg-background-800 border border-white/5 rounded-2xl px-5 py-3 flex-row-reverse justify-between items-center">
                <View className="flex-row-reverse items-center gap-1.5">
                  <Ionicons name="flash" size={14} color={colors.lime[500]} />
                  <Text className="text-white/50 text-xs font-bold">יעד קלורי יומי</Text>
                </View>
                <View className="flex-row-reverse items-center gap-2">
                  <Text className="text-lime-400 font-black text-base">
                    {dailyCalories.toLocaleString()} קק״ל
                  </Text>
                  {profile?.goal && (
                    <Text className="text-white/25 text-xs">• {getGoalLabel(profile.goal)}</Text>
                  )}
                </View>
              </View>
            )}

            {/* Workout Stats Card */}
            <View className="px-6 mb-6">
              <View className="bg-background-800 border border-white/5 rounded-[30px] p-6">
                <View className="flex-row-reverse justify-between">
                  <WorkoutStatItem
                    icon="barbell-outline"
                    value={isStatsLoading ? '...' : String(workoutStats?.weeklyCount ?? 0)}
                    label="אימונים השבוע"
                  />
                  <WorkoutStatItem
                    icon="time-outline"
                    value={isStatsLoading ? '...' : formatMinutes(workoutStats?.weeklyMinutes ?? 0)}
                    label="זמן השבוע"
                  />
                  <WorkoutStatItem
                    icon="flame-outline"
                    value={isStatsLoading ? '...' : `${workoutStats?.streak ?? 0}`}
                    label="רצף שבועות"
                  />
                  <WorkoutStatItem
                    icon="trophy-outline"
                    value={isStatsLoading ? '...' : String(workoutStats?.totalCount ?? 0)}
                    label='סה"כ אימונים'
                  />
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View className="px-6 flex-row-reverse flex-wrap justify-between">
              <View className="w-[48%] mb-4">
                <StatBox
                  fullWidth
                  title="משקל"
                  value={profile?.weight ? `${profile.weight} ק״ג` : '--'}
                  icon="speedometer-outline"
                />
                <View className="bg-background-800/80 border border-white/5 rounded-xl px-3 py-2 mr-1 -mt-2 items-end">
                  <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider">יחס לחלבון</Text>
                  <Text className="text-lime-400/90 text-sm font-bold">
                    {(profile?.protein_per_kg ?? DEFAULT_PROTEIN_PER_KG).toFixed(1)} גרם/ק״ג
                  </Text>
                </View>
              </View>
              <StatBox title="גובה" value={profile?.height ? `${profile.height} ס״מ` : '--'} icon="resize-outline" />
              <StatBox title="גיל" value={profile?.age ? `${profile.age}` : '--'} icon="calendar-outline" />
              <StatBox title="מין" value={getGenderLabel(profile?.gender ?? null)} icon="person-outline" />
            </View>

            {/* Activity Row */}
            <View className="px-6 mb-8">
              <View className="bg-background-800 border border-white/5 rounded-[30px] p-6 flex-row-reverse items-center">
                <View className="bg-background-700 w-12 h-12 rounded-2xl items-center justify-center ml-4 border border-white/5">
                  <Ionicons name="fitness-outline" size={24} color={colors.lime[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-white/40 text-[10px] font-bold uppercase text-right mb-1">רמת פעילות גופנית</Text>
                  <Text className="text-white text-lg font-bold text-right leading-tight">{getActivityLabel(profile?.activity_level ?? null)}</Text>
                </View>
              </View>
            </View>

            {/* Buttons Section */}
            <View className="px-6 space-y-4">
              <Pressable
                onPress={() => router.push('/UserSetup')}
                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                className="bg-lime-500 h-16 rounded-[24px] flex-row-reverse items-center justify-center shadow-md"
              >
                <Ionicons name="create" size={20} color="black" />
                <Text className="text-black font-black text-lg mr-2">עריכת פרטים</Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                className="h-16 rounded-[24px] flex-row-reverse items-center justify-center border border-white/10 mt-2"
              >
                <Text className="text-red-500 font-bold text-base">
                  {loading ? 'מתנתק...' : 'התנתקות מהחשבון'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </BackGround>
  );
}
