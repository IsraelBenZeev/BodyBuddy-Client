import { colors } from '@/colors';
import { useCreateCustomExercise, useUpdateCustomExercise } from '@/src/hooks/useEcercises';
import { uploadCustomExerciseImages } from '@/src/service/cloudinaryService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { BodyPart, partsBodyHebrew } from '@/src/types/bodtPart';
import {
  CUSTOM_EQUIPMENT_OPTIONS,
  MAX_CUSTOM_EXERCISE_IMAGES,
  UserCustomExercise,
} from '@/src/types/customExercise';
import ActionButton from '@/src/ui/ActionButton';
import ModalBottom from '@/src/ui/ModalButtom';
import AppButton from '@/src/ui/PressableOpacity';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

interface AddCustomExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  initialName?: string;
  exerciseToEdit?: UserCustomExercise | null;
}

const BODY_PART_OPTIONS = Object.keys(partsBodyHebrew) as BodyPart[];

const AddCustomExerciseModal = ({
  visible,
  onClose,
  initialName = '',
  exerciseToEdit = null,
}: AddCustomExerciseModalProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const user = useAuthStore((state) => state.user);
  const { mutate: createCustomExercise, isPending: isCreating } = useCreateCustomExercise(user?.id);
  const { mutate: updateCustomExercise, isPending: isUpdating } = useUpdateCustomExercise(user?.id);
  const { triggerSuccess } = useUIStore();
  const isEditMode = !!exerciseToEdit;
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const isPending = isCreating || isUpdating || isUploadingImages;

  const [name, setName] = useState(initialName);
  const [bodyPart, setBodyPart] = useState<BodyPart | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [homeFriendly, setHomeFriendly] = useState(false);
  const [instructionSteps, setInstructionSteps] = useState<string[]>(['']);
  // מערך מעורב: כתובות https קיימות (כבר הועלו) ו-uri מקומיים חדשים שטרם הועלו.
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      if (exerciseToEdit) {
        setName(exerciseToEdit.name);
        setBodyPart(exerciseToEdit.body_part);
        setEquipment(exerciseToEdit.equipment);
        setHomeFriendly(exerciseToEdit.home_friendly);
        setInstructionSteps(exerciseToEdit.instructions.length > 0 ? exerciseToEdit.instructions : ['']);
        setImages(exerciseToEdit.image_urls ?? []);
      } else {
        setName(initialName);
        setBodyPart(null);
        setEquipment(null);
        setHomeFriendly(false);
        setInstructionSteps(['']);
        setImages([]);
      }
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible, initialName, exerciseToEdit]);

  const handleStepChange = useCallback((index: number, value: string) => {
    setInstructionSteps((prev) => prev.map((step, i) => (i === index ? value : step)));
  }, []);

  const handleAddStep = useCallback(() => {
    setInstructionSteps((prev) => [...prev, '']);
  }, []);

  const handleRemoveStep = useCallback((index: number) => {
    setInstructionSteps((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePickImages = useCallback(async () => {
    const remainingSlots = MAX_CUSTOM_EXERCISE_IMAGES - images.length;
    if (remainingSlots <= 0) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      triggerSuccess('נדרשת הרשאת גישה לגלריה', 'failed');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.7,
    });
    if (result.canceled) return;
    const pickedUris = result.assets.map((asset) => asset.uri).slice(0, remainingSlots);
    setImages((prev) => [...prev, ...pickedUris]);
  }, [images.length, triggerSuccess]);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !bodyPart) return;
    const instructions = instructionSteps.map((step) => step.trim()).filter((step) => step.length > 0);

    let finalImageUrls = images;
    const localUris = images.filter((img) => !img.startsWith('http'));
    if (localUris.length > 0) {
      setIsUploadingImages(true);
      try {
        const uploadedUrls = await uploadCustomExerciseImages(localUris);
        const uploadMap = new Map(localUris.map((uri, i) => [uri, uploadedUrls[i]]));
        finalImageUrls = images.map((img) => uploadMap.get(img) ?? img);
      } catch {
        triggerSuccess('שגיאה בהעלאת התמונות, נסה שוב', 'failed');
        setIsUploadingImages(false);
        return;
      }
      setIsUploadingImages(false);
    }

    const payload = {
      name: name.trim(),
      body_part: bodyPart,
      equipment,
      home_friendly: homeFriendly,
      instructions,
      image_urls: finalImageUrls,
    };
    if (exerciseToEdit) {
      updateCustomExercise({ rawId: exerciseToEdit.id, payload }, { onSuccess: onClose });
    } else {
      createCustomExercise(payload, { onSuccess: onClose });
    }
  }, [
    name,
    bodyPart,
    equipment,
    homeFriendly,
    instructionSteps,
    images,
    exerciseToEdit,
    createCustomExercise,
    updateCustomExercise,
    onClose,
    triggerSuccess,
  ]);

  const canSubmit = name.trim().length > 0 && !!bodyPart;

  return (
    <ModalBottom
      ref={sheetRef}
      initialIndex={-1}
      enablePanDownToClose
      minHeight="75%"
      maxHeight="90%"
      title={isEditMode ? 'עריכת תרגיל' : 'הוספת תרגיל ידנית'}
      onChange={(isOpen) => !isOpen && onClose()}
      onClosePress={() => sheetRef.current?.close()}
    >
      <View className="gap-6 pb-14">
        <View>
          <Text className="typo-label text-background-400 mb-2">שם התרגיל</Text>
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="לדוגמה: לחיצת חזה בקייבל"
              placeholderTextColor="#525252"
              className="typo-input text-white text-right py-3"
              accessibilityLabel="שם התרגיל"
            />
          </View>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            תמונות <Text className="text-background-600">(רשות, עד {MAX_CUSTOM_EXERCISE_IMAGES})</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {images.map((uri, index) => (
              <View key={uri} className="w-20 h-20 rounded-2xl overflow-hidden">
                <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  hitSlop={8}
                  className="absolute top-1 left-1 bg-black/70 rounded-full p-1"
                  accessibilityRole="button"
                  accessibilityLabel={`מחק תמונה ${index + 1}`}
                >
                  <Ionicons name="close" size={12} color="white" />
                </Pressable>
              </View>
            ))}
            {images.length < MAX_CUSTOM_EXERCISE_IMAGES && (
              <Pressable
                onPress={handlePickImages}
                className="w-20 h-20 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="הוסף תמונה לתרגיל"
                accessibilityHint="פותח את גלריית התמונות לבחירה"
              >
                <Ionicons name="camera-outline" size={22} color={colors.background[400]} />
                <Text className="typo-caption text-background-400 mt-1">הוסף</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">חלק גוף</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {BODY_PART_OPTIONS.map((part) => (
              <AppButton
                key={part}
                animationType="opacity"
                haptic="light"
                onPress={() => setBodyPart(part)}
                className={`px-4 py-2 rounded-full border ${
                  bodyPart === part ? 'bg-lime-500 border-lime-500' : 'bg-transparent border-zinc-700'
                }`}
                accessibilityLabel={`בחר חלק גוף: ${partsBodyHebrew[part]}`}
                accessibilityRole="button"
                accessibilityState={{ selected: bodyPart === part }}
              >
                <Text className={bodyPart === part ? 'typo-btn-cta text-black' : 'typo-body text-white'}>
                  {partsBodyHebrew[part]}
                </Text>
              </AppButton>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            ציוד <Text className="text-background-600">(רשות)</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CUSTOM_EQUIPMENT_OPTIONS.map((option) => (
              <AppButton
                key={option.value}
                animationType="opacity"
                haptic="light"
                onPress={() => setEquipment(equipment === option.value ? null : option.value)}
                className={`px-4 py-2 rounded-full border ${
                  equipment === option.value
                    ? 'bg-lime-500/20 border-lime-500'
                    : 'bg-transparent border-zinc-700'
                }`}
                accessibilityLabel={`בחר ציוד: ${option.label_he}`}
                accessibilityRole="button"
                accessibilityState={{ selected: equipment === option.value }}
              >
                <Text
                  className={`typo-label ${equipment === option.value ? 'text-lime-400' : 'text-zinc-400'}`}
                >
                  {option.label_he}
                </Text>
              </AppButton>
            ))}
          </ScrollView>
        </View>

        <AppButton
          animationType="opacity"
          haptic="light"
          onPress={() => setHomeFriendly((prev) => !prev)}
          className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border ${
            homeFriendly ? 'bg-lime-500/15 border-lime-500/50' : 'bg-zinc-900 border-zinc-800'
          }`}
          accessibilityLabel="מתאים לאימון ביתי"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: homeFriendly }}
        >
          <Text className={`typo-body-primary ${homeFriendly ? 'text-lime-300' : 'text-white'}`}>
            מתאים לאימון ביתי
          </Text>
          <View
            className={`w-6 h-6 rounded-full border items-center justify-center ${
              homeFriendly ? 'bg-lime-500 border-lime-500' : 'border-zinc-600'
            }`}
          >
            {homeFriendly && <Text className="text-black text-xs">✓</Text>}
          </View>
        </AppButton>

        <View>
          <Text className="typo-label text-background-400 mb-2">
            הוראות ביצוע <Text className="text-background-600">(רשות)</Text>
          </Text>
          <View className="gap-2">
            {instructionSteps.map((step, index) => (
              <View key={index} className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 items-center justify-center">
                  <Text className="typo-caption-bold text-lime-500">{index + 1}</Text>
                </View>
                <View className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4">
                  <TextInput
                    value={step}
                    onChangeText={(value) => handleStepChange(index, value)}
                    placeholder={`שלב ${index + 1}...`}
                    placeholderTextColor="#525252"
                    className="typo-input text-white text-right py-3"
                    accessibilityLabel={`שלב ${index + 1} בהוראות הביצוע`}
                  />
                </View>
                {instructionSteps.length > 1 && (
                  <Pressable
                    onPress={() => handleRemoveStep(index)}
                    hitSlop={8}
                    className="bg-red-500/10 rounded-xl p-2"
                    accessibilityRole="button"
                    accessibilityLabel={`מחק שלב ${index + 1}`}
                  >
                    <Ionicons name="close" size={16} color="#ef4444" />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
          <Pressable
            onPress={handleAddStep}
            className="flex-row items-center gap-1 self-start mt-3 px-3 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10"
            accessibilityRole="button"
            accessibilityLabel="הוסף שלב נוסף להוראות"
          >
            <Ionicons name="add" size={14} color={colors.lime[400]} />
            <Text className="typo-caption-bold text-lime-400">הוסף שלב</Text>
          </Pressable>
        </View>

        <ActionButton
          onPress={handleSubmit}
          label={isUploadingImages ? 'מעלה תמונות...' : isEditMode ? 'שמור שינויים' : 'שמור תרגיל'}
          iconName="checkmark"
          variant="primary"
          size="md"
          fullWidth
          loading={isPending}
          disabled={!canSubmit}
          accessibilityLabel={isEditMode ? 'שמור שינויים בתרגיל' : 'שמור תרגיל חדש'}
        />
      </View>
    </ModalBottom>
  );
};

export default AddCustomExerciseModal;
