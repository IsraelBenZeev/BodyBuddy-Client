import { colors } from '@/colors';
import { signInWithEmail } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import BackGround from '@/src/ui/BackGround';
import FormInput from '@/src/ui/FormInput';
import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (formData: LoginFormData) => {
    setLoading(true);
    const { data, error } = await signInWithEmail(formData.email, formData.password);
    setLoading(false);

    if (error) {
      triggerSuccess('שגיאה בהתחברות - בדוק את הפרטים שלך');
    } else {
      if (data?.user && data?.session) {
        useAuthStore.getState().setUser(data.user);
        useAuthStore.getState().setSession(data.session);
        triggerSuccess('התחברת בהצלחה');
        setShouldNavigateToTabs(true);
      }
    }
  };

  const handleGoogleSignIn = () => {
    triggerSuccess('התחברות דרך Google תתווסף בקרוב');
  };

  return (
    <BackGround>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-5 py-12 justify-center">
            {/* Logo/Title */}
            <View className="mb-12">
              <Text className="text-lime-400 text-4xl font-black text-center mb-2">
                BodyBuddy
              </Text>
              <Text className="text-background-400 text-base text-center">
                התחבר למערכת
              </Text>
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
                textAlign: 'right',
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
                textAlign: 'right',
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
                textAlign: 'right',
                marginTop: 4,
              }}
            />

            {/* Login Button */}
            <AppButton  
                onPress={handleSubmit(onSubmit)}
                className="w-full items-center justify-center bg-lime-500 py-4 rounded-2xl mb-4"
                animationType="opacity"
                haptic="light"
              >
                <Text className="text-black font-extrabold text-base">{loading ? 'מתחבר...' : 'התחבר'}</Text>
              </AppButton>

            {/* Google Button */}
            <AppButton
              onPress={handleGoogleSignIn}
              className="w-full bg-background-800 border border-background-600 py-4 rounded-2xl"
              animationType="opacity"
              haptic="light"
            >
              <View className="flex-row-reverse items-center justify-center gap-3">
                <Ionicons name="logo-google" size={24} color={colors.lime[500]} />
                <Text className="text-white text-base font-semibold">
                  התחבר באמצעות Google
                </Text>
              </View>
            </AppButton>

            {/* Register Link */}
            <View className="mt-8">
              <Pressable onPress={() => router.replace({
                pathname: '/auth/signup/[params]',
                params: { params: "AUTH_PARAM" },
              } as never)}>
                <Text className="text-background-400 text-center text-base">
                  אין לך חשבון?{' '}
                  <Text className="text-lime-400 font-semibold">הירשם כאן</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackGround>
  );
}
