import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import ActionButton from './ActionButton';

interface NotSignedInMessageProps {
  children?: ReactNode;
  className?: string;
}

const DEFAULT_TITLE = 'אינך מחובר כרגע';
const DEFAULT_SUBTEXT = 'גש לפרופיל שלך ולשמירת ההתקדמות – התחבר או הירשם:';

const AUTH_PARAM = 'entry';

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
        <ActionButton
          label="התחבר"
          variant="outline"
          size="md"
          onPress={() =>
            router.navigate({
              pathname: '/auth/login/[params]',
              params: { params: AUTH_PARAM },
            } as never)
          }
          accessibilityLabel="התחבר לחשבון"
        />
        <ActionButton
          label="הירשם"
          variant="secondary"
          size="md"
          onPress={() =>
            router.navigate({
              pathname: '/auth/signup/[params]',
              params: { params: AUTH_PARAM },
            } as never)
          }
          accessibilityLabel="הירשם לחשבון חדש"
        />
      </View>
      {children}
    </View>
  );
}
