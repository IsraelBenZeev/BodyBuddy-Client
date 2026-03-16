import { colors } from '@/colors';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, ReactNode, useCallback, useMemo } from 'react';
import { Platform, Text, View } from 'react-native';

interface ModalBottomProps {
  children?: ReactNode;
  initialIndex?: number;
  minHeight?: string | number;
  maxHeight?: string | number;
  title?: string;
  enablePanDownToClose?: boolean;
  useScrollView?: boolean;
  onClose?: () => void;
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
  } = props;

  const snapPoints = useMemo(() => [minHeight, maxHeight], [minHeight, maxHeight]);

  const renderHandle = useCallback(
    () => (
      <View className="items-center py-3 bg-background-900 rounded-t-[20px]">
        <View className="w-10 h-1 bg-lime-400 rounded-sm" />
        {title && (
          <Text className="text-lime-400 text-lg font-bold mt-2.5 text-center">{title}</Text>
        )}
      </View>
    ),
    [title]
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
