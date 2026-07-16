import { colors } from '@/colors';
import { signInWithEmail, signInWithGoogle } from '@/src/service/authService';
import { recordPrivacyConsent } from '@/src/service/consentService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import ActionButton from '@/src/ui/ActionButton';
import BackGround from '@/src/ui/BackGround';
import BodyBuddyLogo from '@/src/ui/BodyBuddyLogo';
import FormInput from '@/src/ui/FormInput';
import { PRIVACY_POLICY_VERSION } from '@/src/types/consent';
import PolicyConsentCheckbox from '@/src/ui/PolicyConsentCheckbox';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [shouldNavigateToTabs, setShouldNavigateToTabs] = useState(false);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);

  useEffect(() => {
    if (shouldNavigateToTabs) {
      router.replace('/(tabs)');
    }
  }, [shouldNavigateToTabs, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleNavigateToRegister = useCallback(
    () =>
      router.replace({
        pathname: '/auth/signup/[params]',
        params: { params: 'AUTH_PARAM' },
      } as never),
    [router]
  );

  const onSubmit = async (formData: LoginFormData) => {
    setLoading(true);
    const { data, error } = await signInWithEmail(formData.email, formData.password);
    setLoading(false);

    if (error) {
      triggerSuccess('שגיאה בהתחברות - בדוק את הפרטים שלך', 'failed');
    } else {
      if (data?.user && data?.session) {
        useAuthStore.getState().setUser(data.user);
        useAuthStore.getState().setSession(data.session);
        recordPrivacyConsent(data.user.id, PRIVACY_POLICY_VERSION);
        triggerSuccess('התחברת בהצלחה', 'success');
        setShouldNavigateToTabs(true);
      }
    }
  };

  return (
    <BackGround>
      {googleLoading && (
        <View
          style={{ position: 'absolute', inset: 0, zIndex: 99 }}
          className="flex-1 bg-background-1200/80 items-center justify-center gap-4"
          accessible
          accessibilityLabel="מתחבר עם Google, אנא המתן"
          accessibilityLiveRegion="polite"
        >
          <ActivityIndicator size="large" color={colors.lime[300]} />
          <Text className="typo-body text-background-400">מתחבר עם Google...</Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-5 py-12 justify-center">
            {/* Logo/Title */}
            <View className="mb-12 items-center">
              <BodyBuddyLogo width={150} height={174} />
              <Text className="typo-body text-background-400 text-center mt-4">התחבר למערכת</Text>
            </View>

            {/* Email Input */}
            <FormInput
              control={control}
              name="email"
              rules={{
                required: 'אימייל חובה',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'אימייל לא תקין',
                },
              }}
              label="אימייל"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 20 }}
              labelStyle={{
                color: colors.lime[400],
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
                // textAlign: 'right',
              }}
              inputStyle={{
                backgroundColor: colors.background[800],
                borderWidth: 1,
                borderColor: errors.email ? colors.red[500] : colors.background[600],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                color: colors.white,
                fontSize: 16,
                textAlign: 'right',
              }}
              errorStyle={{
                color: colors.red[400],
                fontSize: 14,
                textAlign: 'left',
                marginTop: 4,
              }}
            />

            {/* Password Input */}
            <FormInput
              control={control}
              name="password"
              rules={{
                required: 'סיסמה חובה',
                minLength: {
                  value: 6,
                  message: 'לפחות 6 תווים',
                },
              }}
              label="סיסמה"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 24 }}
              labelStyle={{
                color: colors.lime[400],
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
                textAlign: 'right',
              }}
              inputStyle={{
                backgroundColor: colors.background[800],
                borderWidth: 1,
                borderColor: errors.password ? colors.red[500] : colors.background[600],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                color: colors.white,
                fontSize: 16,
                textAlign: 'right',
              }}
              errorStyle={{
                color: colors.red[400],
                fontSize: 14,
                textAlign: 'left',
                marginTop: 4,
              }}
            />
            {/* Privacy Policy - required since Google sign-in may create a new account */}
            <PolicyConsentCheckbox
              checked={agreedToPolicy}
              onToggle={() => setAgreedToPolicy((prev) => !prev)}
              promptText="בהתחברת הינך מסכים ל"
            />
            {/* Login Button */}
            <View className="mb-4">
              <ActionButton
                onPress={handleSubmit(onSubmit)}
                label="התחבר"
                iconName="log-in-outline"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                disabled={!agreedToPolicy}
                accessibilityLabel="התחבר"
                accessibilityHint="לחץ כדי להתחבר עם האימייל והסיסמה"
              />
            </View>

            {/* Google Button */}
            <ActionButton
              onPress={async () => {
                setGoogleLoading(true);
                try {
                  await signInWithGoogle();
                } finally {
                  setGoogleLoading(false);
                }
              }}
              label="התחבר באמצעות Google"
              iconName="logo-google"
              variant="secondary"
              size="md"
              fullWidth
              loading={googleLoading}
              disabled={!agreedToPolicy}
              accessibilityLabel="התחבר באמצעות Google"
              accessibilityHint="לחץ כדי להתחבר עם חשבון Google"
            />

            {/* Register Link */}
            <View className="mt-8">
              <Pressable
                onPress={handleNavigateToRegister}
                accessibilityRole="button"
                accessibilityLabel="הירשם כאן"
              >
                <Text className="typo-body text-background-400 text-center">
                  אין לך חשבון? <Text className="text-lime-400 font-semibold">הירשם כאן</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackGround>
  );
}
