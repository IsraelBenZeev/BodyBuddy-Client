import { analyzeNutritionImage } from '@/src/service/nutritionService';
import { useUIStore } from '@/src/store/useUIStore';
import type { AIAnalysisResult } from '@/src/types/nutrition';
import ScanAnimation from '@/src/ui/Animations/ScanAnimation';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type ModalState = 'idle' | 'loading' | 'error';

const CameraAIModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const { triggerSuccess } = useUIStore();
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (visible) {
      setState('idle');
      setErrorMsg('');
    }
  }, [visible]);

  const handleAnalyze = useCallback(async (base64: string) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setState('loading');
    try {
      const analysis: AIAnalysisResult = await analyzeNutritionImage(base64, controller.signal);
      if (controller.signal.aborted) return;
      console.log('AI response: ', analysis);

      onClose();
      if (analysis.type === 'food') {
        router.push({
          pathname: '/add-food/[mode]',
          params: {
            mode: 'create',
            food_name: analysis.food_name,
            protein_per_100: String(analysis.protein_per_100),
            carbs_per_100: String(analysis.carbs_per_100),
            fat_per_100: String(analysis.fat_per_100),
            calories_per_100: String(analysis.calories_per_100),
            measurement_type: analysis.measurement_type ?? 'grams',
            ...(analysis.category != null && { category: analysis.category }),
            ...(analysis.serving_amount != null && { serving_amount: String(analysis.serving_amount) }),
          },
        });
      } else {
        router.push({
          pathname: '/MealBuilder/[paramse]',
          params: {
            paramse: 'create',
            initialName: analysis.meal_name,
            initialItemsJson: JSON.stringify(analysis.items),
          },
        });
      }
    } catch {
      if (abortControllerRef.current?.signal.aborted) return;
      setErrorMsg('שגיאה בניתוח התמונה. נסה שוב.');
      setState('error');
    }
  }, [onClose, router]);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setState('idle');
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
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        className="flex-1 bg-black/70 justify-end"
        onPress={state === 'loading' ? undefined : handleClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-background-900 rounded-t-3xl px-6 pt-6 pb-10">
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
                <Pressable
                  onPress={handleCapture}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="bg-lime-500 rounded-2xl h-16 items-center justify-center flex-row gap-2.5 mb-3"
                  accessibilityRole="button"
                  accessibilityLabel="צלם ארוחה"
                >
                  <Ionicons name="camera" size={22} color="#000" />
                  <Text className="typo-btn-cta text-black">צלם ארוחה</Text>
                </Pressable>

                <Pressable
                  onPress={handlePickFromGallery}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="bg-background-800 border border-white/10 rounded-2xl h-16 items-center justify-center flex-row gap-2 "
                  accessibilityRole="button"
                  accessibilityLabel="העלה מהגלריה"
                >
                  <Ionicons name="images-outline" size={18} color="#9ca3af" />
                  <Text className="typo-btn-secondary text-gray-400">העלה מהגלריה</Text>
                </Pressable>

                <Pressable
                  onPress={handleClose}
                  className="mt-3 h-11 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="ביטול"
                >
                  <Text className="typo-body-primary text-gray-500">ביטול</Text>
                </Pressable>
              </>
            )}

            {state === 'loading' && (
              <View className="items-center py-4">
                <ScanAnimation />
                <Text className="typo-label text-lime-400 text-center mt-4">
                  AI מנתח את התמונה...
                </Text>
                <Pressable
                  onPress={handleCancel}
                  className="mt-4 bg-background-800 border border-white/10 rounded-2xl h-12 w-full items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="בטל ניתוח"
                >
                  <Text className="typo-body-primary text-gray-400">ביטול</Text>
                </Pressable>
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
                <Pressable
                  onPress={handleRetry}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="bg-lime-500 rounded-2xl h-14 items-center justify-center flex-row gap-2"
                  accessibilityRole="button"
                  accessibilityLabel="נסה שוב"
                >
                  <Ionicons name="refresh" size={18} color="#000" />
                  <Text className="typo-btn-cta text-black">נסה שוב</Text>
                </Pressable>
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
