import { colors } from '@/colors';
import { useDeleteWorkoutPlan } from '@/src/hooks/useWorkout';
import { useWorkoutStore } from '@/src/store/workoutsStore';
import { daysInHebrew, WorkoutPlan } from '@/src/types/workout';
import { IconCalendar, IconSuccess, IconX } from '@/src/ui/IconsSVG';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
interface CardProps {
  plan: WorkoutPlan;
  isActive: boolean;
}

const user_id = 'd3677b3f-604c-46b3-90d3-45e920d4aee2';
const CardPlan = ({ plan, isActive }: CardProps) => {
  const [deleteId, setDeleteId] = useState<string>("");
  const { mutateAsync: deleteWorkoutPlanMutation, isPending: deletePending, isSuccess: deleteSuccess } = useDeleteWorkoutPlan(user_id)
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const clearAllExercises = useWorkoutStore((state) => state.clearAllExercises);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);  // const handleDelete = (id: string) => {
  const handleDelete = (id: string) => {
    setDeleteId(id)
    Toast.show({
      type: 'info',
      text1: 'האימון יימחק בעוד 5 שניות',
      visibilityTime: 5000,
      autoHide: true,
      props: {
        mode: 'delete',
        timeProgress: 5000,
        iconCancel: <IconX size={20} color={colors.lime[500]} />,
        iconDelete: <IconSuccess size={20} color={colors.lime[500]} />,
        onPressCancel: () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            setDeleteId("");
            Toast.hide();
          }
        },
        onPressDelete: () => {
          deleteWorkoutPlanMutation(deleteId);
          timerRef.current = null;

          Toast.hide();
          setDeleteId("")
          Toast.show({
            type: 'info',
            text1: 'האימון נמחק בהצלחה',
            visibilityTime: 1000,
            props: {
              mode: 'cancel',
              icon: <IconSuccess size={20} color={colors.lime[500]} />,
              timeProgress: 1000
            }
          });
        }
      },
      onHide: () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          setDeleteId("");
          Toast.hide();
          setDeleteId("")
          Toast.show({
            type: 'info',
            text1: 'המחיקה בוטלה',
            visibilityTime: 1000,
            props: {
              mode: 'cancel',
              icon: <IconX size={20} color={colors.lime[500]} />,
              timeProgress: 1000
            }
          });
        }
      },
      onPress: () => {
        Toast.hide();
      }
    });

    // 3. מפעילים את הטיימר
    timerRef.current = setTimeout(() => {
      deleteWorkoutPlanMutation(id); // רק עכשיו זה באמת נשלח לשרת!
      timerRef.current = null;
    }, 5000);
  }
  
  useEffect(() => {
    if (deleteSuccess) {
      setDeleteId("")
    }
  }, [deletePending, deleteSuccess])
  return (
    <View
      style={{ height: 470, width: 265, backgroundColor: '#18181b', borderWidth: 1, borderRadius: 40 }}
      className={`"rounded-[40px]  shadow-2xl " ${deleteId === plan?.id ? 'opacity-50' : ''}`}
    >
    
      <View className="h-40 w-full relative rounded-t-[40px]">
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
          }}
          className="w-full h-full opacity-60 rounded-t-[40px]"
        />
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900" />
      </View>

      {/* 2. תוכן האימון */}
      <View className="p-5 flex-1 justify-between">
        {/* <View className="bd"> */}

        <Text className="text-lime-500 font-bold text-xs text-right mb-1 uppercase tracking-widest">
          Workout Plan
        </Text>
        <Text numberOfLines={2} className="text-white text-2xl font-bold text-right leading-7">
          {plan.title}
        </Text>

        <Text numberOfLines={3} className="text-zinc-400 text-sm text-right mt-3 leading-5">
          {plan?.description}
        </Text>

        <View className="flex-row-reverse flex-wrap gap-2 mt-4">
          <IconCalendar size={18} color={colors.lime[500]} />
          {plan?.days_per_week.map((day, index) => (
            <View
              key={index}
              className="bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700"
            >
              <Text className="text-zinc-300 text-[10px]">{daysInHebrew[day]}</Text>
            </View>
          ))}
        </View>

        {/* 4. חלק תחתון - כפתור ונתונים */}
        <View className="mt-6">
          <View className="flex-row-reverse justify-between items-center mb-4 px-1">
            <View className="flex-row-reverse items-center">
              <MaterialCommunityIcons name="clock-fast" size={16} color={colors.lime[500]} />
              <Text className="text-white text-xs mr-1 font-bold">{plan.time} דק'</Text>
            </View>
            <View className="flex-row-reverse items-center">
              <MaterialCommunityIcons name="trending-up" size={16} color={colors.lime[500]} />
              <Text className="text-white text-xs mr-1 font-bold">{plan.difficulty}</Text>
            </View>
          </View>

          <TouchableOpacity className="bg-lime-500 w-full py-4 rounded-2xl items-center shadow-lg">
            <Text className="text-black font-extrabold text-base">התחל אימון</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isActive && (
        <View
          style={{ position: 'absolute', right: -35, bottom: 20 }}
          className="justify-end items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              console.log("plan id for delete ", plan?.title);
              handleDelete(plan?.id as string)
            }}
            style={{ backgroundColor: "rgba(255, 0, 0, 0.3)" }}
            className="p-1 rounded-full"
          >
            <MaterialCommunityIcons name="trash-can-outline" size={22} color="red" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              clearAllExercises();
              toggleExercise(plan?.exercise_ids as string[])
              router.push({
                pathname: '/form_create_Workout/[mode]',
                params: { mode: 'edit', workout_plan_id: plan?.id },
              });
            }}
            style={{ backgroundColor: 'rgba(163, 230, 53, 0.3)' }}
            className="p-1 rounded-full "
          >
            <MaterialCommunityIcons name="pencil-outline" size={22} color={colors.lime[500]} />
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

export default CardPlan;
