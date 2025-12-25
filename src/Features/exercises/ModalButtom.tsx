import { BodyPart } from '@/src/types';
import BottomSheet, { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { forwardRef, ReactNode, useMemo } from 'react';
import { Text } from 'react-native';
interface ModalButtomProps {
  children?: ReactNode;
}
// הוספת ה-Ref Type -TSX
const ModalButtom = forwardRef<BottomSheet, ModalButtomProps>((props, ref) => {
  const snapPoints = useMemo(() => ['1%', '40%'], []);

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
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{props.children}</Text>
      </BottomSheetView>
    </BottomSheet>
  );
});

// חשוב ב-forwardRef כדי לזהות את הקומפוננטה בדיאגר
ModalButtom.displayName = 'MuscleInfoSheet';

export default ModalButtom;
interface ButtonOPenModalSheet {
  selctedPart: BodyPart | null;
  openSheet: () => void;
  title: string;
}
export const ButtonOPenSheet = ({ openSheet, title, selctedPart }: ButtonOPenModalSheet) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!selctedPart) return;
        openSheet();
      }}
      style={{ backgroundColor: '#d5ff5f', padding: 15, borderRadius: 10 }}
    >
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );
};
