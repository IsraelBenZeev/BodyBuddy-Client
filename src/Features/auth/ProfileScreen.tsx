import { colors } from '@/colors';
import { useProfile } from '@/src/hooks/useProfile';
import { signOut } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import {
  activityLevelOptions,
  genderOptions,
  getOffsetIntensity,
  Goal,
  goalOptions,
} from '@/src/types/profile';
import BackGround from '@/src/ui/BackGround';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { calculateDailyCalories } from '@/src/utils/calculateMetrics';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

/** מיפוי ערך מין לעברית */
const getGenderLabel = (gender: string | null): string => {
  if (!gender) return '--';
  return genderOptions.find((o) => o.value === gender)?.label ?? gender;
};

/** מיפוי ערך רמת פעילות לעברית */
const getActivityLabel = (level: string | null): string => {
  if (!level) return '--';
  return activityLevelOptions.find((o) => o.value === level)?.label ?? level;
};

/** מיפוי ערך מטרה לעברית */
const getGoalLabel = (goal: string | null): string => {
  if (!goal) return '--';
  return goalOptions.find((o) => o.value === goal)?.label ?? goal;
};

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [loading, setLoading] = useState(false);

  // שליפת נתוני הפרופיל מ-Supabase דרך React Query
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);

  // חישוב קלוריות יומיות מומלצות – מחושב בכל כניסה, לא נשמר ב-DB
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

  // תיוג עוצמת הגרעון/עודף
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
      <ScrollView className="flex-1 px-5 py-8">
        <Text className="text-lime-400 text-3xl font-black mb-8 text-right">
          הפרופיל שלי
        </Text>

        {/* Header – שם + תמונה */}
        <View className="flex-row justify-end items-center mb-5">
          <View className="mr-4 justify-center items-end">
            <Text className="text-white text-2xl font-bold">
              {profile?.full_name ?? user.user_metadata.full_name}
            </Text>
            <Text className="text-background-400 text-sm">{user.email}</Text>
          </View>
          <Image
            source={profile?.avatar_url ?? user.user_metadata.avatar_url}
            style={{ width: 60, height: 60, borderRadius: 50 }}
          />
        </View>

        {/* תאריך הצטרפות */}
        {user.created_at && (
          <ProfileItem
            title="תאריך הצטרפות"
            value={new Date(user.created_at).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        )}

        {/* נתוני פרופיל */}
        {isProfileLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator color="rgb(150, 200, 40)" size="large" />
          </View>
        ) : (
          <>
            <ProfileItem
              title="גיל"
              value={profile?.age != null ? `${profile.age}` : '--'}
            />
            <ProfileItem
              title="מין"
              value={getGenderLabel(profile?.gender ?? null)}
            />
            <ProfileItem
              title="גובה"
              value={profile?.height != null ? `${profile.height} ס״מ` : '--'}
            />
            <ProfileItem
              title="משקל"
              value={profile?.weight != null ? `${profile.weight} ק״ג` : '--'}
            />
            <ProfileItem
              title="רמת פעילות"
              value={getActivityLabel(profile?.activity_level ?? null)}
            />

            {/* מטרה + קלוריות מחושבות */}
            <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-lime-500/30">
              <View className="flex-row-reverse items-center mb-3">
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color={colors.lime[500]}
                />
                <Text className="text-lime-500 text-sm font-bold mr-2">
                  המטרה שלי
                </Text>
              </View>
              <Text className="text-white text-lg font-bold text-right mb-3">
                {getGoalLabel(profile?.goal ?? null)}
              </Text>

              {dailyCalories != null && (
                <View className="bg-background-700 rounded-xl p-4 border border-background-600">
                  <Text className="text-background-400 text-xs text-right mb-1">
                    קלוריות יומיות מומלצות
                  </Text>
                  <View className="flex-row-reverse items-baseline justify-end">
                    <Text className="text-lime-400 text-3xl font-black">
                      {dailyCalories.toLocaleString()}
                    </Text>
                    <Text className="text-background-400 text-sm mr-1">
                      קק״ל
                    </Text>
                  </View>

                  {/* הצגת הפרש קלורי עם תיוג עוצמה */}
                  {offsetIntensity &&
                    profile?.calorie_offset != null && (
                      <Text className="text-background-400 text-xs text-center mt-3">
                        {profile.goal === 'cut' ? 'גרעון' : 'עודף'} של{' '}
                        <Text
                          className="font-bold"
                          style={{ color: offsetIntensity.color }}
                        >
                          {profile.calorie_offset}
                        </Text>{' '}
                        קק״ל ·{' '}
                        <Text
                          className="font-bold"
                          style={{ color: offsetIntensity.color }}
                        >
                          {offsetIntensity.tag}
                        </Text>
                      </Text>
                    )}
                </View>
              )}
            </View>
          </>
        )}

        {/* Edit Profile Button */}
        <Pressable
          onPress={() => router.push('/UserSetup')}
          className="flex-row-reverse items-center justify-center bg-background-700 border border-lime-500/30 rounded-2xl py-4 mt-4 mb-4"
        >
          <Ionicons name="create-outline" size={20} color={colors.lime[500]} />
          <Text className="text-lime-500 font-bold text-base mr-2">
            עריכת פרטים
          </Text>
        </Pressable>

        {/* Logout Button */}
        <ButtonPrimary
          title={loading ? 'מתנתק...' : 'התנתק'}
          onPress={handleLogout}
          classNameButton=""
        />
      </ScrollView>
    </BackGround>
  );
}

const ProfileItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
      <Text className="text-background-400 text-sm mb-2 text-right font-semibold">
        {title}
      </Text>
      <Text className="text-white text-base text-right">{value}</Text>
    </View>
  );
};
