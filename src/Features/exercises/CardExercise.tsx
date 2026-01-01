import { colors } from '@/colors';
import { Exercise } from '@/src/types/exercise';
import { ButtonAddFavorit, ButtonRemoveFavorit } from '@/src/ui/ButtonsFavorit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface CardExerciseProps {
  item: Exercise;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}
const CardExercise = ({ item, favorites, toggleFavorite }: CardExerciseProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: '/exercise/[exerciseId]',
          params: { exerciseId: item.exerciseId },
        })
      }
      style={styles.exerciseCard}
    >
      {/* תמונה / GIF */}
      <View style={styles.imageContainer}>
        <Image
          source={item.gifUrl}
          style={styles.image}
          contentFit="cover"
          transition={500}
          cachePolicy={'disk'}
        />
        {/* כפתור פייבוריט צף על התמונה */}
        <Pressable style={styles.favoriteBadge} onPress={() => toggleFavorite(item.exerciseId)}>
          {favorites.includes(item.exerciseId) ? <ButtonRemoveFavorit /> : <ButtonAddFavorit />}
        </Pressable>
      </View>
      {/* מידע על התרגיל */}
      <View style={styles.infoContainer}>
        <View>
          <Text numberOfLines={1} style={styles.exerciseTitle}>
            {item.name_he}
          </Text>
          <View className="flex-row-reverse items-center mt-1">
            <MaterialCommunityIcons name="target" size={14} color={colors.lime[500]} />
            <Text style={styles.muscleText} numberOfLines={1}>
              {item.targetMuscles_he.join(', ')}
            </Text>
          </View>
        </View>
        {/* תגיות ציוד בתחתית הכרטיס */}
        <View className="flex-row-reverse flex-wrap gap-1 mt-2">
          {item.equipments_he.slice(0, 2).map((eq, i) => (
            <View key={i} style={styles.equipmentBadge}>
              <Text style={styles.equipmentText}>{eq}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* חץ קטן דקורטיבי בצד */}
      <View className="justify-center pl-2">
        <MaterialCommunityIcons name="chevron-left" size={24} color="#3f3f46" />
      </View>
    </TouchableOpacity>
  );
};

export default CardExercise;
const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lime[500],
  },
  exerciseCard: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.background[800],
    borderRadius: 24,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.background[600],
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.background[900],
    borderRadius: 10,
    padding: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 15,
    justifyContent: 'center',
  },
  exerciseTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  muscleText: {
    color: colors.lime[400],
    fontSize: 13,
    marginRight: 4,
    textAlign: 'right',
  },
  equipmentBadge: {
    backgroundColor: colors.lime[900], // Lime opacity
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.lime[800],
  },
  equipmentText: {
    color: colors.lime[400],
    fontSize: 10,
    fontWeight: 'bold',
  },
});
