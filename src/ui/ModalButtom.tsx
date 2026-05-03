import { colors } from '@/colors';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { forwardRef, ReactNode, useCallback, useMemo } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface ModalBottomProps {
  children?: ReactNode;
  initialIndex?: number;
  minHeight?: string | number;
  maxHeight?: string | number;
  title?: string;
  enablePanDownToClose?: boolean;
  useScrollView?: boolean;
  onClose?: () => void;
  onClosePress?: () => void;
  onChange?: (isOpen: boolean) => void;
}

const ModalBottom = forwardRef<BottomSheet, ModalBottomProps>((props, ref) => {
  const {
    children,
    initialIndex = 0,
    minHeight = '10%',
    maxHeight = '40%',
    title,
    enablePanDownToClose = false,
    useScrollView = true,
    onChange,
    onClose,
    onClosePress,
  } = props;

  const snapPoints = useMemo(() => [minHeight, maxHeight], [minHeight, maxHeight]);

  const renderHandle = useCallback(
    () => (
      <View className="py-3 bg-background-900 rounded-t-[20px]">
        <View className="items-center">
          <View className="w-10 h-1 bg-lime-400 rounded-sm" />
        </View>
        {(title || onClosePress) && (
          <View className="flex-row items-center justify-between px-4 mt-2.5">
            <View className="w-7">
              {onClosePress && (
                <Pressable
                  onPress={onClosePress}
                  hitSlop={8}
                  accessibilityLabel="סגור"
                  accessibilityRole="button"
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <X size={20} color={colors.lime[400]} strokeWidth={2} />
                </Pressable>
              )}
            </View>
            {title && (
              <Text className="typo-h4 text-lime-400 text-center flex-1">{title}</Text>
            )}
            <View className="w-7" />
          </View>
        )}
      </View>
    ),
    [title, onClosePress]
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      if (onChange) {
        onChange(index !== -1);
      }
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onChange, onClose]
  );

  return (
    <BottomSheet
      ref={ref}
      index={initialIndex}
      snapPoints={snapPoints}
      animateOnMount={false}
      enablePanDownToClose={enablePanDownToClose}
      handleComponent={renderHandle}
      backgroundStyle={{ backgroundColor: colors.background[900] }}
      activeOffsetY={[-1, 1]}
      containerStyle={{
        pointerEvents: 'box-none',
        ...(Platform.OS === 'android' && { elevation: 999, zIndex: 999 }),
      }}
      onChange={handleSheetChange}
    >
      {useScrollView ? (
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        children
      )}
    </BottomSheet>
  );
});

ModalBottom.displayName = 'ModalBottom';

export default ModalBottom;
