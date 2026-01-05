import { colors } from '@/colors';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { Exercise } from '@/src/types/exercise';
import { modeListExercises } from '@/src/types/mode';
import { ButtonAddFavorit, ButtonRemoveFavorit } from '@/src/ui/ButtonsFavorit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CardExerciseProps {
  item: Exercise;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  mode: modeListExercises;
}

const CardExercise = ({ item, favorites, toggleFavorite, mode }: CardExerciseProps) => {
  const router = useRouter();
  const isSelectedId = useWorkoutStore((state) =>
    state.selectedExerciseIds.includes(item.exerciseId)
  );
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const isSelected = mode === 'picker' && isSelectedId;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        if (mode === 'view') {
          router.push({
            pathname: '/exercise/[exerciseId]',
            params: { exerciseId: item.exerciseId },
          });
        } else {

          toggleExercise(item.exerciseId);
        }
      }}
      // משתמשים במערך סטיילים כדי למנוע כפל קוד ולשמור על ביצועים
      style={[styles.exerciseCard, isSelected && styles.exerciseCardSelected]}
    >
      {/* תמונה / GIF */}
      <View style={styles.imageContainer}>
        <Image
          source={item.gifUrl}
          style={styles.image}
          contentFit="cover"
          transition={400}
          cachePolicy={'disk'}
        />
        {mode === 'view' && (
          <Pressable style={styles.favoriteBadge} onPress={() => toggleFavorite(item.exerciseId)}>
            {favorites.includes(item.exerciseId) ? <ButtonRemoveFavorit /> : <ButtonAddFavorit />}
          </Pressable>
        )}
      </View>

      {/* מידע על התרגיל */}
      <View style={styles.infoContainer}>
        <View>
          <Text
            numberOfLines={1}
            style={[styles.exerciseTitle, isSelected && { color: colors.lime[400] }]}
          >
            {item.name_he}
          </Text>
          <View className="flex-row-reverse items-center mt-1">
            <MaterialCommunityIcons
              name="target"
              size={14}
              color={isSelected ? colors.lime[400] : colors.background[400]}
            />
            <Text style={styles.muscleText} numberOfLines={1}>
              {item.targetMuscles_he.join(', ')}
            </Text>
          </View>
        </View>

        {/* תגיות ציוד בתחתית הכרטיס */}
        <View className="flex-row-reverse flex-wrap gap-1 mt-3">
          {item.equipments_he.slice(0, 2).map((eq, i) => (
            <View
              key={i}
              style={[styles.equipmentBadge, isSelected && styles.equipmentBadgeSelected]}
            >
              <Text style={[styles.equipmentText, isSelected && { color: 'white' }]}>{eq}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* אזור אינדיקטור שמאלי */}
      <View style={styles.actionContainer}>
        {mode === 'picker' ? (
          <View style={[styles.selectionCircle, isSelected && styles.selectionCircleActive]}>
            {isSelected && <MaterialCommunityIcons name="check" size={16} color="black" />}
          </View>
        ) : (
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.background[400]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CardExercise;

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row-reverse',
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
