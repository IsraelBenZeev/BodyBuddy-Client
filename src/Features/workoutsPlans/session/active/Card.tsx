import { Exercise } from '@/src/types/exercise';
import DumbbellAnimation from '@/src/ui/Animations/DumbbellAnimation';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef } from 'react';
import { Control } from 'react-hook-form';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Failds from './Failds';

interface CardProps {
  item: Exercise;
  isActive: boolean;
  activeId: string;
  control: Control<any>;
}

const Card = ({ item, isActive, activeId, control }: CardProps) => {
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useVideoPlayer(item?.videoUrl ?? null, (player) => {
    player.loop = true;
    player.muted = true;
    player.audioMixingMode = 'mixWithOthers';
  });

  useEffect(() => {
    if (!item?.videoUrl) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, item?.videoUrl, player]);

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
        <Text className="typo-h3 text-white mb-6">
          {item.name_he || ''}
        </Text>
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
            {item.videoUrl ? (
              <VideoView
                style={{ width: '100%', height: 200 }}
                player={player}
                contentFit="contain"
                nativeControls={false}
                accessibilityLabel={`סרטון הדגמה לתרגיל ${item.name_he}`}
              />
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

export default Card;
