import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { WorkoutPlan } from '@/src/types/workout';
import CustomCarousel from '@/src/ui/CustomCarousel';
import Loading from '@/src/ui/Loading';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Card from './Card';

const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

interface Props {
    idExercise: string;
}

const PlanSelector = ({ idExercise }: Props) => {
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
    const translateY = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (isLoadingPlans) {
        return <Loading />;
    }

    return (
        <View className='flex-1'>
            <CustomCarousel
                variant='chain'
                data={plansData || []}
                widthCard={160} // FIX: שיניתי מ-300 ל-160 כדי שיתאים ל-w-40
                renderItem={(item: WorkoutPlan, isActive: boolean) => (
                    <View
                        // הסרתי את animatedStyle מכאן כי הקרוסלה כבר מטפלת באנימציה מסביב
                        className='w-40 h-32 rounded-xl justify-center items-center bg-gray-800'
                        style={{ borderWidth: 2, borderColor: 'white' }}
                    >
                        <Card plan={item} isActive={isActive} />
                    </View>
                )}
            />
        </View>
    );
};

export default PlanSelector;