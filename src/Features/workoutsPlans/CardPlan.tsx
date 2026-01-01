import { colors } from '@/colors';
import { daysInHebrew, WorkoutPlan } from '@/src/types/workout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface CardProps {
  plan: WorkoutPlan;
}

const CardPlan = ({ plan }: CardProps) => {
  return (
    <View className="m-2">
      <View
        style={{ height: 480, width: 280, backgroundColor: '#18181b' }}
        className="rounded-[40px] border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* 1. תמונה עליונה (תופסת כ-40% מהגובה) */}
        <View className="h-40 bg-zinc-800 w-full relative">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
            }}
            className="w-full h-full opacity-60"
          />
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900" />
        </View>

        {/* 2. תוכן האימון */}
        <View className="p-5 flex-1 justify-between">
          <View>
            <Text className="text-lime-500 font-bold text-xs text-right mb-1 uppercase tracking-widest">
              Workout Plan
            </Text>
            <Text numberOfLines={2} className="text-white text-2xl font-bold text-right leading-7">
              {plan.title}
            </Text>

            <Text numberOfLines={3} className="text-zinc-400 text-sm text-right mt-3 leading-5">
              {plan?.description}
            </Text>
          </View>

          {/* 3. ימיםבשבוע (ממלא את החלל הריק) */}
          <View className="flex-row-reverse flex-wrap gap-2 mt-4">
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
      </View>
    </View>
  );
};

export default CardPlan;
