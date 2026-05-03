import { colors } from '@/colors';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { Exercise } from '@/src/types/exercise';
import { modeListExercises } from '@/src/types/mode';
import { ButtonAddFavorit, ButtonRemoveFavorit } from '@/src/ui/ButtonsFavorit';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CardExerciseProps {
  item: Exercise;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  mode: modeListExercises;
}

const CardExercise = ({ item, favorites, toggleFavorite, mode }: CardExerciseProps) => {
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const isSelectedId = useWorkoutStore((state) =>
    state.selectedExerciseIds.has(item.exerciseId)
  );
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const isSelected = mode === 'picker' && isSelectedId;

  // פונקציית ניווט/בחירה מרכזית
  const handleMainPress = useCallback(() => {
    if (mode === 'view') {
      router.push({
        pathname: '/exercise/[exerciseId]',
        params: { exerciseId: item.exerciseId },
      });
    } else {
      toggleExercise(item.exerciseId);
    }
  }, [mode, router, item.exerciseId, toggleExercise]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(item.exerciseId);
  }, [toggleFavorite, item.exerciseId]);

  return (
    <AppButton
      animationType="scale"
      haptic="medium"
      onPress={handleMainPress}
      accessibilityLabel={mode === 'picker' ? `${item.name_he}${isSelected ? ', נבחר' : ''}` : item.name_he}
      accessibilityState={mode === 'picker' ? { selected: isSelected } : undefined}
      // הסרנו צלליות מורכבות מה-className כדי למנוע קריסת Navigation
      className={`
        flex-row mb-4 p-3 rounded-[24px] border-[1.5px] gap-3
        ${isSelected ? "bg-zinc-800 border-lime-500" : "bg-zinc-900 border-zinc-800"}
      `}
      // העברנו את הצללית ל-style בטוח
      style={isSelected ? {
        shadowColor: colors.lime[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
      } : {}}
    >
      {/* תמונה / GIF */}
      <View style={styles.imageContainer}>
        {item.gif_available === false || imgError ? (
          <DumbbellAnimation size={85} />
        ) : (
          <Image
            source={item.gifUrl}
            style={styles.image}
            contentFit="cover"
            transition={400}
            onError={() => setImgError(true)}
          />
        )}
        
        {/* כפתור מועדפים - רק במצב VIEW */}
        {mode === 'view' && (
          <View className="absolute top-1 right-1 z-50">
             <AppButton
                animationType="opacity"
                haptic="light"
                onPress={handleToggleFavorite}
                className="bg-zinc-950/70 rounded-lg p-1"
                hitSlop={10}
                accessibilityLabel={favorites.includes(item.exerciseId) ? 'הסר ממועדפים' : 'הוסף למועדפים'}
             >
                {favorites.includes(item.exerciseId) ? <ButtonRemoveFavorit /> : <ButtonAddFavorit />}
             </AppButton>
          </View>
        )}
      </View>

      {/* מידע על התרגיל */}
      <View className="flex-1 pr-4 justify-center items-start">
        <View className='items-start'>
          <Text
            numberOfLines={1}
            className={`typo-h4 text-right ${isSelected ? "text-lime-400" : "text-white"}`}
          >
            {item.name_he}
          </Text>
          <View className="flex-row items-center mt-1">
            <MaterialCommunityIcons
              name="target"
              size={14}
              color={isSelected ? colors.lime[400] : colors.background[400]}
            />
            <Text className="typo-label text-zinc-400 mr-1 text-right" numberOfLines={1}>
              {item.targetMuscles_he.join(', ')}
            </Text>
          </View>
        </View>

        {/* תגיות ציוד */}
        <View className="flex-row flex-wrap gap-1 mt-3">
          {item.equipments_he.slice(0, 2).map((eq, i) => (
            <View
              key={i}
              className={`px-2 py-1 rounded-md border ${isSelected ? "bg-lime-600 border-lime-500" : "bg-zinc-800 border-zinc-700"}`}
            >
              <Text className={`typo-caption ${isSelected ? "text-white" : "text-zinc-400"}`}>
                {eq}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* אינדיקטור שמאלי */}
      <View className="pl-1 items-center justify-center">
        {mode === 'picker' ? (
          <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? "bg-lime-400 border-lime-400" : "border-zinc-600"}`}>
            {isSelected && <MaterialCommunityIcons name="check" size={16} color="black" />}
          </View>
        ) : (
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.background[400]} />
        )}
      </View>
    </AppButton>
  );
};
export default React.memo(CardExercise);

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: colors.background[800],
    borderRadius: 24,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.background[700], // צבע גבול עדין יותר כברירת מחדל
    alignItems: 'center',
  },
  exerciseCardSelected: {
    backgroundColor: colors.background[700], // שינוי רקע קל להדגשה
    borderColor: colors.lime[500],
    // הוספת "הילה" עדינה
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    // מסגרת פנימית לתמונה
    borderWidth: 1,
    borderColor: colors.background[700],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(9, 9, 11, 0.7)', // שקיפות מוסיפה למראה הפרמיום
    borderRadius: 8,
    padding: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'center',
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: -0.3,
  },
  muscleText: {
    color: colors.background[400],
    fontSize: 13,
    marginRight: 4,
    textAlign: 'right',
  },
  equipmentBadge: {
    backgroundColor: colors.background[900],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background[600],
  },
  equipmentBadgeSelected: {
    backgroundColor: colors.lime[600],
    borderColor: colors.lime[500],
  },
  equipmentText: {
    color: colors.background[300],
    fontSize: 11,
    fontWeight: '600',
  },
  actionContainer: {
    paddingLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.background[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCircleActive: {
    backgroundColor: colors.lime[400],
    borderColor: colors.lime[400],
  },
});
