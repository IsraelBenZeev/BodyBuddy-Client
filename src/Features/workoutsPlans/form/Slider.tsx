import { colors } from '@/colors';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { GestureResponderEvent, PanResponder, Text, View } from 'react-native';

// הגדרת הטיפוסים ל-Props
interface Props {
  control: Control<any>;
  name: string;
  isPendingCreate: boolean;
}

const MIN = 1;
const MAX = 10;
const TRACK_HEIGHT = 6;
const THUMB_SIZE = 24;
const TOUCH_AREA_HEIGHT = 44;

interface SliderTrackProps {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

// מגע ותצוגה ידניים במקום ספריית סליידר חיצונית: תחת RTL כפוי (I18nManager.forceRTL)
// חישוב המגע וחישוב מיקום התצוגה של הספרייה יצאו לא עקביים זה עם זה (התצוגה התהפכה, המגע לא) -
// לכן בונים כאן את שני החישובים באותה נקודה כדי שיהיו תמיד תואמים
const SliderTrack = ({ value, disabled, onChange }: SliderTrackProps) => {
  const widthRef = useRef(0);
  const startLeftPxRef = useRef(0);
  const lastValueRef = useRef(value);

  lastValueRef.current = value;

  // ממיר מיקום פיזי (פיקסלים מהקצה השמאלי של הרצועה) לערך: מימין (leftPx=w) = קל מאוד, משמאל (leftPx=0) = אינטנסיבי
  const applyLeftPx = useCallback(
    (leftPx: number) => {
      const w = widthRef.current;
      if (w <= 0) return;
      const clamped = Math.max(0, Math.min(w, leftPx));
      const ratio = 1 - clamped / w;
      const raw = MIN + ratio * (MAX - MIN);
      const newValue = Math.min(MAX, Math.max(MIN, Math.round(raw)));
      if (newValue !== lastValueRef.current) {
        lastValueRef.current = newValue;
        onChange(newValue);
        Haptics.selectionAsync();
      }
    },
    [onChange]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          const w = widthRef.current;
          startLeftPxRef.current = Math.max(0, Math.min(w, e.nativeEvent.locationX));
          applyLeftPx(startLeftPxRef.current);
        },
        // dx הוא ההפרש הפיזי המצטבר מנקודת ההתחלה - אמין תמיד, בניגוד למדידת מיקום מוחלט שיכולה
        // להתבלבל תחת RTL כפוי
        onPanResponderMove: (_e, gestureState) => {
          applyLeftPx(startLeftPxRef.current + gestureState.dx);
        },
      }),
    [disabled, applyLeftPx]
  );

  const ratio = (value - MIN) / (MAX - MIN);

  return (
    <View
      style={{ height: TOUCH_AREA_HEIGHT, justifyContent: 'center' }}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
      }}
      {...panResponder.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="רמת קושי"
      accessibilityValue={{ min: MIN, max: MAX, now: value }}
      accessibilityState={{ disabled }}
    >
      <View
        pointerEvents="none"
        style={{
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: colors.background[600],
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: 0,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: colors.lime[500],
          width: `${ratio * 100}%`,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: `${(1 - ratio) * 100}%`,
          marginLeft: -THUMB_SIZE / 2,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: colors.lime[500],
          borderWidth: 3,
          borderColor: colors.background[800],
          shadowColor: colors.lime[500],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}
      />
    </View>
  );
};

const IntensitySlider = ({ control, name, isPendingCreate }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      disabled={isPendingCreate}
      defaultValue={5}
      rules={{
        required: 'חובה להזין רמת קושי',
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="typo-label text-background-400">רמת קושי</Text>
            <Text className="typo-h4 text-lime-500">{Math.round(value)}/10</Text>
          </View>

          <View className="p-4 bg-background-800 rounded-2xl border border-background-700/50">
            <SliderTrack value={value} disabled={isPendingCreate} onChange={onChange} />

            <View className="flex-row justify-between mt-2 px-1">
              <Text className="typo-caption-bold text-background-500">קל מאוד</Text>
              <Text className="typo-caption-bold text-lime-500/50">בינוני</Text>
              <Text className="typo-caption-bold text-red-400/70">אינטנסיבי</Text>
            </View>
          </View>
          {error && <Text className="text-red-500 text-right mt-1">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default IntensitySlider;
