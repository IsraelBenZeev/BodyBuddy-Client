import { colors } from '@/colors';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserWorkoutStats } from '@/src/hooks/useSession';
import { signOut } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { activityLevelOptions, genderOptions } from '@/src/types/profile';
import ActionButton from '@/src/ui/ActionButton';
import BackGround from '@/src/ui/BackGround';
import BodyBuddyLogo from '@/src/ui/BodyBuddyLogo';
import HoldButton from '@/src/ui/HoldButton';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { differenceInYears, isValid, parseISO } from 'date-fns';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { ReactNode, useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

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
    <Text className="typo-h3 text-white tracking-tighter">{value}</Text>
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
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [logoPreviewKey, setLogoPreviewKey] = useState(0);

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

  const handleShowLogoPreview = useCallback(() => {
    setLogoPreviewKey((k) => k + 1);
    setShowLogoPreview(true);
  }, []);

  const handleCloseLogoPreview = useCallback(() => {
    setShowLogoPreview(false);
  }, []);

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
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <View className="px-7" style={{ paddingTop: 20 }}>
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
                className="typo-label text-white/40 text-right"
              >
                הפרופיל שלי
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

          {/* כפתור זמני לבדיקת הלוגו — Preview בלי לצאת/לרענן את המסך */}
          {/* <View className="mt-4 items-start">
            <ActionButton
              onPress={handleShowLogoPreview}
              label="בדיקת לוגו"
              iconName="shapes-outline"
              variant="secondary"
              size="sm"
              accessibilityLabel="הצג תצוגה מקדימה של הלוגו"
              accessibilityHint="פותח מסך שקוף עם אנימציית הלוגו של BodyBuddy"
            />
          </View> */}
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
                  label="שבועי"
                />
                <View className="w-[1px] h-12 bg-white/5" />
                <WorkoutStatItem
                  icon="time"
                  value={formatMinutes(workoutStats?.weeklyMinutes ?? 0)}
                  label="פעיל"
                />
                <View className="w-[1px] h-12 bg-white/5" />
                <WorkoutStatItem
                  icon="flame"
                  value={String(workoutStats?.streak ?? 0)}
                  label="רצף"
                />
                <View className="w-[1px] h-12 bg-white/5" />
                <WorkoutStatItem
                  icon="trophy"
                  value={String(workoutStats?.totalCount ?? 0)}
                  label="סה״כ"
                />
              </View>
            </AnimatedCard>

            {/* Quick Stats Grid */}
            <View className="flex-row flex-wrap justify-between">
              {[
                {
                  label: 'משקל',
                  value: `${profile?.weight ?? '--'} ק״ג`,
                  icon: 'speedometer',
                  lib: 'ion' as const,
                },
                {
                  label: 'גובה',
                  value: `${profile?.height ?? '--'} ס״מ`,
                  icon: 'human-male-height',
                  lib: 'mci' as const,
                },
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
                  lib: 'ion' as const,
                },
                {
                  label: 'מגדר',
                  value: getGenderLabel(profile?.gender ?? null),
                  icon: 'person',
                  lib: 'ion' as const,
                },
              ].map((item, index) => (
                <AnimatedCard
                  key={index}
                  delay={300 + index * 100}
                  className="w-[48%] bg-background-800 border border-white/5 rounded-[28px] p-5 mb-4 items-start"
                >
                  <View className="bg-lime-500/10 self-start p-2 rounded-xl mb-3">
                    {item.lib === 'mci' ? (
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={16}
                        color={colors.lime[500]}
                      />
                    ) : (
                      <Ionicons name={item.icon as any} size={16} color={colors.lime[500]} />
                    )}
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
                  רמת פעילות
                </Text>
                <Text className="typo-h4 text-white text-right leading-tight">
                  {getActivityLabel(profile?.activity_level ?? null)}
                </Text>
              </View>
            </AnimatedCard>
          </View>
        )}
        <View className="mb-8 px-6 space-y-4 items-start">
          {/* מידע על הנוסחה - בולט פחות מהמשפטי */}
          {/* הפרדה ויזואלית קטנה */}
          <View className="border-t border-background-800 my-2 w-1/4 self-center opacity-30" />

          {/* מדיניות פרטיות */}
          <Text className="typo-label text-background-400">
            {'בהמשך השימוש הינך מסכים ל'}
            <Text
              onPress={() =>
                Linking.openURL('https://israelbenzeev.github.io/BodyBuddu-Privacy-Policy/')
              }
              className="text-lime-400 font-semibold"
            >
              {'מדיניות הפרטיות'}
            </Text>
          </Text>

          {/* תמיכה */}
          <Text className="typo-label text-background-400">
            {'נתקלת בבעיה? '}
            <Text
              onPress={() => Linking.openURL('mailto:bodybuddysupport@gmail.com')}
              className="text-lime-400 font-semibold"
            >
              {'צרו קשר עם התמיכה שלנו'}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {showLogoPreview && (
        <Pressable
          className="absolute inset-0 items-center justify-center bg-black/85"
          onPress={handleCloseLogoPreview}
          accessibilityRole="button"
          accessibilityLabel="סגור תצוגת לוגו"
          accessibilityHint="לחץ בכל מקום כדי לסגור"
        >
          <BodyBuddyLogo key={logoPreviewKey} width={220} height={255} />
          <Text className="typo-label text-background-400 mt-8">לחץ בכל מקום כדי לסגור</Text>
        </Pressable>
      )}
    </BackGround>
  );
}
