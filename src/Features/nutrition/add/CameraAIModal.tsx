import { analyzeNutritionImage } from '@/src/service/nutritionService';
import type { AIAnalysisResult } from '@/src/types/nutrition';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type ModalState = 'idle' | 'loading' | 'error';

const CameraAIModal = ({ visible, onClose }: Props) => {
  const router = useRouter();
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (base64: string) => {
    setState('loading');
    try {
      const analysis: AIAnalysisResult = await analyzeNutritionImage(base64);
      onClose();
      if (analysis.type === 'food') {
        router.push({
          pathname: '/add-food/create',
          params: {
            food_name: analysis.food_name,
            protein_per_100: String(analysis.protein_per_100),
            carbs_per_100: String(analysis.carbs_per_100),
            fat_per_100: String(analysis.fat_per_100),
            calories_per_100: String(analysis.calories_per_100),
            ...(analysis.serving_weight != null && { serving_weight: String(analysis.serving_weight) }),
            ...(analysis.category != null && { category: analysis.category }),
          },
        });
      } else {
        router.push({
          pathname: '/MealBuilder/create',
          params: {
            initialName: analysis.meal_name,
            initialItemsJson: JSON.stringify(analysis.items),
          },
        });
      }
    } catch {
      setErrorMsg('שגיאה בניתוח התמונה. נסה שוב.');
      setState('error');
    }
  };

  const handleCapture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg('נדרשת הרשאת מצלמה');
      setState('error');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    if (result.canceled || !result.assets[0]?.base64) return;
    await handleAnalyze(result.assets[0].base64);
  };

  const handlePickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg('נדרשת הרשאת גישה לגלריה');
      setState('error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (result.canceled || !result.assets[0]?.base64) return;
    await handleAnalyze(result.assets[0].base64);
  };

  const handleRetry = () => {
    setErrorMsg('');
    setState('idle');
  };

  const handleClose = () => {
    setErrorMsg('');
    setState('idle');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        className="flex-1 bg-black/70 justify-end"
        onPress={handleClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-background-900 rounded-t-3xl px-6 pt-6 pb-10">
            {/* Handle */}
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-white/10 rounded-full" />
            </View>

            {state === 'idle' && (
              <>
                <View className="items-center mb-6">
                  <View className="bg-lime-500/10 w-20 h-20 rounded-full items-center justify-center mb-4">
                    <Ionicons name="camera" size={38} color="#84cc16" />
                  </View>
                  <Text className="text-white text-xl font-black text-center">נתח ארוחה עם AI</Text>
                  <Text className="text-gray-400 text-sm text-center mt-2 px-4">
                    צלם או בחר תמונה ו-AI יזהה את המרכיבים ואת הערכים התזונתיים
                  </Text>
                </View>
                <Pressable
                  onPress={handleCapture}
                  className="bg-lime-500 rounded-2xl h-14 items-center justify-center flex-row gap-2"
                >
                  <Ionicons name="camera" size={20} color="#000" />
                  <Text className="text-black font-black text-base">צלם ארוחה</Text>
                </Pressable>
                <Pressable
                  onPress={handlePickFromGallery}
                  className="mt-3 bg-background-800 border border-white/10 rounded-2xl h-14 items-center justify-center flex-row gap-2"
                >
                  <Ionicons name="images-outline" size={20} color="#fff" />
                  <Text className="text-white font-bold text-base">בחר מהגלריה</Text>
                </Pressable>
                <Pressable onPress={handleClose} className="mt-3 h-12 items-center justify-center">
                  <Text className="text-gray-400 font-bold">ביטול</Text>
                </Pressable>
              </>
            )}

            {state === 'loading' && (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#84cc16" />
                <Text className="text-white font-bold text-base mt-4">מנתח את הארוחה...</Text>
                <Text className="text-gray-500 text-sm mt-1">זה עלול לקחת מספר שניות</Text>
              </View>
            )}

            {state === 'error' && (
              <>
                <View className="items-center mb-6">
                  <View className="bg-red-500/10 w-20 h-20 rounded-full items-center justify-center mb-4">
                    <Ionicons name="alert-circle" size={38} color="#f87171" />
                  </View>
                  <Text className="text-white text-xl font-black text-center">שגיאה</Text>
                  <Text className="text-gray-400 text-sm text-center mt-2 px-4">{errorMsg}</Text>
                </View>
                <Pressable
                  onPress={handleRetry}
                  className="bg-lime-500 rounded-2xl h-14 items-center justify-center"
                >
                  <Text className="text-black font-black text-base">נסה שוב</Text>
                </Pressable>
                <Pressable onPress={handleClose} className="mt-3 h-12 items-center justify-center">
                  <Text className="text-gray-400 font-bold">ביטול</Text>
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
