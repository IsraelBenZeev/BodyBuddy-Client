import { colors } from '@/colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
const TRACK_WIDTH = 18;
const THUMB_SIZE = 26;
const TOUCH_AREA_WIDTH = 48;
const SLIDER_HEIGHT = 150;

// צבע דגש דינמי לפי רמת הקושי - עקבי עם הפלטה הסמנטית של האפליקציה
// (red לאזהרה/עוצמה, lime כצבע הדגש הראשי)
const getAccent = (value: number) => {
  if (value >= 8) return { color: colors.red[400] };
  if (value >= 4) return { color: colors.lime[300] };
  return { color: colors.background[300] };
};

interface SliderTrackProps {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

// סליידר אנכי (ציר Y) במקום אופקי: תנועה למעלה/למטה אינה מושפעת מ-RTL כפוי
// (I18nManager.forceRTL הופך רק פריסה וקואורדינטות אופקיות - לא אנכיות),
// כך שאין צורך בהתאמות ידניות בין מיקום המגע לבין מיקום התצוגה
const SliderTrack = ({ value, disabled, onChange }: SliderTrackProps) => {
  const heightRef = useRef(0);
  const startTopPxRef = useRef(0);
  const lastValueRef = useRef(value);

  lastValueRef.current = value;

  // ממיר מיקום פיזי (פיקסלים מהקצה העליון של הרצועה) לערך: למעלה (topPx=0) = אינטנסיבי, למטה (topPx=h) = קל מאוד
  const applyTopPx = useCallback(
    (topPx: number) => {
      const h = heightRef.current;
      if (h <= 0) return;
      const clamped = Math.max(0, Math.min(h, topPx));
      const ratio = 1 - clamped / h;
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
          const h = heightRef.current;
          startTopPxRef.current = Math.max(0, Math.min(h, e.nativeEvent.locationY));
          applyTopPx(startTopPxRef.current);
        },
        // dy הוא ההפרש הפיזי המצטבר מנקודת ההתחלה - אמין תמיד, ולא תלוי בכיווניות RTL/LTR
        onPanResponderMove: (_e, gestureState) => {
          applyTopPx(startTopPxRef.current + gestureState.dy);
        },
      }),
    [disabled, applyTopPx]
  );

  const ratio = (value - MIN) / (MAX - MIN);
  const accent = getAccent(value);

  return (
    <View
      style={{ width: TOUCH_AREA_WIDTH, height: SLIDER_HEIGHT, alignItems: 'center' }}
      onLayout={(e) => {
        heightRef.current = e.nativeEvent.layout.height;
      }}
      {...panResponder.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="רמת קושי"
      accessibilityValue={{ min: MIN, max: MAX, now: value }}
      accessibilityState={{ disabled }}
    >
      {/* מסלול עם קו מתאר, וגרדיאנט קבוע (קל→אינטנסיבי) שנחשף לפי הערך */}
      <View
        pointerEvents="none"
        style={{
          width: TRACK_WIDTH,
          height: '100%',
          borderRadius: TRACK_WIDTH / 2,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          backgroundColor: colors.background[800],
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[colors.red[400], colors.lime[400], colors.lime[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${(1 - ratio) * 100}%`,
            backgroundColor: colors.background[800],
          }}
        />
      </View>

      {/* ידית עם זוהר בצבע הדגש הדינמי */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: `${ratio * 100}%`,
          marginBottom: -THUMB_SIZE / 2,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: colors.background[900],
          borderWidth: 3,
          borderColor: accent.color,
          shadowColor: accent.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 6,
          elevation: 4,
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
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const accent = getAccent(value);
        return (
          <View className="mb-6">
            <Text className="typo-label text-background-400 mb-3 text-left">רמת קושי</Text>
            <View
              className="p-5 rounded-3xl shadow-black shadow-md flex-row items-center justify-center gap-4"
              style={{
                backgroundColor: colors.background[900],
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <View className="items-center">
                <Text className="typo-caption-bold text-red-400/70 mb-1">אינטנסיבי</Text>
                <SliderTrack value={value} disabled={isPendingCreate} onChange={onChange} />
                <Text className="typo-caption-bold text-background-500 mt-1">קל מאוד</Text>
              </View>

              <View className="items-center">
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 48, fontWeight: '200', color: colors.background[400], lineHeight: 52 }}>
                    10
                  </Text>
                  <Text
                    style={{
                      fontSize: 48,
                      fontWeight: '200',
                      color: colors.background[400],
                      lineHeight: 52,
                      marginHorizontal: 2,
                    }}
                  >
                    /
                  </Text>
                  <Text style={{ fontSize: 48, fontWeight: '200', color: accent.color, lineHeight: 52 }}>
                    {Math.round(value)}
                  </Text>
                </View>
              </View>
            </View>
            {error && <Text className="text-red-500 text-right mt-1">{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default IntensitySlider;
