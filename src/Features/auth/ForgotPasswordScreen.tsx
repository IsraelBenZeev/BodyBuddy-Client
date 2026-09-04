import { colors } from '@/colors';
import { sendPasswordRecoveryEmail } from '@/src/service/authService';
import { useUIStore } from '@/src/store/useUIStore';
import ActionButton from '@/src/ui/ActionButton';
import BackGround from '@/src/ui/BackGround';
import BodyBuddyLogo from '@/src/ui/BodyBuddyLogo';
import FormInput from '@/src/ui/FormInput';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }: ForgotPasswordFormData) => {
    setLoading(true);
    const { error } = await sendPasswordRecoveryEmail(email.trim());
    setLoading(false);

    if (error) {
      triggerSuccess('לא הצלחנו לשלוח קישור לאיפוס סיסמה. נסה שוב.', 'failed');
      return;
    }

    setEmailSent(true);
    triggerSuccess('אם קיים חשבון עם כתובת זו, נשלח אליו קישור לאיפוס סיסמה.', 'success');
  };

  return (
    <BackGround>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-5 py-12 justify-center">
            <View className="mb-12 items-center">
              <BodyBuddyLogo width={150} height={174} />
              <Text className="typo-body text-background-400 text-center mt-4">איפוס סיסמה</Text>
            </View>

            {emailSent ? (
              <View className="items-center gap-6">
                <Text className="typo-body text-background-400 text-center leading-6">
                  בדוק את תיבת הדואר שלך. הקישור יאפשר לך לבחור סיסמה חדשה.
                </Text>
                <ActionButton
                  onPress={() => router.replace('/auth/login/[params]' as never)}
                  label="חזרה להתחברות"
                  iconName="log-in-outline"
                  variant="primary"
                  size="md"
                  fullWidth
                />
              </View>
            ) : (
              <>
                <Text className="typo-body text-background-400 text-center mb-8 leading-6">
                  הזן את כתובת המייל שלך ונשלח קישור לאיפוס הסיסמה.
                </Text>
                <FormInput
                  control={control}
                  name="email"
                  rules={{
                    required: 'אימייל חובה',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'אימייל לא תקין' },
                  }}
                  label="אימייל"
                  placeholder="your@email.com"
                  keyboardType="email-address"
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
                <ActionButton
                  onPress={handleSubmit(onSubmit)}
                  label="שלח קישור לאיפוס"
                  iconName="mail-outline"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                />
              </>
            )}

            <Pressable
              onPress={() => router.replace('/auth/login/[params]' as never)}
              className="mt-8"
              accessibilityRole="button"
              accessibilityLabel="חזרה להתחברות"
            >
              <Text className="typo-body text-background-400 text-center">
                <Text className="text-lime-400 font-semibold">חזרה להתחברות</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackGround>
  );
}
