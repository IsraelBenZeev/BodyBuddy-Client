// import { colors } from '@/colors';
// import { useProfile } from '@/src/hooks/useProfile';
// import { useUserWorkoutStats } from '@/src/hooks/useSession';
// import { signOut } from '@/src/service/authService';
// import { useAuthStore } from '@/src/store/useAuthStore';
// import { useUIStore } from '@/src/store/useUIStore';
// import {
//   activityLevelOptions,
//   DEFAULT_PROTEIN_PER_KG,
//   genderOptions,
//   getOffsetIntensity,
//   Goal,
//   goalOptions,
// } from '@/src/types/profile';
// import BackGround from '@/src/ui/BackGround';
// import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
// import { calculateDailyCalories } from '@/src/utils/calculateMetrics';
// import { Ionicons } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { router } from 'expo-router';
// import { useCallback, useMemo, useState } from 'react';
// import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// /** --- פונקציות עזר למיפוי ערכים --- **/

// const getGenderLabel = (gender: string | null): string => {
//   if (!gender) return '--';
//   return genderOptions.find((o) => o.value === gender)?.label ?? gender;
// };

// const getActivityLabel = (level: string | null): string => {
//   if (!level) return '--';
//   return activityLevelOptions.find((o) => o.value === level)?.label ?? level;
// };

// const getGoalLabel = (goal: string | null): string => {
//   if (!goal) return '--';
//   return goalOptions.find((o) => o.value === goal)?.label ?? goal;
// };

// /** --- קומפוננטת עזר לכרטיסי הנתונים --- **/

// const StatBox = ({
//   title,
//   value,
//   icon,
//   fullWidth,
// }: {
//   title: string;
//   value: string;
//   icon: string;
//   fullWidth?: boolean;
// }) => (
//   <View
//     className={`${fullWidth ? 'w-full' : 'w-[48%]'} bg-background-800 border border-white/5 rounded-[30px] p-5 mb-4 items-end shadow-sm`}
//   >
//     <View className="bg-background-700 p-2 rounded-xl mb-3 border border-white/5">
//         <Ionicons name={icon as any} size={18} color={colors.lime[500]} />
//     </View>
//     <Text className="text-white/40 text-[10px] font-bold uppercase mb-1 tracking-wider">{title}</Text>
//     <Text className="text-white text-xl font-black">{value}</Text>
//   </View>
// );

// const formatMinutes = (minutes: number): string => {
//   if (minutes === 0) return '0 דק׳';
//   if (minutes < 60) return `${minutes} דק׳`;
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   return m > 0 ? `${h}:${String(m).padStart(2, '0')} שע׳` : `${h} שע׳`;
// };

// const WorkoutStatItem = ({
//   icon,
//   value,
//   label,
// }: {
//   icon: string;
//   value: string;
//   label: string;
// }) => (
//   <View className="items-center flex-1 px-1">
//     <View className="bg-background-700 p-3 rounded-2xl mb-3 border border-white/5">
//       <Ionicons name={icon as any} size={22} color={colors.lime[500]} />
//     </View>
//     <Text className="text-white text-2xl font-black">{value}</Text>
//     <Text className="text-white/30 text-[10px] font-bold text-center mt-1">{label}</Text>
//   </View>
// );

// /** --- מסך הפרופיל המרכזי --- **/

// export default function ProfileScreen() {
//   const user = useAuthStore((state) => state.user);
//   const triggerSuccess = useUIStore((state) => state.triggerSuccess);
//   const [loading, setLoading] = useState(false);
//   const { bottom: bottomInset } = useSafeAreaInsets();

//   const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
//   const { data: workoutStats, isLoading: isStatsLoading } = useUserWorkoutStats(user?.id);

//   const dailyCalories = useMemo(() => {
//     if (!profile) return null;
//     return calculateDailyCalories(
//       profile.gender,
//       profile.weight,
//       profile.height,
//       profile.age,
//       profile.activity_level,
//       profile.goal,
//       profile.calorie_offset,
//     );
//   }, [profile]);

//   const handleLogout = useCallback(async () => {
//     setLoading(true);
//     const { error } = await signOut();
//     setLoading(false);

//     if (error) {
//       triggerSuccess('שגיאה בהתנתקות', 'failed');
//     } else {
//       triggerSuccess('התנתקת בהצלחה', 'success');
//     }
//   }, [triggerSuccess]);

//   if (!user) {
//     return (
//       <BackGround>
//         <NotSignedInMessage />
//       </BackGround>
//     );
//   }

//   return (
//     <BackGround>
//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 60 + bottomInset + 20 }}
//       >

//         {/* Header Section */}
//         <View className="px-6 pt-12 pb-8">
//           <View className="flex-row-reverse items-center justify-start gap-4">
//             <View className="overflow-hidden rounded-full">
//               <Image
//                 source={profile?.avatar_url ?? user.user_metadata.avatar_url}
//                 style={{ width: 56, height: 56 }}
//                 contentFit="cover"
//               />
//             </View>
//             <View>
//               <Text className="text-white/60 text-lg font-medium text-right">הפרופיל שלי,</Text>
//               <Text className="text-white text-3xl font-black text-right tracking-tighter">
//                 {profile?.full_name ?? (user?.user_metadata?.full_name as string) ?? user?.email}
//               </Text>
//               <Text className="text-white/30 text-xs text-right mt-1">{user?.email ?? ''}</Text>
//             </View>
//           </View>
//         </View>

//         {isProfileLoading ? (
//           <View className="items-center py-20">
//             <ActivityIndicator color={colors.lime[500]} size="large" />
//           </View>
//         ) : (
//           <>
//             {/* Compact Calorie Row */}
//             {dailyCalories && (
//               <View className="mx-6 mb-6 bg-background-800 border border-white/5 rounded-2xl px-5 py-3 flex-row-reverse justify-between items-center">
//                 <View className="flex-row-reverse items-center gap-1.5">
//                   <Ionicons name="flash" size={14} color={colors.lime[500]} />
//                   <Text className="text-white/50 text-xs font-bold">יעד קלורי יומי</Text>
//                 </View>
//                 <View className="flex-row-reverse items-center gap-2">
//                   <Text className="text-lime-400 font-black text-base">
//                     {dailyCalories.toLocaleString()} קק״ל
//                   </Text>
//                   {profile?.goal && (
//                     <Text className="text-white/25 text-xs">• {getGoalLabel(profile.goal)}</Text>
//                   )}
//                 </View>
//               </View>
//             )}

//             {/* Workout Stats Card */}
//             <View className="px-6 mb-6">
//               <View className="bg-background-800 border border-white/5 rounded-[30px] p-6">
//                 <View className="flex-row-reverse justify-between">
//                   <WorkoutStatItem
//                     icon="barbell-outline"
//                     value={isStatsLoading ? '...' : String(workoutStats?.weeklyCount ?? 0)}
//                     label="אימונים השבוע"
//                   />
//                   <WorkoutStatItem
//                     icon="time-outline"
//                     value={isStatsLoading ? '...' : formatMinutes(workoutStats?.weeklyMinutes ?? 0)}
//                     label="זמן השבוע"
//                   />
//                   <WorkoutStatItem
//                     icon="flame-outline"
//                     value={isStatsLoading ? '...' : `${workoutStats?.streak ?? 0}`}
//                     label="רצף שבועות"
//                   />
//                   <WorkoutStatItem
//                     icon="trophy-outline"
//                     value={isStatsLoading ? '...' : String(workoutStats?.totalCount ?? 0)}
//                     label='סה"כ אימונים'
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Stats Grid */}
//             <View className="px-6 flex-row-reverse flex-wrap justify-between">
//               <View className="w-[48%] mb-4">
//                 <StatBox
//                   fullWidth
//                   title="משקל"
//                   value={profile?.weight ? `${profile.weight} ק״ג` : '--'}
//                   icon="speedometer-outline"
//                 />
//                 <View className="bg-background-800/80 border border-white/5 rounded-xl px-3 py-2 mr-1 -mt-2 items-end">
//                   <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider">יחס לחלבון</Text>
//                   <Text className="text-lime-400/90 text-sm font-bold">
//                     {(profile?.protein_per_kg ?? DEFAULT_PROTEIN_PER_KG).toFixed(1)} גרם/ק״ג
//                   </Text>
//                 </View>
//               </View>
//               <StatBox title="גובה" value={profile?.height ? `${profile.height} ס״מ` : '--'} icon="resize-outline" />
//               <StatBox title="גיל" value={profile?.age ? `${profile.age}` : '--'} icon="calendar-outline" />
//               <StatBox title="מין" value={getGenderLabel(profile?.gender ?? null)} icon="person-outline" />
//             </View>

//             {/* Activity Row */}
//             <View className="px-6 mb-8">
//               <View className="bg-background-800 border border-white/5 rounded-[30px] p-6 flex-row-reverse items-center">
//                 <View className="bg-background-700 w-12 h-12 rounded-2xl items-center justify-center ml-4 border border-white/5">
//                   <Ionicons name="fitness-outline" size={24} color={colors.lime[500]} />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="text-white/40 text-[10px] font-bold uppercase text-right mb-1">רמת פעילות גופנית</Text>
//                   <Text className="text-white text-lg font-bold text-right leading-tight">{getActivityLabel(profile?.activity_level ?? null)}</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Buttons Section */}
//             <View className="px-6 space-y-4">
//               <Pressable
//                 onPress={() => router.navigate('/UserSetup')}
//                 style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
//                 className="bg-lime-500 h-16 rounded-[24px] flex-row-reverse items-center justify-center shadow-md"
//                 accessibilityRole="button"
//                 accessibilityLabel="עריכת פרטים"
//               >
//                 <Ionicons name="create" size={20} color="black" />
//                 <Text className="text-black font-black text-lg mr-2">עריכת פרטים</Text>
//               </Pressable>

//               <Pressable
//                 onPress={handleLogout}
//                 style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
//                 className="h-16 rounded-[24px] flex-row-reverse items-center justify-center border border-white/10 mt-2"
//                 accessibilityRole="button"
//                 accessibilityLabel="התנתקות מהחשבון"
//               >
//                 <Text className="text-red-500 font-bold text-base">
//                   {loading ? 'מתנתק...' : 'התנתקות מהחשבון'}
//                 </Text>
//               </Pressable>
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </BackGround>
//   );
// }
import { colors } from '@/colors';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserWorkoutStats } from '@/src/hooks/useSession';
import { signOut } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { activityLevelOptions, genderOptions } from '@/src/types/profile';
import { differenceInYears, isValid, parseISO } from 'date-fns';
import HoldButton from '@/src/ui/HoldButton';
import BackGround from '@/src/ui/BackGround';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState, ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

/** --- פונקציות עזר --- **/
const getGenderLabel = (gender: string | null) => genderOptions.find((o) => o.value === gender)?.label ?? '--';
const getActivityLabel = (level: string | null) => activityLevelOptions.find((o) => o.value === level)?.label ?? '--';

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
  <Animated.View
    entering={FadeInDown.delay(delay).duration(300).damping(20)}
    className={className}
  >
    {children}
  </Animated.View>
);

const WorkoutStatItem = ({ icon, value, label }: any) => (
  <View className="items-center flex-1">
    <View className="bg-white/5 p-3 rounded-2xl mb-2 border border-white/5 shadow-inner">
      <Ionicons name={icon} size={20} color={colors.lime[500]} />
    </View>
    <Text className="typo-h3 text-white italic tracking-tighter">{value}</Text>
    <Text className="typo-caption-bold text-white/30 uppercase tracking-widest text-center mt-1">{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { bottom: bottomInset, top: topInset } = useSafeAreaInsets();

  useFocusEffect(useCallback(() => { setAnimKey(k => k + 1); }, []));

  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: workoutStats, isLoading: isStatsLoading } = useUserWorkoutStats(user?.id);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    const { error } = await signOut();
    setLoading(false);
    error ? triggerSuccess('שגיאה', 'failed') : triggerSuccess('התנתקת בהצלחה', 'success');
  }, [triggerSuccess]);

  if (!user) return <BackGround><NotSignedInMessage /></BackGround>;

  return (
    <BackGround>
      <ScrollView
        key={animKey}
        className="flex-1 mb-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomInset + 40 }}
      >
        {/* Header Section */}
        <View className="px-7" style={{ paddingTop: topInset + 20 }}>
          <View className="flex-row-reverse items-center justify-between">
            <View className="flex-row-reverse items-center gap-4">
              <Animated.View
                entering={FadeInDown.duration(300)}
                className="p-1 border-2 border-lime-500/30 rounded-full"
              >
                <Image
                  source={profile?.avatar_url ?? user.user_metadata.avatar_url}
                  style={{ width: 64, height: 64, borderRadius: 32 }}
                  contentFit="cover"
                />
              </Animated.View>
              <View>
                <Animated.Text
                  entering={FadeInDown.delay(80).duration(300).damping(20)}
                  className="typo-label text-white/40 text-right italic"
                >
                  MY PROFILE
                </Animated.Text>
                <Animated.Text
                  entering={FadeInDown.delay(160).duration(300).damping(20)}
                  className="typo-h1 text-white text-right tracking-tight"
                >
                  {profile?.full_name ?? user.user_metadata.full_name}
                </Animated.Text>
              </View>
            </View>
            <Pressable className="bg-white/5 p-3 rounded-full border border-white/10" onPress={() => router.navigate('/UserSetup')}>
              <Ionicons name="settings-sharp" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {isProfileLoading ? (
          <ActivityIndicator color={colors.lime[500]} style={{ marginTop: 100 }} />
        ) : (
          <View className="px-6 mt-10">
            
            {/* Workout Performance Grid */}
            <AnimatedCard delay={200} className="bg-background-800 border border-white/5 rounded-[35px] p-6 mb-6 overflow-hidden">
               <View className="absolute -top-10 -left-10 w-32 h-32 bg-lime-500/5 rounded-full blur-3xl" />
               <View className="flex-row-reverse justify-between items-center">
                  <WorkoutStatItem icon="flash" value={String(workoutStats?.weeklyCount ?? 0)} label="WEEKLY" />
                  <View className="w-[1px] h-12 bg-white/5" />
                  <WorkoutStatItem icon="time" value={formatMinutes(workoutStats?.weeklyMinutes ?? 0)} label="ACTIVE" />
                  <View className="w-[1px] h-12 bg-white/5" />
                  <WorkoutStatItem icon="flame" value={String(workoutStats?.streak ?? 0)} label="STREAK" />
                  <View className="w-[1px] h-12 bg-white/5" />
                  <WorkoutStatItem icon="trophy" value={String(workoutStats?.totalCount ?? 0)} label="TOTAL" />
               </View>
            </AnimatedCard>

            {/* Quick Stats Grid */}
            <View className="flex-row-reverse flex-wrap justify-between">
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
                  { label: 'מין', value: getGenderLabel(profile?.gender ?? null), icon: 'person' }
                ].map((item, index) => (
                  <AnimatedCard key={index} delay={300 + (index * 100)} className="w-[48%] bg-background-800 border border-white/5 rounded-[28px] p-5 mb-4">
                     <View className="bg-lime-500/10 self-end p-2 rounded-xl mb-3">
                        <Ionicons name={item.icon as any} size={16} color={colors.lime[500]} />
                     </View>
                     <Text className="typo-caption-bold text-white/30 uppercase tracking-tighter text-right">{item.label}</Text>
                     <Text className="typo-h3 text-white text-right mt-1">{item.value}</Text>
                  </AnimatedCard>
                ))}
            </View>

            {/* Activity Level Card */}
            <AnimatedCard delay={700} className="bg-background-800 border border-white/5 rounded-[30px] p-6 mb-8 flex-row-reverse items-center">
               <View className="bg-lime-500 p-3 rounded-2xl ml-4 shadow-lg shadow-lime-500/20">
                  <Ionicons name="fitness" size={24} color="black" />
               </View>
               <View className="flex-1">
                  <Text className="typo-caption-bold text-white/30 uppercase tracking-widest text-right">Activity Level</Text>
                  <Text className="typo-h4 text-white text-right leading-tight">{getActivityLabel(profile?.activity_level ?? null)}</Text>
               </View>
            </AnimatedCard>

            {/* Logout Button */}
            <AnimatedCard delay={800}>
              <HoldButton
                onPress={handleLogout}
                holdDurationMs={1500}
                fillVariant="fill-both-sides"
                fillColor="rgba(255,255,255,0.15)"
                hapticOnComplete="error"
                className="h-16 rounded-[24px] flex-row-reverse items-center justify-center border border-red-500/30 bg-red-500/10 mt-4"
                accessibilityLabel="החזק להתנתקות"
              >
                <View className="flex-row-reverse items-center justify-center gap-2">
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  <Text className="typo-btn-cta text-red-500">
                    {loading ? 'מתנתק...' : 'החזק להתנתקות'}
                  </Text>
                </View>
              </HoldButton>
            </AnimatedCard>

          </View>
        )}
      </ScrollView>
    </BackGround>
  );
}