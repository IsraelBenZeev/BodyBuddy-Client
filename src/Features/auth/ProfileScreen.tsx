import { colors } from '@/colors';
import { useProfile } from '@/src/hooks/useProfile';
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
import { LinearGradient } from 'expo-linear-gradient';

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
  icon: any;
  fullWidth?: boolean;
}) => (
  <View
    className={`${fullWidth ? 'w-full' : 'w-[48%]'} bg-background-800 border border-white/5 rounded-[30px] p-5 mb-4 items-end shadow-sm`}
  >
    <View className="bg-background-700 p-2 rounded-xl mb-3 border border-white/5">
        <Ionicons name={icon} size={18} color={colors.lime[500]} />
    </View>
    <Text className="text-white/40 text-[10px] font-bold uppercase mb-1 tracking-wider">{title}</Text>
    <Text className="text-white text-xl font-black">{value}</Text>
  </View>
);

/** --- מסך הפרופיל המרכזי --- **/

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [loading, setLoading] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);

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

  const offsetIntensity = useMemo(() => {
    if (!profile?.goal || profile.goal === 'maintain' || profile.calorie_offset == null) {
      return null;
    }
    return getOffsetIntensity(profile.calorie_offset, profile.goal as Goal);
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
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        
        {/* Header Section */}
        <View className="px-6 pt-12 pb-8">
          <View className="flex-row-reverse items-center justify-start gap-4">
          <View className="overflow-hidden rounded-full border border-white/10">
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
            {/* Main Calories Card - Gradient */}
            <View className="px-6 mb-8">
              <LinearGradient
                colors={[colors.lime[300], colors.lime[500], colors.lime[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]}
                style={{ borderRadius: 40, padding: 28, shadowColor: colors.lime[500], shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 }}
              >
                <View className="flex-row-reverse justify-between items-center mb-5">
                  <Text className="text-black/90 font-black text-lg">יעד קלורי יומי</Text>
                  <View className="bg-black/15 p-2.5 rounded-full">
                    <Ionicons name="flash" size={22} color="rgba(0,0,0,0.85)" />
                  </View>
                </View>

                <View className="items-center py-2 mb-4">
                  <Text className="text-black text-6xl font-black tracking-tighter">
                    {dailyCalories?.toLocaleString() ?? '--'}
                  </Text>
                  <Text className="text-black/70 font-bold uppercase tracking-widest text-[10px] mt-2">
                    קלוריות מומלצות ליום
                  </Text>
                </View>

                <View className="bg-black/12 h-px w-full mb-5" />

                <View className="flex-row-reverse justify-between">
                  <View className="items-end">
                    <Text className="text-black/50 text-[10px] font-bold uppercase mb-1">המטרה</Text>
                    <Text className="text-black font-black text-base">{getGoalLabel(profile?.goal ?? null)}</Text>
                  </View>
                  <View className="items-start">
                    <Text className="text-black/50 text-[10px] font-bold uppercase mb-1">סטטוס יעד</Text>
                    <Text className="text-black font-black text-base" style={{ color: offsetIntensity?.color ?? 'rgba(0,0,0,0.9)' }}>
                      {offsetIntensity?.tag ?? 'מאוזן'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
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