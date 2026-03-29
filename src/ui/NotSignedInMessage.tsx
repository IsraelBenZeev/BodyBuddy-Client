import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface NotSignedInMessageProps {
  /** תוכן אופציונלי מתחת לטקסט (למשל כפתור נוסף) */
  children?: ReactNode;
  /** מחלקות Tailwind ל־View החיצוני */
  className?: string;
}

const DEFAULT_TITLE = 'אינך מחובר כרגע';
const DEFAULT_SUBTEXT =
  'גש לפרופיל שלך ולשמירת ההתקדמות – התחבר או הירשם:';

/** פרמטר dummy כי הנתיב auth/login/[params] ו-auth/signup/[params] דורשים segment */
const AUTH_PARAM = 'entry';

/**
 * הודעת UI למשתמש שלא מחובר – טקסט + קישורי ניווט להתחברות/רישום.
 */
export default function NotSignedInMessage({
  children,
  className = '',
}: NotSignedInMessageProps) {
  const router = useRouter();

  return (
    <View
      className={`flex-1 items-center justify-center px-8 py-12 ${className}`}
    >
      <Text className="typo-h2 text-lime-400 text-center mb-3">
        {DEFAULT_TITLE}
      </Text>
      <Text className="typo-body text-background-400 text-center leading-6 mb-6">
        {DEFAULT_SUBTEXT}
      </Text>
      <View className="flex-row gap-4 mb-8">
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: '/auth/login/[params]',
              params: { params: AUTH_PARAM },
            } as never)
          }
          className="bg-lime-500 px-6 py-3 rounded-2xl"
          accessibilityRole="button"
          accessibilityLabel="התחבר"
        >
          <Text className="typo-btn-cta text-black">התחבר</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: '/auth/signup/[params]',
              params: { params: AUTH_PARAM },
            } as never)
          }
          className="bg-background-700 border border-background-600 px-6 py-3 rounded-2xl"
          accessibilityRole="button"
          accessibilityLabel="הירשם"
        >
          <Text className="typo-btn-secondary text-lime-400">הירשם</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}
