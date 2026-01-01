import { colors } from '@/colors';
import { useExercises } from '@/src/hooks/useEcercises';
import { BodyPart, Exercise, partsBodyHebrew } from '@/src/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CardAreaBodyProps {
  selectedPart: BodyPart | null;
  isLoading?: boolean;
}

const CardAreaBody = ({ selectedPart }: CardAreaBodyProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useExercises(selectedPart ?? '', page);
  const router = useRouter();
  const exercises: Exercise[] | undefined = data?.exercises;

  return (
    <View className="">
      <View className="flex-row-reverse items-center justify-between mb-8 ">
        <View className="flex-row-reverse items-center gap-4 ">
          <View style={styles.iconCircleMain}>
            <Ionicons name="body" size={24} color="black" />
          </View>
          <View className="w-full">
            <Text className="text-zinc-500 text-xs font-bold text-right uppercase tracking-tighter">
              האזור הנבחר
            </Text>
            <Text className="text-white text-4xl font-black text-right">
              {selectedPart ? partsBodyHebrew[selectedPart] : 'בחר אזור'}
            </Text>
          </View>
        </View>
      </View>
      {/* 3. כפתור הנעה לפעולה (CTA) */}
      <TouchableOpacity
        className=""
        activeOpacity={0.8}
        onPress={() => {
          if (selectedPart) {
            router.push({
              pathname: '/exercises/[part]',
              params: { part: selectedPart, page: page.toString() },
            });
          }
        }}
        style={styles.mainButton}
      >
        <AntDesign name="arrow-left" size={20} color="black" />
        <Text style={styles.buttonText}>למעבר לתרגילים</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircleMain: {
    backgroundColor: colors.lime[500],
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconCircleSmall: {
    backgroundColor: 'rgba(163, 230, 53, 0.1)',
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  infoText: {
    color: '#a1a1aa', // zinc-400
    fontSize: 15,
    textAlign: 'right',
  },
  mainButton: {
    backgroundColor: colors.lime[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default CardAreaBody;
