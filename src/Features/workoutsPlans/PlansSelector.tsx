import { colors } from '@/colors';
import { useAddExerciseToPlan, useWorkoutsPlans } from '@/src/hooks/useWorkout';
import { WorkoutPlan } from '@/src/types/workout';
import Loading from '@/src/ui/Loading';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Calendar, Check, Clock, Dumbbell } from 'lucide-react-native';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';

const userID = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';

interface Props {
    selectedIds: string[];
    setSelectedIds: Dispatch<SetStateAction<string[]>>;
    idExercise: string;
    onClose: () => void;
}

const PlanSelector = ({ selectedIds, setSelectedIds, idExercise, onClose }: Props) => {
    const { data: plansData, isLoading: isLoadingPlans } = useWorkoutsPlans(userID);
    const { mutateAsync: addExerciseToPlan, isPending: isPendingAddExerciseToPlan, isSuccess: isSuccessAddExerciseToPlan } = useAddExerciseToPlan(userID);
    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };
    const handleSave = () => {
        console.log('Selected IDs:', selectedIds);
        if (selectedIds.length === 0) return;
        addExerciseToPlan({ idExercise, planIds: selectedIds });
    };
    useEffect(() => {
        console.log('Selected IDs:', selectedIds);
    }, [selectedIds]);

    useEffect(() => {
        if (isSuccessAddExerciseToPlan) {
            onClose();
        }
    }, [isSuccessAddExerciseToPlan]);

    if (isLoadingPlans) {
        return <Loading />;
    }

    const renderItem = ({ item: plan }: { item: WorkoutPlan }) => {
        const isSelected = selectedIds.includes(plan.id ?? '');
        const exerciseCount = plan.exercise_ids?.length || 0;
        const cardContent = (
            <View className={`p-4 flex-row-reverse items-center justify-between ${isSelected ? 'bg-lime-400/10' : 'bg-transparent'}`}>
                <View className="flex-1 items-end mr-4">
                    <Text className="text-white text-xl font-bold mb-1 text-right">
                        {plan.title}
                    </Text>

                    <View className="flex-row-reverse items-center">
                        <View className="flex-row-reverse items-center ml-3">
                            <Clock size={12} color="#9ca3af" />
                            <Text className="text-gray-400 text-xs mr-1">{plan.time} דק׳</Text>
                        </View>

                        <View className="flex-row-reverse items-center ml-3">
                            <Dumbbell size={12} color="#9ca3af" />
                            <Text className="text-gray-400 text-xs mr-1">{exerciseCount} תרגילים</Text>
                        </View>
                    </View>

                    <View className="flex-row-reverse items-center mt-2">
                        <Calendar size={12} color={colors.lime[400]} />
                        <Text className="text-lime-400/80 text-[10px] font-bold mr-1">
                            {plan.days_per_week?.join(', ')}
                        </Text>
                    </View>
                </View>

                <View
                    className={`w-7 h-7 rounded-full items-center justify-center border-2 ${isSelected ? 'bg-lime-400 border-lime-400' : 'bg-transparent border-zinc-700'}`}
                >
                    {isSelected && <Check size={16} color={colors.background[900]} strokeWidth={4} />}
                </View>
            </View>
        );

        return (
            <Pressable
                onPress={() => toggleSelection(plan.id ?? '')}
                className={`mb-4 overflow-hidden rounded-2xl border-2 ${isSelected ? 'border-lime-400' : 'border-zinc-800'}`}
            >
                {/* תנאי: רק אם נבחר מציגים תמונה, אחרת מציגים רק את התוכן על רקע כהה */}
                {isSelected ? (
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop' }}
                        className="w-full"
                        imageStyle={{ opacity: 0.2 }}
                    >
                        {cardContent}
                    </ImageBackground>
                ) : (
                    <View className="w-full bg-zinc-900">
                        {cardContent}
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <View className="flex-1">
            <BottomSheetFlatList
                data={plansData}
                keyExtractor={(item: WorkoutPlan) => item.id ?? ''}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                // הוספת disallowInterruption עוזרת למניעת תקיעות גלילה במודלים
                disallowInterruption={true}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }}
                ListHeaderComponent={
                    <Text className="text-gray-400 text-right mb-4 text-sm font-medium px-1">
                        בחר אימונים להוספת התרגיל:
                    </Text>
                }
            // ListFooterComponent={
            // }
            />
            {selectedIds.length > 0 && (
                <View className="absolute bottom-20 left-1/2 -translate-x-1/2 w-52">
                    <Pressable
                        onPress={handleSave}
                        disabled={selectedIds.length === 0}
                        className={`py-4 rounded-2xl flex-row justify-center items-center ${selectedIds.length > 0 ? 'bg-lime-400' : 'bg-zinc-800 shadow-sm'}`}
                    >
                        {isPendingAddExerciseToPlan ? <Loading /> : <Text
                            className={`font-bold text-lg ${selectedIds.length > 0 ? 'text-black' : 'text-gray-500'}`}
                        >
                            {`הוסף ל-${selectedIds.length} אימונים`}
                        </Text>}
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default PlanSelector;