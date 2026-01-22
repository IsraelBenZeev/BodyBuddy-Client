import { colors } from '@/colors';
import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { WorkoutPlan } from '@/src/types/workout';
import Success from '@/src/ui/Animations/Success';
import { IconAddToList, IconsFitnessTools } from '@/src/ui/IconsSVG';
import Loading from '@/src/ui/Loading';
import AppButtonhaptic from '@/src/ui/PressableOpacity';
import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Card from './Card';
import AppButton from '@/src/ui/PressableOpacity';

const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
interface PlansSelectorProps {
    idExercise: string;
    setIsShowListWorkoutsPlans: (value: boolean) => void;
}

const PlanSelector = ({ idExercise, setIsShowListWorkoutsPlans }: PlansSelectorProps) => {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
    const { mutateAsync: addExerciseToPlan, isPending: isPendingAddExerciseToPlan, isSuccess: isSuccessAddExerciseToPlan } = useAddExerciseToPlan(userID);
    const handleAnimationFinish = () => {
        setIsShowListWorkoutsPlans(false);
        setSelectedIds([]);
    };
    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };
    const handleSave = () => {
        if (selectedIds.length === 0) return;
        addExerciseToPlan({ idExercise, planIds: selectedIds });

    };

    if (isLoadingPlans) {
        return <Loading />;
    }



    return (
        <View
            // style={{ height: height }}
            className='flex-1 bg-background-850 rounded-3xl relative overflow-hidden'>
            <View
                className='bg-background-850 flex-row items-center justify-between relative gap-6 self-end mr-2'>
                {!!plansData?.length && <Text className='text-center text-xl font-bold text-lime-500 mb-2'>בחר תוכנית</Text>}
                <AppButton
                    onPress={() => setIsShowListWorkoutsPlans(false)}
                    haptic="light"
                    animationType="both"
                    className="bg-background-500 rounded-full border border-zinc-700"
                >
                    <X color={colors.lime[500]} strokeWidth={3} size={18} />
                </AppButton>
            </View>
            <View style={{}} className="mt-4 h-[80%]">
                {plansData?.length ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 8, // רווח מהצדדים של המסך
                            paddingTop: 10,
                            paddingBottom: 20,    // רווח גדול למטה כדי שהכפתור הצף לא יסתיר את הכרטיס האחרון
                            gap: 16                // רווח בין הכרטיסים
                        }}
                        className="flex-1"
                    >
                        {plansData?.map((plan: any) => (
                            <Card
                                key={plan.id}
                                plan={plan as WorkoutPlan}
                                selectedIds={selectedIds}
                                toggleSelection={toggleSelection}
                            />
                        ))}
                    </ScrollView>
                    :
                    <View className="mt-4 h-[80%] flex-1 items-center justify-center">
                        <View className="bg-background-800 p-8 rounded-full mb-6 opacity-80">
                            <IconsFitnessTools size={40} color={colors.lime[500]} />
                        </View>
                        <View className=''>
                            <Text className="text-white text-md font-semibold text-center mb-2">
                                עדיין אין לך תוכניות אימון
                            </Text>
                            <Text className="text-gray-400 text-center mb-8 text-sm">
                                זה הזמן ליצור את האימון הראשון שלך ולהתחיל להתקדם למטרה!
                            </Text>

                        </View>
                        <AppButtonhaptic
                            animationType='both'
                            haptic="light"
                            onPress={() => {
                                router.replace("/(tabs)/workouts");
                                setIsShowListWorkoutsPlans(false);
                            }}
                            className="bg-lime-500 flex-row items-center px-8 py-4 rounded-2xl shadow-lg"
                        >
                            <Text className="text-background-900 font-bold text-lg mr-2">
                                עבור ליצירת תוכנית
                            </Text>
                            <IconAddToList color={colors.background[900]} size={24} />
                        </AppButtonhaptic>
                    </View>
                }
            </View>
            {!!plansData?.length && (
                <View className="absolute bottom-2 left-8 items-center z-[999]" style={{ elevation: 10 }}>
                    <Success
                        onPress={handleSave}                        // הפונקציה ששומרת
                        isLoading={isPendingAddExerciseToPlan}      // מצב טעינה
                        isSuccess={isSuccessAddExerciseToPlan}      // מצב הצלחה
                        onDone={handleAnimationFinish}              // מה קורה כשהאנימציה נגמרת
                        size={40}                                   // גודל האנימציה
                        icon={<Check size={20} color={colors.background[850]} strokeWidth={3} />}
                    />
                </View>

            )}
        </View>
    );
};

export default PlanSelector;



// import { colors } from '@/colors';
// import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
// import { WorkoutPlan } from '@/src/types/workout';
// import Success from '@/src/ui/Animations/Success';
// import Loading from '@/src/ui/Loading';
// import PressableOpacity from '@/src/ui/PressableOpacity';
// import { Check, X } from 'lucide-react-native';
// import { useState } from 'react';
// import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
// import Card from './Card';

// const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
// const CARD_WIDTH = 220; // כרטיסים קצת יותר רחבים למראה מרשים
// const GAP = 16;         // הריווח בין הכרטיסים

// interface PlansSelectorProps {
//     idExercise: string;
//     setIsShowListWorkoutsPlans: (value: boolean) => void;
// }

// const PlanSelector = ({ idExercise, setIsShowListWorkoutsPlans }: PlansSelectorProps) => {
//     const { width } = useWindowDimensions();
//     const [selectedIds, setSelectedIds] = useState<string[]>([]);

//     const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
//     const {
//         mutateAsync: addExerciseToPlan,
//         isPending: isPendingAddExerciseToPlan,
//         isSuccess: isSuccessAddExerciseToPlan
//     } = useAddExerciseToPlan(userID);

//     const toggleSelection = (id: string) => {
//         setSelectedIds(prev =>
//             prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//         );
//     };

//     if (isLoadingPlans) return <View className="flex-1 items-center justify-center"><Loading /></View>;

//     return (
//         <View className='flex-1 bg-background-850 rounded-[40px] border border-white/5'>

//             {/* Header */}
//             <View className="flex-row items-center justify-between px-8 pt-8 pb-6">
//                 <PressableOpacity
//                     onPress={() => setIsShowListWorkoutsPlans(false)}
//                     className="w-10 h-10 rounded-full bg-background-800 items-center justify-center border border-zinc-700/40"
//                 >
//                     <X color={colors.background[800]} size={18} />
//                 </PressableOpacity>

//                 <View className="items-end">
//                     <Text className="text-zinc-500 text-[10px] font-bold tracking-[2px] uppercase">Add to Plan</Text>
//                     <Text className="text-lime-500 text-2xl font-black italic">בחר אימון</Text>
//                 </View>
//             </View>

//             {/* Scrollable Content */}
//             <View className="flex-1 justify-center">
//                 <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     snapToInterval={CARD_WIDTH + GAP}
//                     decelerationRate="fast"
//                     disableIntervalMomentum={true}
//                     contentContainerStyle={{
//                         paddingHorizontal: sidePadding,
//                         gap: GAP,
//                         alignItems: 'center',
//                         paddingBottom: 20
//                     }}
//                 >
//                     {/* הוספת בדיקה ש-plansData קיים וביצוע casting ל-item */}
//                     {plansData && plansData.map((item: any) => (
//                         <View key={item.id} style={{ width: CARD_WIDTH }}>
//                             <Card
//                                 plan={item as WorkoutPlan} // כאן אנחנו אומרים ל-TS לסמוך עלינו
//                                 isActive={true}
//                                 selectedIds={selectedIds}
//                                 toggleSelection={toggleSelection}
//                             />
//                         </View>
//                     ))}
//                 </ScrollView>
//             </View>

//             {/* Footer */}
//             <View className="px-8 pb-10 flex-row items-center justify-between">
//                 <View className="bg-background-800 px-4 py-2 rounded-2xl border border-white/5">
//                     <Text className="text-zinc-400 text-xs font-medium italic">
//                         SELECTED: <Text className="text-lime-500 font-bold">{selectedIds.length}</Text>
//                     </Text>
//                 </View>

//                 <View className="shadow-2xl shadow-lime-500/40">
//                     <Success
//                         onPress={() => addExerciseToPlan({ idExercise, planIds: selectedIds })}
//                         isLoading={isPendingAddExerciseToPlan}
//                         isSuccess={isSuccessAddExerciseToPlan}
//                         onDone={() => {
//                             setIsShowListWorkoutsPlans(false);
//                             setSelectedIds([]);
//                         }}
//                         size={56}
//                         color={selectedIds.length > 0 ? colors.lime[500] : colors.background[800]}
//                         icon={
//                             <View className="w-14 h-14 items-center justify-center rounded-2xl bg-lime-500 shadow-inner">
//                                 <Check size={30} color={colors.background[950]} strokeWidth={3} />
//                             </View>
//                         }
//                     />
//                 </View>
//             </View>
//         </View>
//     );
// };