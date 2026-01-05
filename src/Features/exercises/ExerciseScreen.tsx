// import { colors } from '@/colors';
// import { Exercise, FetchExercisesResponse } from '@/src/types';
// import BackGround from '@/src/ui/BackGround';
// import ButtonBack from '@/src/ui/ButtonBack';
// import IconButton from '@/src/ui/IconButton';
// import {
//   IconAddToListFitness,
//   IconDislikeBG,
//   IconlikeBG,
//   IconSearchGoogle,
//   IconSecondaryMuscle,
//   IconsFitnessTools,
//   IconShare,
//   IconTargetMuscle,
// } from '@/src/ui/IconsSVG';
// import ModalButtom from '@/src/ui/ModalButtom';
// import { useQueryClient } from '@tanstack/react-query';
// import { Image } from 'expo-image';
// import { useRef } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
//   const sheetRef = useRef<any>(null);
//   const queryClient = useQueryClient();
//   const findExerciseInCache = () => {
//     const allQueries = queryClient.getQueriesData<FetchExercisesResponse>({
//       queryKey: ['exercises'],
//     });
//     for (const [queryKey, queryData] of allQueries) {
//       const found = queryData?.exercises?.find((ex: Exercise) => ex.exerciseId === exerciseId);
//       if (found) {
//         return found;
//       }
//     }
//     return null;
//   };
//   const exercise = findExerciseInCache() as Exercise | null;
//   console.log('exerciseId: ', exerciseId);

//   return (
//     <BackGround>
//       <View className="items-center w-full ">
//         <View className="flex-row items-center justify-between w-full  px-2">
//           <Image
//             style={{ width: 40, height: 40, borderRadius: 20 }}
//             source={require('../../../assets/images/user.png')}
//             contentFit="cover"
//             className=""
//           />
//           <ButtonBack />
//         </View>
//         <View className="">
//           <Text className="text-lime-500 text-3xl font-bold text-center">{exercise?.name_he}</Text>
//         </View>
//         <View
//           style={styles.imageContainer}
//           className="w-80 h-80  bg-white overflow-hidden rounded-md"
//         >
//           <Image
//             style={styles.image}
//             source={exercise?.gifUrl}
//             contentFit="contain"
//             transition={500}
//             cachePolicy={'disk'}
//             className=""
//           />
//         </View>
//         <View
//           style={{ marginTop: 16, width: '95%' }}
//           className="flex-row justify-center gap-8 px-4"
//         >
//           <IconButton text="סמן כאהבתי" classNameText="text-white text-sm">
//             <IconlikeBG size={22} color={colors.lime[500]} />
//           </IconButton>
//           <IconButton text="לא אהבתי" classNameText="text-white text-sm">
//             <IconDislikeBG size={22} color={colors.lime[500]} />
//           </IconButton>
//           <IconButton text="שתף לחברים" classNameText="text-white text-sm">
//             <IconShare size={22} color={colors.lime[500]} />
//           </IconButton>
//           <IconButton text="הוסף לרשימה" classNameText="text-white text-sm">
//             <IconAddToListFitness size={22} color={colors.lime[500]} />
//           </IconButton>
//           <IconButton text="חפש בגוגל" classNameText="text-white text-sm">
//             <IconSearchGoogle size={22} color={colors.lime[500]} />
//           </IconButton>
//         </View>
//         <View style={styles.sectionInfo}>
//           <View className="flex-row gap-2 items-center ">
//             <Text className="text-lime-500 text-lg font-semibold">
//               שרירים עיקריים: {exercise?.targetMuscles_he}
//             </Text>
//             <View style={styles.bgIcon} className="rounded-full p-1">
//               <IconTargetMuscle size={18} color={colors.lime[500]} className="" />
//             </View>
//           </View>
//           <View className="flex-row flex-wrap gap-2 items-center ">
//             {/* <Text className="text-lime-500 text-lg font-semibold"> */}
//             <Text className="text-lime-500 text-lg flex-wrap flex-1 text-right">
//               שרירים מסייעים:{' '}
//               {exercise?.secondaryMuscles_he.map((muscle: string) => (
//                 <Text
//                   className="txt-lg"
//                   style={{ color: colors.lime[500], textAlign: 'right' }}
//                   key={muscle}
//                 >
//                   {muscle}
//                   {', '}
//                 </Text>
//               ))}
//             </Text>
//             <View style={styles.bgIcon} className="rounded-full p-1">
//               <IconSecondaryMuscle size={18} color={colors.lime[500]} />
//             </View>
//           </View>
//           <View className="flex-row gap-2 items-center ">
//             <Text className="text-lime-500 text-lg font-semibold">
//               אביזרים: {exercise?.equipments_he}
//             </Text>
//             <View style={styles.bgIcon} className="rounded-full p-1">
//               <IconsFitnessTools size={18} color={colors.lime[500]} />
//             </View>
//           </View>
//         </View>
//       </View>
//       <ModalButtom
//         ref={sheetRef}
//         InitialIndex={1}
//         minimumView="7%"
//         initialView="20%"
//         title="הוראות"
//       >
//         <View className="px-2 py-1">
//           {exercise?.instructions_he.map((el: string, i) => (
//             <View style={styles.rowInstruction} key={i}>
//               <Text style={{ color: colors.lime[50], fontSize: 16, textAlign: 'right' }} key={i}>
//                 {i + 1}
//                 {') '}
//                 {el}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </ModalButtom>
//     </BackGround>
//   );
// };

// export default ExerciseScreen;
// const styles = StyleSheet.create({
//   imageContainer: {
//     justifyContent: 'space-around',
//     width: '99%',
//     borderWidth: 2,
//     // borderColor: colors.lime[500],
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 8,
//     marginHorizontal: 1,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderColor: colors.lime[500],
//   },
//   sectionInfo: {
//     // borderWidth: 2,
//     borderColor: colors.lime[500],
//     borderRadius: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.038)',
//     marginTop: 50,
//     padding: 4,
//     width: '95%',
//     gap: 8,
//     alignItems: 'flex-end',
//   },
//   bgIcon: {
//     backgroundColor: colors.lime[50],
//   },
//   rowInstruction: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: colors.lime[500],
//     backgroundColor: colors.lime[800],
//     borderRadius: 8,
//     padding: 8,
//     marginVertical: 4,
//     color: 'white',
//   },
// });
import { colors } from '@/colors';
import { Exercise, FetchExercisesResponse } from '@/src/types/exercise';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import IconButton from '@/src/ui/IconButton';
import ModalButtom from '@/src/ui/ModalButtom';
import {
  IconAddToListFitness,
  IconDislikeBG,
  IconlikeBG,
  IconSearchGoogle,
  IconSecondaryMuscle,
  IconsFitnessTools,
  IconShare,
  IconTargetMuscle,
} from '@/src/ui/IconsSVG';

const ExerciseScreen = ({ exerciseId }: { exerciseId: string }) => {
  const sheetRef = useRef<any>(null);
  const queryClient = useQueryClient();

  const findExerciseInCache = () => {
    const allQueries = queryClient.getQueriesData<FetchExercisesResponse>({
      queryKey: ['exercises'],
    });
    for (const [queryKey, queryData] of allQueries) {
      const found = queryData?.exercises?.find((ex: Exercise) => ex.exerciseId === exerciseId);
      if (found) return found;
    }
    return null;
  };

  const exercise = findExerciseInCache() as Exercise | null;

  return (
    <BackGround>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - פרופיל וכפתור חזור */}
        <View className="flex-row items-center justify-between w-full px-6 mt-4 mb-6">
          <Image
            style={styles.userAvatar}
            source={require('../../../assets/images/user.png')}
            contentFit="cover"
          />
          <ButtonBack />
        </View>

        {/* שם התרגיל */}
        <View className="px-6 mb-8 w-full">
          <Text className="text-white text-4xl font-black text-right leading-tight">
            {exercise?.name_he}
          </Text>
          <View className="h-1 w-20 bg-lime-500 rounded-full self-end mt-2" />
        </View>

        {/* קונטיינר התמונה - מראה צף ונקי */}
        <View style={styles.imageWrapper}>
          <Image
            style={styles.mainImage}
            source={exercise?.gifUrl}
            contentFit="contain"
            transition={500}
            cachePolicy={'disk'}
          />
        </View>

        {/* שורת כפתורי פעולה */}
        <View className="flex-row justify-center gap-4 px-4 my-8 w-full">
          {[
            { icon: <IconlikeBG size={20} color={colors.lime[500]} />, text: 'אהבתי' },
            { icon: <IconDislikeBG size={20} color={colors.lime[500]} />, text: 'לא אהבתי' },
            { icon: <IconShare size={20} color={colors.lime[500]} />, text: 'שתף' },
            { icon: <IconAddToListFitness size={20} color={colors.lime[500]} />, text: 'הוסף' },
            { icon: <IconSearchGoogle size={20} color={colors.lime[500]} />, text: 'גוגל' },
          ].map((btn, i) => (
            <IconButton
              key={i}
              text={btn.text}
              classNameText="text-zinc-500 text-[10px] mt-1 font-medium"
            >
              <View style={styles.actionButtonInner}>{btn.icon}</View>
            </IconButton>
          ))}
        </View>

        {/* כרטיסיות מידע */}
        <View style={styles.infoSection}>
          {/* פריט מידע: שריר מטרה */}
          <View style={styles.infoRow}>
            <View className="flex-1 pr-4">
              <Text style={styles.infoLabel}>שריר עיקרי</Text>
              <Text style={styles.infoValue}>{exercise?.targetMuscles_he}</Text>
            </View>
            <View style={styles.iconCircle}>
              <IconTargetMuscle size={20} color="black" />
            </View>
          </View>

          {/* פריט מידע: שרירים מסייעים */}
          <View style={styles.infoRow}>
            <View className="flex-1 pr-4">
              <Text style={styles.infoLabel}>שרירים מסייעים</Text>
              <Text style={styles.infoValue}>{exercise?.secondaryMuscles_he.join(', ')}</Text>
            </View>
            <View style={styles.iconCircle}>
              <IconSecondaryMuscle size={20} color="black" />
            </View>
          </View>

          {/* פריט מידע: ציוד */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View className="flex-1 pr-4">
              <Text style={styles.infoLabel}>ציוד נדרש</Text>
              <Text style={styles.infoValue}>{exercise?.equipments_he}</Text>
            </View>
            <View style={styles.iconCircle}>
              <IconsFitnessTools size={20} color="black" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* הוראות ב-Bottom Sheet */}
      <ModalButtom ref={sheetRef} InitialIndex={1} title="איך מבצעים?" initialView='6%'>
        <View className="px-5 py-4 w-full ">
          {exercise?.instructions_he.map((step, i) => (
            <View key={i} style={styles.instructionStep}>
              <View className="bg-lime-500 w-6 h-6 rounded-full items-center justify-center ml-3">
                <Text className="font-bold text-black text-xs">{i + 1}</Text>
              </View>
              <Text className="text-zinc-300 flex-1 text-right text-base leading-6">{step}</Text>
            </View>
          ))}
        </View>
      </ModalButtom>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.lime[500],
  },
  imageWrapper: {
    width: '90%',
    height: 320,
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 15,
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  actionButtonInner: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoSection: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconCircle: {
    backgroundColor: colors.lime[500],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#71717a', // zinc-400
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  instructionStep: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#18181b',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
});

export default ExerciseScreen;
