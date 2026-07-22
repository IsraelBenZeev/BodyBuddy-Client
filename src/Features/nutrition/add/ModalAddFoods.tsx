import { colors } from '@/colors';
import FoodSelectionTabs from '@/src/Features/nutrition/add/FoodSelectionTabs';
import GlobalFaild from '@/src/ui/Animations/GloabalFaild';
import GlobalSuccess from '@/src/ui/Animations/GloabalSuccess';
import CloseButton from '@/src/ui/CloseButton';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ModalAddFoodsProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  date: string;
}

const sheetStyles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 56,
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
});

const ModalAddFoods = ({ visible, onClose, userId, date }: ModalAddFoodsProps) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background[900], paddingTop: insets.top }}>
        <View style={sheetStyles.handleContainer}>
          <View style={{ position: 'absolute' as const, right: 16, top: 1, zIndex: 10 }}>
            <CloseButton onPress={onClose} variant="default" size={44} iconSize={24} />
          </View>
          <View style={sheetStyles.indicator} />
        </View>
        <FoodSelectionTabs userId={userId} date={date} onClose={onClose} />
        <GlobalSuccess />
        <GlobalFaild />
      </View>
    </Modal>
  );
};
export default ModalAddFoods;