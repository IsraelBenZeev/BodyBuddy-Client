import { colors } from '@/colors';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import PagerView from 'react-native-pager-view';

interface ExerciseImageCarouselProps {
  imageUrls: string[];
}

const CarouselImage = ({ uri }: { uri: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
        transition={300}
        cachePolicy="disk"
        accessibilityLabel="תמונת התרגיל"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      {isLoading && (
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
          importantForAccessibility="no"
        >
          <ActivityIndicator size="large" color={colors.lime[500]} />
        </View>
      )}
    </View>
  );
};

const ExerciseImageCarousel = ({ imageUrls }: ExerciseImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <PagerView
        style={{ width: '100%', height: '100%' }}
        initialPage={0}
        onPageSelected={(e) => setActiveIndex(e.nativeEvent.position)}
        accessibilityLabel="גלריית תמונות התרגיל"
        accessibilityHint="החלק ימינה או שמאלה כדי לעבור בין התמונות"
      >
        {imageUrls.map((uri) => (
          <CarouselImage key={uri} uri={uri} />
        ))}
      </PagerView>
      <View
        className="absolute bottom-2 self-center flex-row gap-1.5"
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
      >
        {imageUrls.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === activeIndex ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: index === activeIndex ? colors.lime[300] : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default ExerciseImageCarousel;
