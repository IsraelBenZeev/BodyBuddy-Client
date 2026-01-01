import { colors } from '@/colors';
import { useExerciseByIds } from '@/src/hooks/useEcercises';
import BackGround from '@/src/ui/BackGround';
import { IconAddToList } from '@/src/ui/IconsSVG';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import CardPlan from './CardPlan';
import CustomCarousel from './CustomCarousel';
const idsExercises = [
  '01qpYSe',
  '03lzqwk',
  '05Cf2v8',
  '0br45wL',
  '0CXGHya',
  '0dCyly0',
  '0I5fUyn',
  '0IgNjSM',
  '0jp9Rlz',
  '0JtKWum',
  '0L2KwtI',
];
const plans = [
  {
    id: 'plan_001',
    user_id: 'user_abc_123',
    title: 'תכנית AB - פלג גוף עליון',
    description: 'דגש על חזה, גב וכתפיים',
    created_at: '2024-03-20T10:00:00Z',
    time: 45,
    difficulty: 5,
  },
  {
    id: 'plan_002',
    user_id: 'user_abc_123',
    title: 'תכנית AB - פלג גוף תחתון',
    description: "סקוואטים, לאנג'ים ועבודה על ליבה",
    created_at: '2024-03-20T10:05:00Z',
    time: 45,
    difficulty: 4,
  },
  {
    id: 'plan_003',
    user_id: 'user_abc_123',
    title: 'Full Body - אימון מהיר',
    description: 'אימון אינטנסיבי לכל הגוף כשאין הרבה זמן',
    created_at: '2024-03-22T08:30:00Z',
    time: 30,
    difficulty: 3,
  },
];

const WorkoutList = () => {
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const { data, isLoading } = useExerciseByIds(idsExercises);
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    if (plans && plans.length > 0 && !activePlanId) {
      setActivePlanId(plans[0].id);
    }
  }, [plans]);
  return (
    <BackGround>
      <View className=" h-full items-center justify-center">
        <View className="h-flex-1 ">
          <Text className="text-white text-2xl font-bold">האימונים שלי</Text>
        </View>
        <View className="w-full ">
          <CustomCarousel
            data={plans}
            renderItem={(item: any) => <CardPlan title={item.title} />}
            widthCard={280}
          />
        </View>
        <TouchableOpacity className='absolute -bottom-4 left-10 items-center justify-center border border-lime-500 rounded-full p-3'>
          <IconAddToList color={colors.lime[500]} size={34} />
          <Text className="text-lime-500 text-xs text-center">צור אימון חדש</Text>
        </TouchableOpacity>
        {/* <FlatList
          renderItem={() => <CardPlans exercises={plans} isLoading={isLoading} />}
          data={plans || []}
          keyExtractor={(item) => item.id.toString()}
          /> */}
      </View>
    </BackGround>
  );
};

export default WorkoutList;
