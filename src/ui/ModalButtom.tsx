import { colors } from '@/colors';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'; // הסרנו את ה-Backdrop מהייבוא
import { forwardRef, ReactNode, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ModalBottomProps {
  children?: ReactNode;
  initialIndex?: number;
  minHeight?: string | number;
  maxHeight?: string | number;
  title?: string;
  enablePanDownToClose?: boolean;
  useScrollView?: boolean; // prop חדש
  onClose?: () => void; // prop חדש
}

const ModalBottom = forwardRef<BottomSheet, ModalBottomProps>((props, ref) => {
  const {
    children,
    initialIndex = 0,
    minHeight = '10%',
    maxHeight = '40%',
    title,
    enablePanDownToClose = false,
    useScrollView = true, // ברירת מחדל true
    onClose,
  } = props;

  const snapPoints = useMemo(() => [minHeight, maxHeight], [minHeight, maxHeight]);

  const renderHandle = useCallback(
    () => (
      <View style={styles.handleContainer}>
        <View style={styles.indicator} />
        {title && <Text style={styles.titleText}>{title}</Text>}
      </View>
    ),
    [title]
  );
  const handleSheetChange = useCallback(
    
    (index: number) => {
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheet
      ref={ref}
      index={initialIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      handleComponent={renderHandle}
      backgroundStyle={{ backgroundColor: colors.background[900] }}
      activeOffsetY={[-1, 1]}
      containerStyle={{ pointerEvents: 'box-none' }}
      onChange={handleSheetChange}
    >
      {useScrollView ? (
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainer}
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

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.background[900],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.lime[400],
    borderRadius: 2,
  },
  titleText: {
    color: colors.lime[400],
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

ModalBottom.displayName = 'ModalBottom';

export default ModalBottom;
