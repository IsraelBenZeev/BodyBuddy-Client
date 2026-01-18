// import { colors } from "@/colors";
// import { useDeleteWorkoutPlan } from "@/src/hooks/useWorkout";
// import { useWorkoutStore } from "@/src/store/workoutsStore";
// import { WorkoutPlan } from "@/src/types/workout";
// import Loading from "@/src/ui/Loading";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AntDesign from '@expo/vector-icons/AntDesign';
// import { useRouter } from "expo-router";
// import { ReactNode, useEffect, useState } from "react";
// import { Text, TouchableOpacity, View } from "react-native";
// import Feather from '@expo/vector-icons/Feather';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
// import Success from "@/src/ui/Animations/Success";
// const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

// const Button = ({ text, onPress, icon }: { text: string, onPress: () => void, icon: ReactNode }) => {
//     return (
//         <View className="flex-col items-center" >
//             <TouchableOpacity
//                 onPress={onPress}
//                 style={{ backgroundColor: colors.background[900] }}
//                 className="p-2 rounded-full"
//             >
//                 {icon}
//             </TouchableOpacity>
//             <Text className="text-lime-500 text-xs">{text}</Text>
//         </View >
//     )
// }
// const Buttons = ({ plan }: { plan: WorkoutPlan }) => {
//     const router = useRouter();
//     const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
//     const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
//     const { mutateAsync: deleteWorkoutPlanMutation, isPending: deletePending, isSuccess: deleteSuccess } = useDeleteWorkoutPlan(user_id)
//     const [isShowButtonOkDelete, setIsShowButtonOkDelete] = useState<boolean>(false)
//     const onDelete = (id: string) => {
//         setIsShowButtonOkDelete(prev => !prev)
//         // deleteWorkoutPlanMutation(id);
//     }
//     useEffect(() => {
//         if (deleteSuccess) {
//             // setIsShowButtonOkDelete(false)
//             // router.reload()
//         }
//     }, [deleteSuccess])
//     if (isShowButtonOkDelete) {
//         return (
//             <Animated.View
//                 entering={SlideInRight.duration(700).springify()}
//                 exiting={SlideOutRight.duration(700).springify()}
//                 style={{
//                     position: 'absolute',
//                     bottom: -80,
//                     left: 0,
//                     right: 0,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: 20,
//                     // backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                     borderRadius: 20,
//                 }}
//                 className="flex-row w-full"
//             >
//                 <View className="flex-row items-center gap-6">
//                     <TouchableOpacity onPress={() => deleteWorkoutPlanMutation(plan?.id as string)}>
//                         <View className={`flex-row items-center order  rounded-full p-2 ${deletePending ? 'opacity-50 ' : 'border border-lime-500'}`}>
//                             {/* {deletePending ? <Loading size="small" /> : <AntDesign name="check" size={16} color={colors.lime[500]} />} */}
//                             <Success
//                                 isLoading={deletePending}
//                                 isSuccess={deleteSuccess}
//                                 size={16}
//                                 color={colors.lime[500]}
//                                 onPress={() => onDelete}
//                                 icon={<AntDesign name="check" size={16} color={colors.lime[500]} />}



//                             />
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => setIsShowButtonOkDelete(false)}>
//                         <View className="flex-row items-center bd rounded-full p-2">
//                             <AntDesign name="close" size={16} color="red" />
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//                 <Text className="text-lime-500 text-xl font-semibold">האם למחוק?</Text>
//             </Animated.View>
//         )
//     }
//     return (
//         <View
//             style={{
//                 position: 'absolute',
//                 bottom: -80,
//                 left: 0,
//                 right: 0,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: 25,
//                 // backgroundColor: 'rgba(255, 255, 255, 0.0)',
//                 borderRadius: 20,
//             }}
//             className="flex-row"
//         >
//             <Button
//                 text="מחק"
//                 onPress={() => {
//                     console.log("plan id for delete ", plan?.title);
//                     onDelete(plan?.id as string)
//                 }}
//                 icon={<MaterialCommunityIcons name="trash-can-outline" size={26} color={colors.lime[500]} />}
//             />
//             <Button
//                 text="ערוך"
//                 onPress={() => {
//                     clearAllExercises();
//                     toggleExercise(plan?.exercise_ids as string[])
//                     router.push({
//                         pathname: '/form_create_Workout/[mode]',
//                         params: { mode: 'edit', workout_plan_id: plan?.id },
//                     });
//                 }}
//                 icon={<MaterialCommunityIcons name="pencil-outline" size={26} color={colors.lime[500]} />}
//             />
//             <Button
//                 text="שתף"
//                 onPress={() => {

//                 }}
//                 icon={<Feather name="share" size={26} color={colors.lime[500]} />}
//             />
//             <Button
//                 text="שכפל"
//                 onPress={() => {

//                 }}
//                 icon={<Ionicons name="duplicate-outline" size={26} color={colors.lime[500]} />}
//             />

//         </View>
//     )
// }
// export default Buttons


import { colors } from "@/colors";
import { useDeleteWorkoutPlan } from "@/src/hooks/useWorkout";
import { useWorkoutStore } from "@/src/store/workoutsStore";
import { WorkoutPlan } from "@/src/types/workout";
import Success from "@/src/ui/Animations/Success";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

const Buttons = ({ plan }: { plan: WorkoutPlan }) => {
    const router = useRouter();
    const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
    const toggleExercise = useWorkoutStore((state) => state.toggleExercise);

    const {
        mutateAsync: deleteWorkoutPlanMutation,
        isPending: deletePending,
        isSuccess: deleteSuccess
    } = useDeleteWorkoutPlan(user_id);

    const [isShowButtonOkDelete, setIsShowButtonOkDelete] = useState<boolean>(false);

    // פונקציה לפתיחת תפריט המחיקה
    const onOpenConfirm = () => {
        setIsShowButtonOkDelete(true);
    };

    if (isShowButtonOkDelete) {
        return (
            <Animated.View
                entering={SlideInRight.duration(700).springify()}
                exiting={SlideOutRight.duration(700).springify()}
                style={{
                    position: 'absolute',
                    bottom: -80,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 20,
                }}
                className="flex-row w-full"
            >
                <View className="flex-row items-center gap-6">
                    {/* שים לב: אין כאן TouchableOpacity עוטף! Success מטפל בלחיצה */}
                    <Success
                        isLoading={deletePending}
                        isSuccess={deleteSuccess}
                        onPress={() => deleteWorkoutPlanMutation(plan?.id as string)}
                        onDone={() => {
                            // הקוד הזה ירוץ *רק אחרי* שה-V סיים להצטייר
                            setIsShowButtonOkDelete(false);
                            router.back();
                        }}
                        size={40} // גודל האנימציה
                        color="lime-500" // שם המחלקה כפי שהרכיב מצפה
                        icon={<AntDesign name="check" size={20} color={colors.background[850]} />}
                    />

                    <TouchableOpacity onPress={() => setIsShowButtonOkDelete(false)}>
                        <View className="flex-row items-center border border-red-500 rounded-full p-2">
                            <AntDesign name="close" size={16} color="red" />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text className="text-lime-500 text-xl font-semibold">האם למחוק?</Text>
            </Animated.View>
        );
    }

    return (
        <View
            style={{
                position: 'absolute',
                bottom: -80,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 25,
            }}
            className="flex-row"
        >
            <Button
                text="מחק"
                onPress={onOpenConfirm}
                icon={<MaterialCommunityIcons name="trash-can-outline" size={26} color={colors.lime[500]} />}
            />
            <Button
                text="ערוך"
                onPress={() => {
                    clearAllExercises();
                    toggleExercise(plan?.exercise_ids as string[]);
                    router.push({
                        pathname: '/form_create_Workout/[mode]',
                        params: { mode: 'edit', workout_plan_id: plan?.id },
                    });
                }}
                icon={<MaterialCommunityIcons name="pencil-outline" size={26} color={colors.lime[500]} />}
            />
            <Button
                text="שתף"
                onPress={() => { }}
                icon={<Feather name="share" size={26} color={colors.lime[500]} />}
            />
            <Button
                text="שכפל"
                onPress={() => { }}
                icon={<Ionicons name="duplicate-outline" size={26} color={colors.lime[500]} />}
            />
        </View>
    );
};

// קומפוננטת העזר שלך (ללא שינוי)
const Button = ({ text, onPress, icon }: { text: string, onPress: () => void, icon: ReactNode }) => {
    return (
        <View className="flex-col items-center">
            <TouchableOpacity
                onPress={onPress}
                style={{ backgroundColor: colors.background[900] }}
                className="p-2 rounded-full"
            >
                {icon}
            </TouchableOpacity>
            <Text className="text-lime-500 text-xs">{text}</Text>
        </View>
    );
};

export default Buttons;