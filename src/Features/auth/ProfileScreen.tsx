import { colors } from '@/colors';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserWorkoutStats } from '@/src/hooks/useSession';
import { signOut } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { activityLevelOptions, genderOptions } from '@/src/types/profile';
import BackGround from '@/src/ui/BackGround';
import HoldButton from '@/src/ui/HoldButton';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { differenceInYears, isValid, parseISO } from 'date-fns';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { ReactNode, useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** --- פונקציות עזר --- **/
const getGenderLabel = (gender: string | null) =>
  genderOptions.find((o) => o.value === gender)?.label ?? '--';
const getActivityLabel = (level: string | null) =>
  activityLevelOptions.find((o) => o.value === level)?.label ?? '--';

const formatMinutes = (minutes: number): string => {
  if (minutes === 0) return '0 דק׳';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, '0')} שע׳` : `${minutes} דק׳`;
};

/** --- קומפוננטות UI משודרגות --- **/

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedCard = ({ children, delay = 0, className = '' }: AnimatedCardProps) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(300).damping(20)} className={className}>
    {children}
  </Animated.View>
);

const WorkoutStatItem = ({ icon, value, label }: any) => (
  <View className="items-center flex-1">
    <View className="bg-white/5 p-3 rounded-2xl mb-2 border border-white/5 shadow-inner">
      <Ionicons name={icon} size={20} color={colors.lime[500]} />
    </View>
    <Text className="typo-h3 text-white italic tracking-tighter">{value}</Text>
    <Text className="typo-caption-bold text-white/30 uppercase tracking-widest text-center mt-1">
      {label}
    </Text>
  </View>
);

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [animKey, setAnimKey] = useState(0);
  const [isPressingLogout, setIsPressingLogout] = useState(false);
  const { bottom: bottomInset, top: topInset } = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setAnimKey((k) => k + 1);
    }, [])
  );

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: workoutStats } = useUserWorkoutStats(user?.id);

  const handleLogout = useCallback(async () => {
    const { error } = await signOut();
    error ? triggerSuccess('שגיאה', 'failed') : triggerSuccess('התנתקת בהצלחה', 'success');
  }, [triggerSuccess]);

  if (!user)
    return (
      <BackGround>
        <NotSignedInMessage />
      </BackGround>
    );

  return (
    <BackGround>
      <ScrollView
        key={animKey}
        className="flex-1 mb-10 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomInset + 40 }}
      >
        {/* Header Section */}
        <View className="px-7" style={{ paddingTop: topInset + 20 }}>
          <View className="flex-row items-center gap-4">
            <Animated.View
              entering={FadeInDown.duration(300)}
              className="p-1 border-2 border-lime-500/30 rounded-full"
            >
              {profile?.avatar_url || user.user_metadata.avatar_url ? (
                <Image
                  source={profile?.avatar_url ?? user.user_metadata.avatar_url}
                  style={{ width: 64, height: 64, borderRadius: 32 }}
                  contentFit="cover"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-lime-500/10 items-center justify-center">
                  <Ionicons name="person" size={32} color={colors.lime[500]} />
                </View>
              )}
            </Animated.View>
            <View className="flex-1 items-start">
              <Animated.Text
                entering={FadeInDown.delay(80).duration(300).damping(20)}
                className="typo-label text-white/40 text-right italic"
              >
                MY PROFILE
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(160).duration(300).damping(20)}
                className="typo-h1 text-white text-right tracking-tight"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {profile?.full_name ?? user.user_metadata.full_name}
              </Animated.Text>
              <Animated.View
                entering={FadeInDown.delay(240).duration(300).damping(20)}
                className="mt-3 relative"
              >
                {/* Tooltip — מופיע רק בזמן לחיצה */}
                {isPressingLogout && (
                  <Animated.View
                    entering={FadeIn.duration(150)}
                    exiting={FadeOut.duration(150)}
                    className="absolute bottom-full mb-2 w-full flex justify-center items-center"
                  >
                    <View className="bg-zinc-800 border border-zinc-600 px-4 py-2 rounded-full flex-row items-center gap-2">
                      <MaterialCommunityIcons name="gesture-tap-hold" size={16} color="#ef4444" />
                      <Text className="typo-caption text-zinc-300">המשך להחזיק להתנתקות</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="triangle"
                      size={12}
                      color="#3f3f46"
                      style={{ transform: [{ rotate: '180deg' }] }}
                    />
                  </Animated.View>
                )}
                <View className="flex-row items-center bg-white/5 rounded-full border border-white/10 overflow-hidden">
                  <HoldButton
                    onPress={handleLogout}
                    onPressIn={() => setIsPressingLogout(true)}
                    onPressOut={() => setIsPressingLogout(false)}
                    holdDurationMs={1000}
                    fillVariant="darken"
                    fillColor="rgba(239,68,68,0.4)"
                    hapticOnComplete="error"
                    className="items-center justify-center px-5 h-[44px]"
                    accessibilityLabel="החזק להתנתקות"
                  >
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                      <Text className="typo-label text-red-400">התנתקות</Text>
                    </View>
                  </HoldButton>
                  <View className="w-[1px] h-5 bg-white/15" />
                  <Pressable
                    className="flex-row items-center justify-center gap-2 px-5 h-[44px]"
                    onPress={() => router.navigate('/UserSetup')}
                    accessibilityRole="button"
                    accessibilityLabel="הגדרות פרופיל"
                  >
                    <Ionicons name="settings-sharp" size={18} color="rgba(255,255,255,0.6)" />
                    <Text className="typo-label text-white/50">הגדרות</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          </View>
        </View>

        {isProfileLoading ? (
          <ActivityIndicator color={colors.lime[500]} style={{ marginTop: 100 }} />
        ) : (
          <View className="px-6 mt-10">
            {/* Workout Performance Grid */}
            <AnimatedCard
              delay={200}
              className="bg-background-800 border border-white/5 rounded-[35px] p-6 mb-6 overflow-hidden"
            >
              <View className="absolute -top-10 -left-10 w-32 h-32 bg-lime-500/5 rounded-full blur-3xl" />
              <View className="flex-row justify-between items-center">
                <WorkoutStatItem
                  icon="flash"
                  value={String(workoutStats?.weeklyCount ?? 0)}
                  label="WEEKLY"
                />
                <View className="w-[1px] h-12 bg-white/5" />
                <WorkoutStatItem
                  icon="time"
                  value={formatMinutes(workoutStats?.weeklyMinutes ?? 0)}
                  label="ACTIVE"
                />
                <View className="w-[1px] h-12 bg-white/5" />
                <WorkoutStatItem
                  icon="flame"
                  value={String(workoutStats?.streak ?? 0)}
                  label="STREAK"
                />
                <View className="w-[1px] h-12 bg-white/5" />
                <WorkoutStatItem
                  icon="trophy"
                  value={String(workoutStats?.totalCount ?? 0)}
                  label="TOTAL"
                />
              </View>
            </AnimatedCard>

            {/* Quick Stats Grid */}
            <View className="flex-row flex-wrap justify-between">
              {[
                { label: 'משקל', value: `${profile?.weight ?? '--'} ק״ג`, icon: 'speedometer' },
                { label: 'גובה', value: `${profile?.height ?? '--'} ס״מ`, icon: 'resize' },
                {
                  label: 'גיל',
                  value: (() => {
                    if (profile?.date_of_birth) {
                      const d = parseISO(profile.date_of_birth);
                      return isValid(d) ? differenceInYears(new Date(), d) : '--';
                    }
                    return profile?.age ?? '--';
                  })(),
                  icon: 'calendar',
                },
                { label: 'מין', value: getGenderLabel(profile?.gender ?? null), icon: 'person' },
              ].map((item, index) => (
                <AnimatedCard
                  key={index}
                  delay={300 + index * 100}
                  className="w-[48%] bg-background-800 border border-white/5 rounded-[28px] p-5 mb-4 items-start"
                >
                  <View className="bg-lime-500/10 self-start p-2 rounded-xl mb-3">
                    <Ionicons name={item.icon as any} size={16} color={colors.lime[500]} />
                  </View>
                  <Text className="typo-caption-bold text-white/30 uppercase tracking-tighter text-right">
                    {item.label}
                  </Text>
                  <Text className="typo-h3 text-white text-right mt-1">{item.value}</Text>
                </AnimatedCard>
              ))}
            </View>

            {/* Activity Level Card */}
            <AnimatedCard
              delay={700}
              className="bg-background-800 border border-white/5 rounded-[30px] px-2 py-4 mb-8 flex-row items-start gap-5"
            >
              <View className="bg-lime-500 p-3 rounded-2xl ml-4 shadow-lg shadow-lime-500/20 ">
                <Ionicons name="fitness" size={24} color="black" />
              </View>
              <View className="flex-1 items-start">
                <Text className="typo-caption-bold text-white/30 uppercase tracking-widest text-right">
                  Activity Level
                </Text>
                <Text className="typo-h4 text-white text-right leading-tight">
                  {getActivityLabel(profile?.activity_level ?? null)}
                </Text>
              </View>
            </AnimatedCard>
          </View>
        )}
      </ScrollView>
    </BackGround>
  );
}
