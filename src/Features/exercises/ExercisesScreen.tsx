// import { colors } from '@/colors';
// import { useExercises } from '@/src/hooks/useEcercises';
// import { partsBodyHebrew } from '@/src/types';
// import BackGround from '@/src/ui/BackGround';
// import ButtonBack from '@/src/ui/ButtonBack';
// import { ButtonAddFavorit, ButtonRemoveFavorit } from '@/src/ui/ButtonsFavorit';
// import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// interface ExercisesScreenProps {
//   bodyPart: string | string[] | undefined;
//   page?: string | string[] | undefined;
// }
// const ExercisesScreen = ({ bodyPart, page }: ExercisesScreenProps) => {
//   const { data, isLoading } = useExercises(bodyPart as string, parseInt(page as string, 10));
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const router = useRouter();
//   return (
//     <BackGround>
//       <View className="flex-row items-center justify-between w-full  px-2">
//         <Image
//           style={{ width: 40, height: 40, borderRadius: 20 }}
//           source={require('../../../assets/images/user.png')}
//           contentFit="cover"
//           className=""
//         />
//         <ButtonBack />
//       </View>
//       <Text className="text-white font-bold text-5xl mb-6 text-center">
//         {typeof bodyPart === 'string'
//           ? partsBodyHebrew[bodyPart as keyof typeof partsBodyHebrew]
//           : ''}
//       </Text>

//       <FlatList
//         // numColumns={2}
//         // columnWrapperStyle={{ justifyContent: 'space-around', gap: 0 }}
//         data={data?.exercises || []}
//         renderItem={({ item }) => (
//           <View
//             style={styles.callomnWrapper}
//             className="flex-row gap-4 mb-3 items-center justify-center"
//           >
//             <View className="items-center justify-center">
//               <Text className="text-white text-lg mb-2 w-52 text-center" style={styles.textBig}>
//                 {item.name_he}
//               </Text>
//               <Text className="text-white text-lg mb-2 w-52 text-center" style={styles.textSmall}>
//                 {/* {item.bodyParts_he.map((muscle) => muscle).join(', ')}
//                 {', '} */}
//                 {item.targetMuscles_he.map((muscle) => muscle).join(', ')}
//                 {/* {item.targetMuscles_he[0]} */}
//               </Text>
//             </View>
//             <View className="w-32 h-32 rounded-md overflow-hidden ">
//               <TouchableOpacity
//                 onPress={() => {
//                   router.push({
//                     pathname: '/exercise/[exerciseId]',
//                     params: { exerciseId: item.exerciseId },
//                   });
//                 }}
//               >
//                 <Image
//                   source={item.gifUrl}
//                   style={styles.image}
//                   contentFit="contain"
//                   transition={500}
//                   cachePolicy={'disk'}
//                   className=""
//                 />
//               </TouchableOpacity>
//             </View>
//             <Pressable
//               className="absolute top-0 left-0"
//               onPress={() => {
//                 console.log(item.exerciseId, item.name_he, 'presessed favorite');
//                 if (favorites.includes(item.exerciseId)) {
//                   setFavorites(favorites.filter((id) => id !== item.exerciseId));
//                 } else {
//                   setFavorites([...favorites, item.exerciseId]);
//                 }
//               }}
//             >
//               {favorites.includes(item.exerciseId) ? <ButtonRemoveFavorit /> : <ButtonAddFavorit />}
//             </Pressable>
//           </View>
//         )}
//         keyExtractor={(item) => item.exerciseId.toString()}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />
//     </BackGround>
//   );
// };
// export default ExercisesScreen;
// const styles = StyleSheet.create({
//   callomnWrapper: {
//     justifyContent: 'space-around',
//     width: '99%',
//     borderWidth: 2,
//     borderColor: colors.lime[500],
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 12,
//     padding: 8,
//     marginHorizontal: 1,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     // borderRadius: 8,
//     // borderRightWidth: 4,
//     // borderColor: 'red',
//   },
//   textBig: {
//     textAlign: 'center',
//     backgroundColor: colors.lime[500],
//     borderRadius: 8,
//     // paddingVertical: 4,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   textSmall: {
//     textAlign: 'center',
//     // backgroundColor: colors.lime[300],
//     borderRadius: 8,
//     // paddingVertical: 4,
//     fontSize: 12,
//     // fontWeight: '600',
//   },
// });
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/colors';

// Hooks & Types
import { useExercises } from '@/src/hooks/useEcercises';
import { partsBodyHebrew, Exercise } from '@/src/types';

// UI Components
import BackGround from '@/src/ui/BackGround';
import ButtonBack from '@/src/ui/ButtonBack';
import { ButtonAddFavorit, ButtonRemoveFavorit } from '@/src/ui/ButtonsFavorit';

interface ExercisesScreenProps {
  bodyPart: string | string[] | undefined;
  page?: string | string[] | undefined;
}

const ExercisesScreen = ({ bodyPart, page }: ExercisesScreenProps) => {
  const { data, isLoading } = useExercises(bodyPart as string, parseInt(page as string, 10));
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: '/exercise/[exerciseId]',
        params: { exerciseId: item.exerciseId },
      })}
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
        <Pressable 
          style={styles.favoriteBadge}
          onPress={() => toggleFavorite(item.exerciseId)}
        >
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

  return (
    <BackGround>
      {/* Header */}
      <View className="flex-row items-center justify-between w-full px-6 pt-4 mb-4">
        <Image
          style={styles.avatar}
          source={require('../../../assets/images/user.png')}
          contentFit="cover"
        />
        <ButtonBack />
      </View>

      {/* כותרת קטגוריה */}
      <View className="px-6 mb-6">
        <Text className="text-lime-50 text-right text-sm font-bold uppercase tracking-widest">
          מתאמן על
        </Text>
        <Text className="text-white font-black text-5xl text-right">
          {typeof bodyPart === 'string' ? partsBodyHebrew[bodyPart as keyof typeof partsBodyHebrew] : ''}
        </Text>
      </View>

      <FlatList
        data={data?.exercises || []}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.exerciseId}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        // אפקט כניסה נקי
        initialNumToRender={10}
      />
    </BackGround>
  );
};

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

export default ExercisesScreen;