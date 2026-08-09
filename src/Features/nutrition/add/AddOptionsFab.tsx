import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  onSelectFromList: () => void;
  onAddNewFood: () => void;
  onAddMeal: () => void;
  onCameraAI: () => void;
}

interface FabOptionConfig {
  key: string;
  icon: IoniconName;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  labelColor: string;
  emphasized?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = { duration: 700, dampingRatio: 0.8, overshootClamping: true };
const OFFSET = 70;
const ITEM_SIZE = 58;
const EMPHASIZED_SIZE = 72;
const TRIGGER_SIZE = 64;

interface FabOptionButtonProps {
  option: FabOptionConfig;
  index: number;
  expanded: boolean;
}

const FabOptionButton = ({ option, index, expanded }: FabOptionButtonProps) => {
  const size = option.emphasized ? EMPHASIZED_SIZE : ITEM_SIZE;
  const delay = index * 70;

  const animatedStyle = useAnimatedStyle(() => {
    const moveValue = expanded ? OFFSET * index : 0;
    const scaleValue = expanded ? 1 : 0;
    return {
      opacity: withDelay(delay, withTiming(scaleValue, { duration: 140 })),
      transform: [
        { translateY: withSpring(-moveValue, SPRING_CONFIG) },
        { scale: withDelay(delay, withTiming(scaleValue, { duration: 180 })) },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={option.onPress}
      accessibilityRole="button"
      accessibilityLabel={option.accessibilityLabel}
      accessibilityHint={option.accessibilityHint}
      accessibilityElementsHidden={!expanded}
      importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
      pointerEvents={expanded ? 'auto' : 'none'}
      hitSlop={8}
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: option.iconBg,
          borderWidth: 1,
          borderColor: option.iconBorder,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
        },
      ]}
    >
      <Ionicons name={option.icon} size={size * 0.34} color={option.iconColor} />
      <Text style={{ color: option.labelColor }} className="typo-caption-bold mt-0.5" numberOfLines={1}>
        {option.label}
      </Text>
    </AnimatedPressable>
  );
};

const AddOptionsFab = ({ onSelectFromList, onAddNewFood, onAddMeal, onCameraAI }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  const wrap = useCallback(
    (fn: () => void) =>
      () => {
        setExpanded(false);
        fn();
      },
    []
  );

  const options = useMemo<FabOptionConfig[]>(
    () => [
      {
        key: 'list',
        icon: 'search',
        label: 'רשימה',
        onPress: wrap(onSelectFromList),
        accessibilityLabel: 'הוסף מתוך הרשימה',
        accessibilityHint: 'בחר מהמאגר שלך',
        iconBg: 'rgba(96,165,250,0.28)',
        iconBorder: 'rgba(147,197,253,0.5)',
        iconColor: '#bfdbfe',
        labelColor: '#dbeafe',
      },
      {
        key: 'food',
        icon: 'add-circle-outline',
        label: 'מאכל',
        onPress: wrap(onAddNewFood),
        accessibilityLabel: 'מאכל חדש',
        accessibilityHint: 'צור מאכל מותאם אישית',
        iconBg: 'rgba(167,139,250,0.28)',
        iconBorder: 'rgba(196,181,253,0.5)',
        iconColor: '#ede9fe',
        labelColor: '#ede9fe',
      },
      {
        key: 'meal',
        icon: 'restaurant-outline',
        label: 'ארוחה',
        onPress: wrap(onAddMeal),
        accessibilityLabel: 'ארוחה חדשה',
        accessibilityHint: 'בנה ממספר מרכיבים',
        iconBg: 'rgba(251,146,60,0.28)',
        iconBorder: 'rgba(253,186,116,0.5)',
        iconColor: '#fed7aa',
        labelColor: '#ffedd5',
      },
      {
        key: 'camera',
        icon: 'camera',
        label: 'AI',
        onPress: wrap(onCameraAI),
        accessibilityLabel: 'צלם ארוחה עם AI',
        accessibilityHint: 'זיהוי אוטומטי של מרכיבים וערכים תזונתיים',
        iconBg: 'rgba(132,204,22,0.3)',
        iconBorder: 'rgba(132,204,22,0.6)',
        iconColor: '#a3e635',
        labelColor: '#d9f99d',
        emphasized: true,
      },
    ],
    [onSelectFromList, onAddNewFood, onAddMeal, onCameraAI, wrap]
  );

  const iconRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(expanded ? '45deg' : '0deg', { duration: 200 }) }],
  }));

  const stackHeight = TRIGGER_SIZE + OFFSET * options.length + EMPHASIZED_SIZE;
  const stackWidth = EMPHASIZED_SIZE + 16;

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        pointerEvents="box-none"
        style={{ width: stackWidth, height: stackHeight, alignItems: 'center' }}
      >
        {options.map((option, i) => (
          <FabOptionButton key={option.key} option={option} index={i + 1} expanded={expanded} />
        ))}

        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'סגור תפריט הוספה' : 'פתח תפריט הוספת מאכל או ארוחה'}
          accessibilityHint={expanded ? undefined : 'פותח אפשרויות להוספת מאכל, ארוחה או צילום עם AI'}
          style={{
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            width: TRIGGER_SIZE,
            height: TRIGGER_SIZE,
            borderRadius: TRIGGER_SIZE / 2,
            backgroundColor: 'rgba(150,200,40,0.2)',
            borderWidth: 1,
            borderColor: 'rgba(150,200,40,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Animated.View style={iconRotateStyle}>
            <Ionicons name="add" size={30} color={colors.lime[300]} />
          </Animated.View>
        </Pressable>
      </View>

      <Text className="typo-caption-bold mt-1" style={{ color: colors.lime[300] }}>
        {expanded ? 'סגור' : 'הוסף'}
      </Text>
    </View>
  );
};

export default AddOptionsFab;
