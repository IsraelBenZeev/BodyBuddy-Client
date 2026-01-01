import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const widthCard = 280;

const CustomCarousel = ({ data, renderItem, widthCard }: { data: any[]; renderItem: any; widthCard: number }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_SPACING = (width - widthCard) / 2;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        horizontal
        // 1. זה הפרופ החשוב ביותר: הוא הופך את כיוון הגלילה פיזית (האצבע והסדר)
        inverted={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={widthCard}
        decelerationRate="fast"
        // 2. בגלל שהפכנו (inverted), ה-padding צריך להיות בתוך הסטייל
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        renderItem={({ item, index }) => {
          // 3. כשהרשימה הפוכה (inverted), ערכי ה-inputRange צריכים להישאר חיוביים
          const inputRange = [
            (index - 1) * widthCard,
            index * widthCard,
            (index + 1) * widthCard,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={{
                width: widthCard,
                opacity,
                transform: [{ scale }],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderItem(item)}
            </Animated.View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
});

export default CustomCarousel;
