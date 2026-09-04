import { Exercise } from '@/src/types/exercise';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import type { VideoPlayer } from 'expo-video';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Control } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '@/src/ui/PressableOpacity';
import Failds from './Failds';

interface CardProps {
  item: Exercise;
  isActive: boolean;
  videoPlayer?: VideoPlayer | null;
  control: Control<any>;
  defaultSets?: Record<string, number>[];
  optionalFieldVisibility: Record<string, boolean>;
  onOptionalFieldVisibilityChange: (fieldId: string, enabled: boolean) => void;
}

const ActiveExerciseVideo = ({ name, player }: { name: string; player: VideoPlayer }) => (
  <View style={styles.videoFrame}>
    <VideoView
      style={StyleSheet.absoluteFill}
      player={player}
      contentFit="contain"
      nativeControls={false}
      useExoShutter={false}
      accessibilityLabel={`סרטון הדגמה לתרגיל ${name}`}
    />
  </View>
);

const Card = ({
  item,
  isActive,
  videoPlayer,
  control,
  defaultSets = [],
  optionalFieldVisibility,
  onOptionalFieldVisibilityChange,
}: CardProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addSetAction, setAddSetAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollTimeoutRef.current = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleAddSetReady = useCallback((addSet: () => void) => {
    setAddSetAction(() => addSet);
  }, []);

  if (!item) return null;

  return (
    <View className="flex-1 bg-background-900 p-2 ">
      <ScrollView
        ref={scrollViewRef}
        className=""
        style={{ height: 700 }}
        // contentContainerStyle={{ paddingBottom: 0 }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        <View className="items-center bg-background-850 border border-white/10 rounded-2xl px-4 py-2 gap-3">
          <View className={`${item.videoUrl ? 'bg-black' : 'bg-white'} items-center justify-center rounded-2xl overflow-hidden w-full`}>
            {item.videoUrl && isActive ? (
              videoPlayer ? (
                <ActiveExerciseVideo
                  name={item.name_he || item.name || ''}
                  player={videoPlayer}
                />
              ) : (
                <View style={styles.videoFrame} />
              )
            ) : item.imageUrls?.[0] ? (
              <Image
                source={{ uri: item.imageUrls[0] }}
                style={{ width: 200, height: 200 }}
                contentFit="cover"
                accessibilityLabel={`תמונת התרגיל ${item.name_he}`}
              />
            ) : (
              <DumbbellAnimation size={200} />
            )}
          </View>
          <View className="w-full pb-3">
            <Failds
              control={control}
              item={item}
              onScrollBottom={scrollToBottom}
              defaultSets={defaultSets}
              onAddSetReady={handleAddSetReady}
              optionalFieldVisibility={optionalFieldVisibility}
              onOptionalFieldVisibilityChange={onOptionalFieldVisibilityChange}
            />
          </View>
        </View>
      </ScrollView>
      {addSetAction && (
        <View className="border-t border-white/10 bg-background-900 px-2 pt-3">
          <AppButton
            onPress={addSetAction}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-lime-500/60 bg-lime-500/15 py-3"
            haptic="medium"
            animationType="both"
            accessibilityLabel="הוסף סט"
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="rgb(213,255,95)" />
            <Text className="typo-body-primary text-lime-400">הוסף סט</Text>
          </AppButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoFrame: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
});

export default Card;
