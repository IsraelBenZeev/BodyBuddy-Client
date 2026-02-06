import { colors } from '@/colors';
import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, TouchableOpacity, UIManager, View } from 'react-native';

// הפעלת אנימציות באנדרואיד
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: React.ReactNode; // יכול לקבל טקסט או JSX (למשל טקסט + מיני גרף)
  children: React.ReactNode; // התוכן שייחשף
  defaultOpen?: boolean;
  isOpen?: boolean; // controlled mode - אם מועבר, האקורדיון נשלט מבחוץ
  onToggle?: () => void; // callback לפתיחה/סגירה ב-controlled mode
}

const Accordion = ({ title, children, defaultOpen = false, isOpen: controlledIsOpen, onToggle }: AccordionProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // אם isOpen מועבר, זה controlled mode, אחרת uncontrolled
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const initialValue = controlledIsOpen !== undefined ? controlledIsOpen : defaultOpen;
  const animatedHeight = useRef(new Animated.Value(initialValue ? 1 : 0)).current;
  const contentRef = useRef<View>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const toggleAccordion = () => {
    if (onToggle) {
      // controlled mode - קורא ל-callback
      onToggle();
    } else {
      // uncontrolled mode - משנה state פנימי
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const handleContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setContentHeight(height);
    }
  };

  const heightInterpolation = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight || 1000],
  });

  // אנימציה נפרדת לחץ עם useNativeDriver (יותר חלקה)
  const arrowRotation = useRef(new Animated.Value(initialValue ? 1 : 0)).current;

  useEffect(() => {
    // מריץ את כל האנימציות במקביל לחלקות מקסימלית
    Animated.parallel([
      // אנימציה לחץ (עם native driver)
      Animated.timing(arrowRotation, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      // אנימציה ל-height ו-opacity (בלי native driver כי height לא נתמך)
      Animated.timing(animatedHeight, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen, arrowRotation, animatedHeight]);

  const rotateInterpolation = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      className={`mb-4 overflow-hidden rounded-3xl border ${isOpen ? 'border-lime-500/50 bg-background-800' : 'border-gray-800 bg-background-850'
        }`}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleAccordion}
        className="flex-row items-center justify-between p-4"
      >
        {/* כותרת - יכולה להיות מורכבת מ-JSX */}
        <View className="flex-1 mr-4">{title}</View>

        {/* חץ עם סיבוב לפי המצב */}
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolation }],
          }}
          className="bg-gray-800 p-1 rounded-full"
        >
          <ChevronDown size={20} color={isOpen ? colors.lime[500] : colors.background[850]} />
        </Animated.View>
      </TouchableOpacity>

      {/* תוכן נפתח עם אנימציה */}
      <Animated.View
        style={{
          height: contentHeight !== null ? heightInterpolation : undefined,
          opacity: animatedHeight, // משתמש באותו animated value כמו height (בלי native driver)
        }}
        className="overflow-hidden"
      >
        <View
          ref={contentRef}
          onLayout={handleContentLayout}
          className="p-4 pt-0 border-t border-gray-800/50"
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

export default Accordion;