import { colors } from '@/colors';
import { completePasswordRecovery, updatePassword } from '@/src/service/authService';
import { useUIStore } from '@/src/store/useUIStore';
import ActionButton from '@/src/ui/ActionButton';
import BackGround from '@/src/ui/BackGround';
import BodyBuddyLogo from '@/src/ui/BodyBuddyLogo';
import FormInput from '@/src/ui/FormInput';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const url = Linking.useURL();
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [verifyingLink, setVerifyingLink] = useState(true);
  const [validLink, setValidLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ defaultValues: { password: '', confirmPassword: '' } });

  const password = watch('password');

  useEffect(() => {
    const verifyRecoveryLink = async () => {
      if (!url) {
        setValidLink(false);
        setVerifyingLink(false);
        return;
      }

      const { error } = await completePasswordRecovery(url);
      setValidLink(!error);
      setVerifyingLink(false);

      if (error) triggerSuccess('קישור האיפוס אינו תקין או שפג תוקפו.', 'failed');
    };

    verifyRecoveryLink();
  }, [triggerSuccess, url]);

  const onSubmit = async ({ password: newPassword }: ResetPasswordFormData) => {
    setLoading(true);
    const { error } = await updatePassword(newPassword);
    setLoading(false);

    if (error) {
      triggerSuccess('לא הצלחנו לעדכן את הסיסמה. בקש קישור חדש ונסה שוב.', 'failed');
      return;
    }

    triggerSuccess('הסיסמה עודכנה בהצלחה. אפשר להתחבר מחדש.', 'success');
    router.replace('/auth/login/[params]' as never);
  };

  return (
    <BackGround>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-5 py-12 justify-center">
            <View className="mb-12 items-center">
              <BodyBuddyLogo width={150} height={174} />
              <Text className="typo-body text-background-400 text-center mt-4">בחירת סיסמה חדשה</Text>
            </View>

            {verifyingLink ? (
              <View className="items-center gap-4">
                <ActivityIndicator size="large" color={colors.lime[300]} />
                <Text className="typo-body text-background-400">מאמתים את קישור האיפוס...</Text>
              </View>
            ) : validLink ? (
              <>
                <FormInput
                  control={control}
                  name="password"
                  rules={{ required: 'סיסמה חובה', minLength: { value: 6, message: 'לפחות 6 תווים' } }}
                  label="סיסמה חדשה"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  containerStyle={{ marginBottom: 20 }}
                  labelStyle={{ color: colors.lime[400], fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'right' }}
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
                  errorStyle={{ color: colors.red[400], fontSize: 14, textAlign: 'right', marginTop: 4 }}
                />
                <FormInput
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: 'אימות סיסמה חובה',
                    validate: (value) => value === password || 'הסיסמאות לא תואמות',
                  }}
                  label="אימות סיסמה חדשה"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  containerStyle={{ marginBottom: 24 }}
                  labelStyle={{ color: colors.lime[400], fontSize: 16, fontWeight: '600', marginBottom: 8, textAlign: 'right' }}
                  inputStyle={{
                    backgroundColor: colors.background[800],
                    borderWidth: 1,
                    borderColor: errors.confirmPassword ? colors.red[500] : colors.background[600],
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'right',
                  }}
                  errorStyle={{ color: colors.red[400], fontSize: 14, textAlign: 'right', marginTop: 4 }}
                />
                <ActionButton
                  onPress={handleSubmit(onSubmit)}
                  label="עדכן סיסמה"
                  iconName="lock-closed-outline"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                />
              </>
            ) : (
              <View className="items-center gap-6">
                <Text className="typo-body text-background-400 text-center leading-6">
                  הקישור לא זמין יותר. בקש קישור איפוס חדש כדי להמשיך.
                </Text>
                <ActionButton
                  onPress={() => router.replace('/auth/forgot-password' as never)}
                  label="בקשת קישור חדש"
                  iconName="mail-outline"
                  variant="primary"
                  size="md"
                  fullWidth
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackGround>
  );
}
