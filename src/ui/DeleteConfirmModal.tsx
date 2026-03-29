import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  infoNote?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  visible,
  title,
  message,
  infoNote,
  onConfirm,
  onCancel,
  isDeleting = false,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="bg-background-800 rounded-3xl w-full border border-white/10 overflow-hidden">
          {/* Header */}
          <View className="items-center pt-6 pb-4 px-6">
            <View className="bg-red-500/15 rounded-full p-3 mb-3">
              <Ionicons name="trash-outline" size={28} color="#ef4444" />
            </View>
            <Text className="typo-h3 text-white text-center">{title}</Text>
            <Text className="typo-label text-gray-400 text-center mt-2 leading-5">{message}</Text>
          </View>

          {/* INFO note */}
          {infoNote != null && (
            <View className="mx-4 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 flex-row-reverse items-start">
              <Ionicons name="information-circle-outline" size={18} color="#60a5fa" />
              <Text className="typo-caption text-blue-300 leading-5 flex-1 mr-2 text-right">
                {infoNote}
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View className="flex-row border-t border-white/10">
            <Pressable
              onPress={onCancel}
              disabled={isDeleting}
              className="flex-1 py-4 items-center border-l border-white/10"
              accessibilityRole="button"
              accessibilityLabel="ביטול"
            >
              <Text className="typo-btn-cta text-white">ביטול</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-4 items-center bg-red-500/10"
              accessibilityRole="button"
              accessibilityLabel="מחק"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Text className="typo-btn-cta text-red-400">מחק</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
