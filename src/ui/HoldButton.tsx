/**
 * HoldButton – כפתור "החזק לאישור"
 *
 * כפתור שמפעיל פעולה רק אחרי החזקה מתמשכת (למניעת לחיצות בטעות).
 * מציג אנימציית מילוי בזמן ההחזקה.
 *
 * fillVariant:
 * - 'fill-both-sides' – צבע מתמלא משני הקצוות ונפגש במרכז (ברירת מחדל)
 * - 'darken' – שכבה כהה שמתחזקת (opacity)
 *
 * @example
 * <HoldButton
 *   holdDurationMs={1500}
 *   onPress={() => startWorkout()}
 *   className="bg-lime-500 w-full py-4 rounded-2xl"
 *   fillVariant="fill-both-sides"
 *   fillColor="rgba(0,0,0,0.5)"
 * >
 *   <Text>התחל אימון</Text>
 * </HoldButton>
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type HoldButtonHapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'none';

/** סוג מחוות המילוי: משני הקצוות למרכז, או התכההות */
export type HoldButtonFillVariant = 'fill-both-sides' | 'darken';

export interface HoldButtonProps {
  /** משך ההחזקה במילי־שניות עד להפעלת onPress (ברירת מחדל: 1500) */
  holdDurationMs?: number;
  /** נקרא רק כשהמשתמש החזיק את כל משך הזמן */
  onPress: () => void;
  /** Tailwind classes לכפתור (מעטפת) */
  className?: string;
  /** סוג מחווה: מילוי משני הכיוונים או התכההות (ברירת מחדל: fill-both-sides) */
  fillVariant?: HoldButtonFillVariant;
  /** צבע המילוי (CSS/RGBA), ברירת מחדל: rgba(0,0,0,0.45) */
  fillColor?: string;
  /** Tailwind classes לשכבת ההתכההות (רק ב־darken, אופציונלי) */
  overlayClassName?: string;
  /** סוג ויברציה בהשלמת ההחזקה (ברירת מחדל: success) */
  hapticOnComplete?: HoldButtonHapticType;
  /** משך האנימציה לאיפוס כשמשחררים (מילי־שניות, ברירת מחדל: 200) */
  resetDurationMs?: number;
  children: React.ReactNode;
}

const DEFAULT_HOLD_MS = 1500;
const DEFAULT_RESET_MS = 200;
const DEFAULT_FILL_COLOR = 'rgba(0,0,0,0.45)';

function triggerHaptic(type: HoldButtonHapticType) {
  if (type === 'none') return;
  switch (type) {
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
  }
}

const HoldButton = ({
  holdDurationMs = DEFAULT_HOLD_MS,
  onPress,
  className = '',
  fillVariant = 'fill-both-sides',
  fillColor = DEFAULT_FILL_COLOR,
  overlayClassName,
  hapticOnComplete = 'success',
  resetDurationMs = DEFAULT_RESET_MS,
  children,
}: HoldButtonProps) => {
  const progress = useSharedValue(0);

  const onHoldComplete = useCallback(() => {
    triggerHaptic(hapticOnComplete);
    onPress();
  }, [onPress, hapticOnComplete]);

  const handlePressIn = useCallback(() => {
    cancelAnimation(progress);
    progress.value = withTiming(1, { duration: holdDurationMs }, (finished) => {
      if (finished) runOnJS(onHoldComplete)();
    });
  }, [progress, holdDurationMs, onHoldComplete]);

  const handlePressOut = useCallback(() => {
    cancelAnimation(progress);
    progress.value = withTiming(0, { duration: resetDurationMs });
  }, [progress, resetDurationMs]);

  const darkenOverlayStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: progress.value,
    backgroundColor: fillColor,
  }));

  const fillBarStyle = useAnimatedStyle(() => ({
    flex: progress.value,
    backgroundColor: fillColor,
  }));

  const fillContainerStyle = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row' as const,
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`overflow-hidden ${className}`}
    >
      {fillVariant === 'fill-both-sides' ? (
        <View pointerEvents="none" style={fillContainerStyle}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Animated.View style={fillBarStyle} />
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
            <Animated.View style={fillBarStyle} />
            <View style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <Animated.View
          pointerEvents="none"
          className={overlayClassName}
          style={darkenOverlayStyle}
        />
      )}
      <View className="z-10">{children}</View>
    </Pressable>
  );
};

export default HoldButton;
