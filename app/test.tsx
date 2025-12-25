import React, { forwardRef, useMemo } from 'react';
import { Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

// הוספת ה-Ref Type ב-TSX
const MuscleInfoSheet = forwardRef<BottomSheet, any>((props, ref) => {
  const snapPoints = useMemo(() => ['1%', '20%'], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1} // מתחיל סגור
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#282c34' }}
      handleIndicatorStyle={{ backgroundColor: '#d5ff5f' }}
    >
      <BottomSheetView style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          HELLO FROM SHEET
        </Text>
      </BottomSheetView>
    </BottomSheet>
  );
});

// חשוב ב-forwardRef כדי לזהות את הקומפוננטה בדיבאגר
MuscleInfoSheet.displayName = 'MuscleInfoSheet';

export default MuscleInfoSheet;