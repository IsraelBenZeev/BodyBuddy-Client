import { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View, ViewToken } from 'react-native';

const { width } = Dimensions.get('window');
const widthCard = 280;

const CustomCarousel = ({ data, renderItem, widthCard }: { data: any[]; renderItem: any; widthCard: number }) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;



  const ITEM_SPACING = (width - widthCard) / 2;
  // 2. זו ה"עין" של הקרוסלה. היא בודקת בכל רגע מה נמצא במרכז ומעדכנת את ה-State
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      // אנחנו מחפשים את הפריט שהכי "נראה" (itemVisiblePercentThreshold)
      const centeredItem = viewableItems[0].item;
      if (centeredItem) {
        setActiveId(centeredItem.id);
      }
    }
  }).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // פריט נחשב "פעיל" כשרואים לפחות 50% ממנו
  }).current;

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
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={3}
        keyExtractor={(item) => item.id.toString()} // חשוב מאוד להתאמת ה-ID
        onLayout={() => {
          if (data && data.length > 0 && !activeId) {
            setActiveId(data[0].id);
          }
        }}
        // renderItem={({ item, index }) => {
        //   // 3. כשהרשימה הפוכה (inverted), ערכי ה-inputRange צריכים להישאר חיוביים
        //   const inputRange = [
        //     (index - 1) * widthCard,
        //     index * widthCard,
        //     (index + 1) * widthCard,
        //   ];

        //   const scale = scrollX.interpolate({
        //     inputRange,
        //     outputRange: [0.9, 1, 0.9],
        //     extrapolate: 'clamp',
        //   });

        //   const opacity = scrollX.interpolate({
        //     inputRange,
        //     outputRange: [0.4, 1, 0.4],
        //     extrapolate: 'clamp',
        //   });
        renderItem={({ item, index }) => {
          // --- האנימציה ששאלת עליה (גודל ושקיפות) ---
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

          // --- הלוגיקה החדשה של ה-ID הפעיל ---
          // אנחנו בודקים האם ה-ID של הפריט הנוכחי הוא זה ששמור ב-State כ"פעיל"
          const isActive = item.id === activeId;
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
              {renderItem(item, isActive)}
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
