// import { WorkoutPlan } from "@/src/types/workout";
// import AppButton from "@/src/ui/PressableOpacity";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
// import { ScrollView, Text, useWindowDimensions, View } from "react-native";
// import { View as AnimatedView } from "react-native-animatable";
// import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// import ModalBottom from "@/src/ui/ModalButtom";
// import CardWorkouPlan from "./CardWorkouPlan";
// import Graphs from "./Graphs";
// import History from "./History";
// import SessionInformation from "./SessionInformation";
// import ListExercise from "../../form/ListExercises";
// import TabsManager from "@/src/Features/exercises/TabsMenager";
// import ExercisesProgress from "../../review/ExercisesProgress";
// interface Props {
//     workoutPlan: WorkoutPlan;
//     setIsStart: Dispatch<SetStateAction<boolean>>;
// }
// const ReviewWorkoutPlan = ({ workoutPlan, setIsStart }: Props) => {
//     const sheetRef = useRef<any>(null);

//     const { height } = useWindowDimensions();
//     const [selectedSession, setSelectedSession] = useState<string>("");
//     useEffect(() => {
//         if (selectedSession && selectedSession !== "") {
//             setTimeout(() => {
//                 sheetRef.current?.snapToIndex(1);
//             }, 50);
//         }
//     }, [selectedSession]);
//     return (
//         <Animated.View className="flex-1"
//             entering={FadeIn.duration(600)} // משך זמן הכניסה במילי-שניות
//             exiting={FadeOut.duration(400)}  // משך זמן היציאה
//         >
//             <ScrollView className="">
//                 <AnimatedView
//                     animation="fadeInUp"
//                     duration={800}
//                     className="px-4 mt-4"
//                     style={{ maxHeight: height * 0.45 }}
//                 >
//                     <Text className="text-zinc-400 text-right mb-2 font-bold mr-2">תרגילים באימון</Text>
//                     <ListExercise
//                         key={workoutPlan?.exercise_ids?.join(',')}
//                         mode="preview"
//                         selectExercisesIds={workoutPlan?.exercise_ids}
//                     />
//                 </AnimatedView>
//                 <CardWorkouPlan workoutPlan={workoutPlan} />
//                 <TabsManager
//                     tabs={[
//                         { title: 'היסטוריה', Component: <History workoutPlanId={workoutPlan.id as string} setSelectedSession={setSelectedSession} selectedSession={selectedSession} sheetRef={sheetRef} /> },
//                         // { title: 'התקדמות', Component: <Graphs workoutPlanId={workoutPlan.id as string} /> },
//                         { title: 'התקדמות', Component: <ExercisesProgress workoutPlanId={workoutPlan.id as string} /> },
//                     ]}
//                 />
//             </ScrollView>
//             <View
//                 style={{ opacity: selectedSession ? 0 : 1 }}
//                 pointerEvents={selectedSession ? 'none' : 'auto'}
//                 className="absolute bottom-10 left-0 right-0 px-10"
//             >
//                 <AppButton
//                     onPress={() => setIsStart(true)}
//                     className="bg-lime-500 w-full py-4 rounded-2xl flex-row justify-center items-center shadow-2xl"
//                     haptic="medium"
//                     animationType="both"
//                 >
//                     <Text className="text-black font-black text-xl mr-2">התחל אימון</Text>
//                     <MaterialCommunityIcons name="play" size={28} color="black" />
//                 </AppButton>
//             </View>
//             <ModalBottom
//                 key={selectedSession}
//                 ref={sheetRef}
//                 title="פרטי האימון"
//                 initialIndex={-1}
//                 minHeight="50%"
//                 maxHeight="90%"
//                 enablePanDownToClose={true}
//                 onClose={() => setSelectedSession("")}
//             >
//                 <SessionInformation sessionId={selectedSession} />
//             </ModalBottom>
//         </Animated.View>
//     );
// };

// export default ReviewWorkoutPlan;