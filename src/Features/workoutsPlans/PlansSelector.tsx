import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { WorkoutPlan } from '@/src/types/workout';
import CustomCarousel from '@/src/ui/CustomCarousel';
import Loading from '@/src/ui/Loading';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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
    // useEffect(() => {
    //     console.log('Selected IDs:', selectedIds);
    // }, [selectedIds]);
    if (isLoadingPlans) {
        return <Loading />;
    }

    return (
        <View>
            <CustomCarousel data={plansData || []} renderItem={(item: WorkoutPlan) => <Text>{item.title}</Text>} widthCard={300} />
        </View>
    );
};

export default PlanSelector;