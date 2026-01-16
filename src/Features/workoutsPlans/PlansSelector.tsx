import { colors } from '@/colors';
import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { WorkoutPlan } from '@/src/types/workout';
import CustomCarousel from '@/src/ui/CustomCarousel';
import Loading from '@/src/ui/Loading';
import PressableOpacity from '@/src/ui/PressableOpacity';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Card from './Card';

const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const {width} = useWindowDimensions();
interface PlansSelectorProps {
    idExercise: string;
    setIsShowListWorkoutsPlans: (value: boolean) => void;
}

const PlanSelector = ({ idExercise, setIsShowListWorkoutsPlans }: PlansSelectorProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
    const { mutateAsync: addExerciseToPlan, isPending: isPendingAddExerciseToPlan, isSuccess: isSuccessAddExerciseToPlan } = useAddExerciseToPlan(userID);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };
    const handleSave = () => {
        if (selectedIds.length === 0) return;
        addExerciseToPlan({ idExercise, planIds: selectedIds });

    };
    useEffect(() => {
        if (isSuccessAddExerciseToPlan) {
            setSelectedIds([]);
            setIsShowListWorkoutsPlans(false);
        }
    }, [isSuccessAddExerciseToPlan]);
    const translateY = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (isLoadingPlans) {
        return <Loading />;
    }

    return (
        <View className='flex-1 bg-background-850 rounded-3xl relative overflow-hidden'>
            <View
            style={{width: width * 0.5}}
             className='flex-row items-center justify-between relative gap-6 self-end mr-2'>
                <Text className='text-center text-xl font-bold text-lime-500'>בחר תוכנית</Text>
                <PressableOpacity
                    onPress={() => setIsShowListWorkoutsPlans(false)}
                    bgColor="background-850"
                    activeOpacity="/60"
                    className="rounded-full border border-zinc-700"
                >
                    <X color={colors.lime[500]} strokeWidth={3} size={16} />
                </PressableOpacity>
            </View>
            <View className="flex-1">
                <CustomCarousel
                    variant='chain'
                    data={plansData || []}
                    widthCard={160}
                    renderItem={(item: WorkoutPlan, isActive: boolean) => (
                        <Card plan={item} isActive={isActive} selectedIds={selectedIds} toggleSelection={toggleSelection} />
                    )}
                />
            </View>
            {/* <View className=" right-4 top-4 z-[999]" style={{ elevation: 10 }}>
                <PressableOpacity
                    onPress={() => setIsShowListWorkoutsPlans(false)}
                    bgColor="background-850"
                    activeOpacity="/60"
                    className="p-1 rounded-full border border-zinc-700"
                >
                    <X color={colors.lime[500]} strokeWidth={3} size={12} />
                </PressableOpacity>
            </View> */}

            <View className="absolute bottom-4 left-8 items-center z-[999]" style={{ elevation: 10 }}>
                <PressableOpacity
                    onPress={handleSave}
                    bgColor='lime-500'
                    activeOpacity='/30'
                    className='p-1 rounded-full flex-row items-center justify-center'
                >
                    {isPendingAddExerciseToPlan ? (
                        // {isPendingAddExerciseToPlan && !isSuccessAddExerciseToPlan ? (
                        // <View className='flex-row items-center w-2'>
                        //     {/* <Text className="text-black font-bold ml-2">שומר...</Text> */}
                        //     <Loading size='small'  color={colors.background[850]}/>
                        // </View>
                        <View className='flex-row'
                            style={{ width: 20 }}
                        >
                            <Loading size='small' color={colors.background[850]} />
                        </View>
                    ) : (
                        <>
                            <Check size={20} color={colors.background[850]} strokeWidth={3} />
                            {/* <Text className="text-black font-bold ml-2">שמור</Text> */}
                        </>
                    )}
                </PressableOpacity>
            </View>

        </View>
    );
};

export default PlanSelector;