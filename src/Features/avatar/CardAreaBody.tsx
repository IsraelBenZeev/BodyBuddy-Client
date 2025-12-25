import { colors } from '@/colors';
import { useExercises } from '@/src/hooks/useEcercises';
import { BodyPart, Exercise, partsBodyHebrew } from '@/src/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface CardAreaBodyProps {
  selectedPart: BodyPart | null;
  isLoading?: boolean;
}

const CardAreaBody = ({ selectedPart }: CardAreaBodyProps) => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useExercises(selectedPart ?? '', page);
  const router = useRouter();
  const exercises: Exercise[] | undefined = data?.data;
  return (
    <View className="w-full items-end gap-8">
      <View className="flex-row items-center gap-3 ">
        <Text className="text-white text-5xl font-bold tracking-wider">
          {selectedPart ? partsBodyHebrew[selectedPart] : 'בחר אזור'}
        </Text>
        <Ionicons
          name="body-outline"
          size={30}
          color={colors.lime[500]}
          className="rounded-full bg-lime-500/20 p-1.5"
        />
      </View>
      <View className="flex-row items-center gap-3 ">
        <Text className="text-gray-300 text-3xl ">
          {isLoading ? 'טוען...' : exercises ? exercises.length : 0} תרגילים זמינים
        </Text>
        <FontAwesome6
          name="dumbbell"
          size={26}
          color={colors.lime[500]}
          className="bg-lime-500/20 p-1.5 rounded-full"
        />
      </View>
      <View className="flex-row items-center gap-3 ">
        <Text className="text-gray-300 text-3xl">4 תרגילים לאימון ביתי</Text>
        <Octicons
          name="home"
          size={26}
          color={colors.lime[500]}
          className="bg-lime-500/20 p-1.5 rounded-full"
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          console.log(exercises?.length ? exercises[0].bodyParts : null);
          if (selectedPart) {
            // הניווט מתבצע לתיקיית exercises ולקובץ הדינמי [part]
            router.push({
              pathname: '/exercises/[part]',
              params: { part: selectedPart, page: page.toString() },
            });
          }
        }}
      >
        <View className="flex-row items-center gap-3 ">
          <Text className="text-lime-500 text-2xl font-medium">למעבר לתרגילים</Text>
          <AntDesign
            name="swap-right"
            size={26}
            color={colors.lime[500]}
            className="rounded-full bg-lime-500/20 p-1.5"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardAreaBody;

const styles = StyleSheet.create({
  container: {
    width: 150, // רוחב קבוע ונוח יותר
    minHeight: 150,
    position: 'absolute',
    top: -30,
    left: -85, // הזזה קלה כדי שיראה טוב יותר
    borderRadius: 16,
    padding: 12,
    // הצללה חזקה יותר להבלטה מעל הרקע
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentLine: {
    width: 4,
    height: '130%', // קצת יותר מהגובה כדי לכסות הכל
    backgroundColor: colors.lime[200],
    position: 'absolute',
    top: -10,
    right: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});
