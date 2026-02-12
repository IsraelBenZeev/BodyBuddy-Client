import { colors } from '@/colors';
import FoodSelectionTabs from '@/src/Features/nutrition/add/FoodSelectionTabs';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

export interface ModalAddFoodsProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  date: string;
}

const sheetStyles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center' as const,
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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background[900] }}>
        <View style={sheetStyles.handleContainer}>
          <Pressable
            onPress={onClose}
            style={{ position: 'absolute' as const, left: 16, top: 12 }}
          >
            <Ionicons name="close" size={24} color={colors.white} />
          </Pressable>
          <View style={sheetStyles.indicator} />
        </View>
        <FoodSelectionTabs userId={userId} date={date} onClose={onClose} />
      </View>
    </Modal>
  );
};
export default ModalAddFoods;