import { colors } from '@/colors';
import { Exercise, FetchExercisesResponse } from '@/src/types';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import IconButton from '@/src/ui/IconButton';
import {
  IconAddToList,
  IconDislikeBG,
  IconlikeBG,
  IconSearchGoogle,
  IconSecondaryMuscle,
  IconsFitnessTools,
  IconShare,
  IconTargetMuscle,
} from '@/src/ui/IconsSVG';
import ModalButtom from '@/src/ui/ModalButtom';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const sheetRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const findExerciseInCache = () => {
    const allQueries = queryClient.getQueriesData<FetchExercisesResponse>({
      queryKey: ['exercises'],
    });
    for (const [queryKey, queryData] of allQueries) {
      const found = queryData?.exercises?.find((ex: Exercise) => ex.exerciseId === exerciseId);
      if (found) {
        return found;
      }
    }
    return null;
  };
  const exercise = findExerciseInCache() as Exercise | null;
  console.log('exerciseId: ', exerciseId);

  return (
    <BackGround>
      <View className="items-center w-full ">
        <View className="items-center  w-full flex-row flex-row-reverse justify-between px-4 pt-8">
          <Text className="text-lime-500 text-3xl font-bold text-center">{exercise?.name_he}</Text>
          <View className="">
            <ButtonBack />
          </View>
        </View>
        <View
          style={styles.imageContainer}
          className="w-80 h-80  bg-white overflow-hidden rounded-md"
        >
          <Image
            style={styles.image}
            source={exercise?.gifUrl}
            contentFit="contain"
            transition={500}
            cachePolicy={'disk'}
            className=""
          />
        </View>
        <View
          style={{ marginTop: 16, width: '95%' }}
          className="flex-row justify-center gap-8 px-4"
        >
          <IconButton text="סמן כאהבתי" classNameText="text-white text-sm">
            <IconlikeBG size={22} color={'white'} />
          </IconButton>
          <IconButton text="לא אהבתי" classNameText="text-white text-sm">
            <IconDislikeBG size={22} color={'white'} />
          </IconButton>
          <IconButton text="שתף לחברים" classNameText="text-white text-sm">
            <IconShare size={22} color={'white'} />
          </IconButton>
          <IconButton text="הוסף לרשימה" classNameText="text-white text-sm">
            <IconAddToList size={22} color={'white'} />
          </IconButton>
          <IconButton text="חפש בגוגל" classNameText="text-white text-sm">
            <IconSearchGoogle size={22} color={'white'} />
          </IconButton>
        </View>
        <View style={styles.sectionInfo}>
          <View className="flex-row gap-2 items-center ">
            <Text className="text-lime-500 text-lg font-semibold">
              שרירים עיקריים: {exercise?.targetMuscles_he}
            </Text>
            <View style={styles.bgIcon} className="rounded-full p-1">
              <IconTargetMuscle size={18} color={colors.lime[500]} className="" />
            </View>
          </View>
          <View className="flex-row flex-wrap gap-2 items-center ">
            {/* <Text className="text-lime-500 text-lg font-semibold"> */}
            <Text className="text-lime-500 text-lg flex-wrap flex-1 text-right">
              שרירים מסייעים:{' '}
              {exercise?.secondaryMuscles_he.map((muscle: string) => (
                <Text
                  className="txt-lg"
                  style={{ color: colors.lime[500], textAlign: 'right' }}
                  key={muscle}
                >
                  {muscle}
                  {', '}
                </Text>
              ))}
            </Text>
            <View style={styles.bgIcon} className="rounded-full p-1">
              <IconSecondaryMuscle size={18} color={colors.lime[500]} />
            </View>
          </View>
          <View className="flex-row gap-2 items-center ">
            <Text className="text-lime-500 text-lg font-semibold">
              אביזרים: {exercise?.equipments_he}
            </Text>
            <View style={styles.bgIcon} className="rounded-full p-1">
              <IconsFitnessTools size={18} color={colors.lime[500]} />
            </View>
          </View>
        </View>
      </View>
      <ModalButtom ref={sheetRef} InitialIndex={1} initialView="30%" title="הוראות">
        <View className="px-2 py-1">
          {exercise?.instructions_he.map((el: string, i) => (
            <View style={styles.rowInstruction} key={i}>
              <Text style={{ color: colors.lime[50], fontSize: 16, textAlign: 'right' }} key={i}>
                {i + 1}
                {') '}
                {el}
              </Text>
            </View>
          ))}
        </View>
      </ModalButtom>
    </BackGround>
  );
};

export default ExerciseScreen;
const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'space-around',
    width: '99%',
    borderWidth: 2,
    // borderColor: colors.lime[500],
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderColor: colors.lime[500],
  },
  sectionInfo: {
    // borderWidth: 2,
    borderColor: colors.lime[500],
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.038)',
    marginTop: 50,
    padding: 4,
    width: '95%',
    gap: 8,
    alignItems: 'flex-end',
  },
  bgIcon: {
    backgroundColor: colors.lime[50],
  },
  rowInstruction: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lime[500],
    backgroundColor: colors.lime[800],
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    color: 'white',
  },
});
