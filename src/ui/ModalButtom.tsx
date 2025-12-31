import { BodyPart } from '@/src/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, ReactNode, useMemo } from 'react';
import { Text, View } from 'react-native';
interface ModalButtomProps {
  children?: ReactNode;
  InitialIndex?: number;
  minimumView?: string;
  initialView?: string;
  title?: string;
}
// הוספת ה-Ref Type -TSX
const ModalButtom = forwardRef<BottomSheet, ModalButtomProps>((props, ref) => {
  const snapPoints = useMemo(
    () => [
      props.minimumView ? props.minimumView : '10%',
      props.initialView ? props.initialView : '40%',
    ],
    []
  );
  const renderHandle = () => (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: 10, // ריווח קטן שתמיד יהיה
        backgroundColor: '#282c34',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
    >
      {/* הפס הצהוב שתמיד מופיע */}
      <View
        style={{
          width: 40,
          height: 4,
          backgroundColor: '#d5ff5f',
          borderRadius: 2,
        }}
      />
      {props.title && (
        <Text
          style={{
            color: '#d5ff5f',
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 8,
          }}
        >
          {props.title}
        </Text>
      )}
    </View>
  );
  return (
    <BottomSheet
      ref={ref}
      index={props.InitialIndex ?? 0} // מתחיל סגור
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: '#282c34' }}
      handleIndicatorStyle={{ backgroundColor: '#d5ff5f' }}
      handleComponent={renderHandle} // כאן הקסם קורה
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
