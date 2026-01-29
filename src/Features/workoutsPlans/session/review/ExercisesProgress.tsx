// import { useGetExercisesByIds } from "@/src/hooks/useEcercises";
// import { useGetExercisesIdsByWorkoutPlans } from "@/src/hooks/useWorkout";
// import Accordion from "@/src/ui/Accordion";
// import Loading from "@/src/ui/Loading";
// import { Image } from "expo-image";
// import { useMemo } from "react";
// import { Text, View } from "react-native";
// interface Props {
//     workoutPlanId: string;
// }
// const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
// const ExercisesProgress = ({ workoutPlanId }: Props) => {
//     const { data: exercisesLog, isPending } = useGetExercisesIdsByWorkoutPlans(workoutPlanId, user_id);
//     const { data: exercisesDetails, isPending: isPendingDetails } = useGetExercisesByIds(exercisesLog?.map((log) => log.exercise_id) || []);
//     const processedExercises = useMemo(() => {
//         if (!exercisesLog) return [];

//         const grouped: Record<string, any> = {};

//         exercisesLog.forEach((log) => {
//             const id = log.exercise_id;
//             if (!grouped[id]) {
//                 grouped[id] = {
//                     id: id, // <--- חובה להוסיף את זה כדי שנוכל לחפש אותו אחר כך!
//                     maxWeight: 0,
//                     maxReps: 0,
//                     maxSetsInOneSession: {},
//                     allLogs: [],
//                 };
//             }

//             if (log.weight > grouped[id].maxWeight) grouped[id].maxWeight = log.weight;
//             if (log.reps > grouped[id].maxReps) grouped[id].maxReps = log.reps;

//             const sessionId = log.session_id;
//             grouped[id].maxSetsInOneSession[sessionId] = (grouped[id].maxSetsInOneSession[sessionId] || 0) + 1;
//             grouped[id].allLogs.push(log);
//         });

//         return Object.values(grouped).map(ex => ({
//             ...ex,
//             maxSetsRecord: Math.max(...Object.values(ex.maxSetsInOneSession) as number[]),
//         }));
//     }, [exercisesLog]);

//     if (isPending || (isPendingDetails && exercisesLog ? exercisesLog?.length > 0 : false)) return <Loading />;

//     return (
//         <View className="pb-20 px-4">
//             <Text className="text-white text-xl font-bold mb-6 text-right">התקדמות בתרגילים</Text>

//             {processedExercises.map((exercise: any, index: number) => {
//                 const exerciseDetails = exercisesDetails?.find((detail: any) =>
//                     (detail.id === exercise.id) || (detail.exerciseId === exercise.id)
//                 );
//                 console.log("exerciseDetails id", exerciseDetails?.exerciseId);
//                 console.log("exercise id", exercise.id);

//                 if (exercise.maxReps === 0) {
//                     return (
//                         <View key={exercise.id} className="flex-1 mr-4">
//                             <Text
//                                 className="text-white font-bold text-lg text-right"
//                                 numberOfLines={1} // מגביל לשורה אחת
//                                 ellipsizeMode="tail" // מוסיף את ה-3 נקודות בסוף (...)
//                             >
//                                 {exerciseDetails?.name_he}
//                             </Text>
//                         </View>
//                     )
//                 }
//                 return (
//                     <Accordion
//                         key={exercise.id}
//                         title={
//                             <View className="flex-row justify-between items-center w-full">
//                                 <View className="flex-1 mr-4">
//                                     <Text
//                                         className="text-white font-bold text-lg text-right"
//                                         numberOfLines={1} // מגביל לשורה אחת
//                                         ellipsizeMode="tail" // מוסיף את ה-3 נקודות בסוף (...)
//                                     >
//                                         {exerciseDetails?.name_he}
//                                     </Text>
//                                 </View>
//                                 <View className="shrink-0 h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden">
//                                     {imageUri ? (
//                                         <Image
//                                             source={{ uri: imageUri }}
//                                             className="w-12 h-12"
//                                             contentFit="cover"
//                                             transition={200}
//                                         />
//                                     ) : (
//                                         <View className="w-12 h-12 bg-zinc-700 items-center justify-center" />
//                                     )}
//                                     {/* <Text className="text-lime-500 text-xs">
//                                         שיא: {exercise.maxWeight} ק"ג
//                                     </Text> */}
//                                 </View>
//                             </View>
//                         }
//                     >
//                         <View className="py-2">
//                             {/* כאן יבוא הגרף בעתיד */}
//                             <View className="bg-zinc-800/50 rounded-2xl p-4 flex-row flex-wrap justify-between">

//                                 <StatItem label="משקל שיא" value={`${exercise.maxWeight} ק"ג`} />
//                                 <StatItem label="חזרות שיא" value={exercise.maxReps.toString()} />
//                                 <StatItem label="שיא סטים" value={exercise.maxSetsRecord.toString()} />
//                                 <StatItem label="סהכ עבודה" value={`${exercise.allLogs.length} סטים בוצעו`} />

//                             </View>
//                         </View>
//                     </Accordion>
//                 )
//             }
//             )}
//         </View>
//     );
// };

// // קומפוננטת עזר קטנה לעיצוב הנתונים
// const StatItem = ({ label, value }: { label: string, value: string }) => (
//     <View className="w-[48%] mb-4 items-end">
//         <Text className="text-zinc-500 text-xs mb-1">{label}</Text>
//         <Text className="text-white font-bold text-base">{value}</Text>
//     </View>
// );
// export default ExercisesProgress;