import { Exercise } from '@/src/types/exercise';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import { describeInputFields } from '@/src/utils/formatExerciseMetrics';
import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import type { VideoPlayer } from 'expo-video';
import { useEffect, useMemo, useRef } from 'react';
import { Control } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Failds from './Failds';

interface CardProps {
  item: Exercise;
  isActive: boolean;
  videoPlayer?: VideoPlayer | null;
  control: Control<any>;
}

const ActiveExerciseVideo = ({
  name,
  player,
}: {
  name: string;
  player: VideoPlayer;
}) => {
  return (
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
};

const Card = ({ item, isActive, videoPlayer, control }: CardProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeLabel = useMemo(() => describeInputFields(item?.input_fields ?? []), [item?.input_fields]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToBottom = () => {
    scrollTimeoutRef.current = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!item) return null;

  return (
    <View className="bg-background-900 p-2">
      <View className="justify-center w-full px-6 items-end">
        <Text className="typo-caption-bold text-lime-500 uppercase tracking-widest mb-2">
          {item.bodyParts_he || ''}
        </Text>
        <Text className="typo-h3 text-white mb-2">
          {item.name_he || ''}
        </Text>
        <View className="mb-6">
          {!!typeLabel && (
            <View
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1"
              accessible
              accessibilityLabel={`סוג תרגיל: ${typeLabel}`}
            >
              <Text className="typo-caption text-zinc-400">{typeLabel}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className=""
        contentContainerStyle={{ paddingBottom: 20 }}
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
          <View className="w-full">
            <Failds control={control} item={item} onScrollBottom={scrollToBottom} />
          </View>
        </View>
      </ScrollView>
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
