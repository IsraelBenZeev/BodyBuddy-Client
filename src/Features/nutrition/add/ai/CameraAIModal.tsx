import AIResults, { MOCK_AI_FOOD, MOCK_AI_MEAL } from '@/src/Features/nutrition/add/ai/AIResults';
import { analyzeNutritionImage } from '@/src/service/nutritionService';
import { useUIStore } from '@/src/store/useUIStore';
import type { AIAnalysisResult } from '@/src/types/nutrition';
import ActionButton from '@/src/ui/ActionButton';
import ScanAnimation from '@/src/ui/Animations/ScanAnimation';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  date: string;
}

type ModalState = 'idle' | 'loading' | 'error';

const CameraAIModal = ({ visible, onClose, userId, date }: Props) => {
  const { triggerSuccess } = useUIStore();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (visible) {
      setState('idle');
      setErrorMsg('');
      setAnalysisResult(null);
    }
  }, [visible]);
  const handleAnalyze = useCallback(async (base64: string) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setState('loading');
    try {
      const analysis: AIAnalysisResult = await analyzeNutritionImage(base64, controller.signal);
      if (controller.signal.aborted) return;
      setAnalysisResult(analysis);
      setState('idle');
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) return;
      console.error('[CameraAI] analyzeNutritionImage failed:', err);
      setErrorMsg('שגיאה בניתוח התמונה. נסה שוב.');
      setState('error');
    }
  }, []);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setState('idle');
    setAnalysisResult(null);
    onClose();
    triggerSuccess('בקשתך בוטלה', 'success');
  }, [onClose, triggerSuccess]);

  const handleCapture = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg('נדרשת הרשאת מצלמה');
      setState('error');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    if (result.canceled || !result.assets[0]?.base64) return;
    await handleAnalyze(result.assets[0].base64);
  }, [handleAnalyze]);

  const handlePickFromGallery = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg('נדרשת הרשאת גישה לגלריה');
      setState('error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (result.canceled || !result.assets[0]?.base64) return;
    await handleAnalyze(result.assets[0].base64);
  }, [handleAnalyze]);

  const handleRetry = useCallback(() => {
    setErrorMsg('');
    setState('idle');
  }, []);

  const handleClose = useCallback(() => {
    setErrorMsg('');
    setState('idle');
    setAnalysisResult(null);
    onClose();
  }, [onClose]);

  // ── When AI result is ready — show AIResults full screen ──
  if (analysisResult) {
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setAnalysisResult(null)}
      >
        <View className="flex-1 bg-background-900">
          <AIResults
            aiResult={analysisResult}
            userId={userId}
            date={date}
            onClose={handleClose}
            onBack={() => setAnalysisResult(null)}
          />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        className="flex-1 bg-black/70 justify-end"
        onPress={state === 'loading' ? undefined : handleClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            className="bg-background-900 rounded-t-3xl px-6 pt-6"
            style={{ paddingBottom: insets.bottom  }}
          >
            {/* Handle */}
            <View className="items-center mb-5">
              <View className="w-12 h-1.5 bg-white/10 rounded-full" />
            </View>

            {state === 'idle' && (
              <>
                {/* ─── Hero Header ─── */}
                <View className="items-center mb-6">
                  {/* AI Badge */}
                  <View className="flex-row items-center gap-2 mb-5">
                    <Text className="typo-caption text-lime-500">✦</Text>
                    <View className="flex-row items-center gap-1.5 bg-lime-500/15 border border-lime-500/30 rounded-full px-3 py-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                      <Text className="typo-caption-bold text-lime-400">AI POWERED</Text>
                    </View>
                    <Text className="typo-caption text-lime-500">✦</Text>
                  </View>

                  {/* Icon area */}
                  <View className="bg-lime-500/10 border border-lime-500/25 w-28 h-28 rounded-3xl items-center justify-center mb-5">
                    <Ionicons name="camera" size={52} color="rgb(163,230,53)" />
                  </View>

                  <Text className="typo-h2 text-white text-center">ניתוח תזונה חכם</Text>
                  <Text className="typo-label text-gray-400 text-center mt-2 px-4">
                    צלם את הארוחה שלך ו-AI יזהה את המרכיבים, הקלוריות והערכים התזונתיים — תוך שניות
                  </Text>
                </View>

                {/* ─── Feature chips ─── */}
                <View className="flex-row justify-center gap-2 mb-6">
                  {(
                    [
                      { icon: 'flash' as const, label: 'מהיר' },
                      { icon: 'shield-checkmark-outline' as const, label: 'מדויק' },
                      { icon: 'nutrition-outline' as const, label: 'מפורט' },
                    ] as const
                  ).map((f) => (
                    <View
                      key={f.label}
                      className="flex-row items-center gap-1 bg-background-800 border border-white/10 rounded-full px-3 py-1.5"
                    >
                      <Ionicons name={f.icon} size={12} color="rgb(163,230,53)" />
                      <Text className="typo-caption text-gray-300">{f.label}</Text>
                    </View>
                  ))}
                </View>

                {/* ─── CTA Buttons ─── */}
                <View className="mb-3">
                  <ActionButton
                    onPress={handleCapture}
                    label="צלם ארוחה"
                    iconName="camera"
                    variant="primary"
                    size="lg"
                    fullWidth
                  />
                </View>

                <ActionButton
                  onPress={handlePickFromGallery}
                  label="העלה מהגלריה"
                  iconName="images-outline"
                  variant="secondary"
                  size="lg"
                  fullWidth
                />

                <Pressable
                  onPress={handleClose}
                  className="mt-3 h-11 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="ביטול"
                >
                  <Text className="typo-body-primary text-gray-500">ביטול</Text>
                </Pressable>

                <View className="mt-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3 flex-row items-start gap-3">
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="#6b7280"
                    style={{ marginTop: 1 }}
                  />
                  <View className="flex-1 gap-1 items-start">
                    <Text className="typo-caption text-background-400 text-left">
                      {
                        'הניתוח מבוצע על ידי AI ועלול להכיל שגיאות. השימוש בו הינו על אחריות המשתמש בלבד.'
                      }
                    </Text>
                    <Text className="typo-caption text-background-400">
                      {'זיהוי שגוי? '}
                      <Text
                        onPress={() => Linking.openURL('mailto:bodybuddysupport@gmail.com')}
                        className="text-lime-400 font-semibold"
                      >
                        {'דווח לנו'}
                      </Text>
                    </Text>
                  </View>
                </View>

                {false && (
                // {__DEV__ && (
                  <View className="mt-4 pt-4 border-t border-white/10 flex-row gap-2">
                    <Pressable
                      onPress={() => setAnalysisResult(MOCK_AI_MEAL)}
                      className="flex-1 h-10 items-center justify-center bg-background-800 border border-lime-500/30 rounded-xl"
                      accessibilityRole="button"
                      accessibilityLabel="טען mock ארוחה"
                    >
                      <Text className="typo-caption text-lime-400">🧪 Mock ארוחה</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setAnalysisResult(MOCK_AI_FOOD)}
                      className="flex-1 h-10 items-center justify-center bg-background-800 border border-blue-500/30 rounded-xl"
                      accessibilityRole="button"
                      accessibilityLabel="טען mock מאכל"
                    >
                      <Text className="typo-caption text-blue-400">🧪 Mock מאכל</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            {/* {true && ( */}
            {state === 'loading' && (
              <View className="items-center py-6">
                {/* AI Agent badge */}
                <View className="flex-row items-center gap-1.5 bg-lime-500/15 border border-lime-500/30 rounded-full px-3 py-1.5 mb-5">
                  <Ionicons name="hardware-chip-outline" size={13} color="rgb(163,230,53)" />
                  <Text className="typo-caption-bold text-lime-400">AI AGENT</Text>
                </View>

                {/* Scan animation */}
                <View className="mb-6">
                  <ScanAnimation />
                </View>

                {/* Title */}
                <Text className="typo-h3 text-white text-center mb-2">מנתח את הארוחה...</Text>

                {/* Subtitle */}
                <Text className="typo-label text-gray-400 text-center px-4">
                  הסוכן שלנו מזהה מרכיבים, קלוריות וערכים תזונתיים.{'\n'}זה עלול לקחת מספר שניות.
                </Text>

                {/* Progress dots */}
                <View className="flex-row gap-1.5 mt-5 mb-6">
                  {[0, 1, 2].map((i) => (
                    <View key={i} className="w-1.5 h-1.5 rounded-full bg-lime-500/60" />
                  ))}
                </View>

                {/* Cancel button — full width */}
                <ActionButton
                  onPress={handleCancel}
                  label="ביטול"
                  iconName="close-circle-outline"
                  variant="secondary"
                  size="md"
                  fullWidth
                />
              </View>
            )}

            {state === 'error' && (
              <>
                <View className="items-center mb-6">
                  <View className="bg-red-500/10 border border-red-500/20 w-24 h-24 rounded-3xl items-center justify-center mb-4">
                    <Ionicons name="alert-circle" size={44} color="#f87171" />
                  </View>
                  <Text className="typo-h3 text-white text-center">משהו השתבש</Text>
                  <Text className="typo-label text-gray-400 text-center mt-2 px-6">{errorMsg}</Text>
                </View>
                <ActionButton
                  onPress={handleRetry}
                  label="נסה שוב"
                  iconName="refresh"
                  variant="primary"
                  size="lg"
                  fullWidth
                />
                <Pressable
                  onPress={handleClose}
                  className="mt-3 h-12 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="ביטול"
                >
                  <Text className="typo-body-primary text-gray-400">ביטול</Text>
                </Pressable>
              </>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CameraAIModal;
