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
            <View className="items-center mb-4">
              <View className="w-12 h-1.5 bg-white/10 rounded-full" />
            </View>

            {state === 'idle' && (
              <>
                <View className="items-center mb-6">
                  <View className="bg-lime-500/10 w-20 h-20 rounded-full items-center justify-center mb-4">
                    <Ionicons name="camera" size={38} color="#84cc16" />
                  </View>
                  <Text className="typo-h3 text-white text-center">נתח ארוחה עם AI</Text>
                  <Text className="typo-label text-gray-400 text-center mt-2 px-4">
                    צלם או בחר תמונה ו-AI יזהה את המרכיבים ואת הערכים התזונתיים
                  </Text>
                </View>
                <Pressable
                  onPress={handleCapture}
                  className="bg-lime-500 rounded-2xl h-14 items-center justify-center flex-row gap-2"
                  accessibilityRole="button"
                  accessibilityLabel="צלם ארוחה"
                >
                  <Ionicons name="camera" size={20} color="#000" />
                  <Text className="typo-btn-cta text-black">צלם ארוחה</Text>
                </Pressable>
                <Pressable
                  onPress={handlePickFromGallery}
                  className="mt-3 bg-background-800 border border-white/10 rounded-2xl h-14 items-center justify-center flex-row gap-2"
                  accessibilityRole="button"
                  accessibilityLabel="בחר מהגלריה"
                >
                  <Ionicons name="images-outline" size={20} color="#fff" />
                  <Text className="typo-btn-cta text-white">בחר מהגלריה</Text>
                </Pressable>
                <Pressable onPress={handleClose} className="mt-3 h-12 items-center justify-center" accessibilityRole="button" accessibilityLabel="ביטול">
                  <Text className="typo-body-primary text-gray-400">ביטול</Text>
                </Pressable>
              </>
            )}

            {state === 'loading' && (
              <View className="items-center py-4">
                <ScanAnimation />
                <Pressable
                  onPress={handleCancel}
                  className="mt-6 bg-background-800 border border-white/10 rounded-2xl h-12 w-full items-center justify-center"
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
                  <View className="bg-red-500/10 w-20 h-20 rounded-full items-center justify-center mb-4">
                    <Ionicons name="alert-circle" size={38} color="#f87171" />
                  </View>
                  <Text className="typo-h3 text-white text-center">שגיאה</Text>
                  <Text className="typo-label text-gray-400 text-center mt-2 px-4">{errorMsg}</Text>
                </View>
                <Pressable
                  onPress={handleRetry}
                  className="bg-lime-500 rounded-2xl h-14 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="נסה שוב"
                >
                  <Text className="typo-btn-cta text-black">נסה שוב</Text>
                </Pressable>
                <Pressable onPress={handleClose} className="mt-3 h-12 items-center justify-center" accessibilityRole="button" accessibilityLabel="ביטול">
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
