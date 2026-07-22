import { colors } from '@/colors';
import PrivacyPolicyContent from '@/src/ui/PrivacyPolicyContent';
import type { PrivacyPolicyContent as PrivacyPolicyContentType } from '@/src/types/privacyPolicy';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface PrivacyPolicyCardProps {
  title: string;
  onClose?: () => void;
  footer?: ReactNode;
  data?: PrivacyPolicyContentType;
  isLoading: boolean;
  isError: boolean;
}

export default function PrivacyPolicyCard({
  title,
  onClose,
  footer,
  data,
  isLoading,
  isError,
}: PrivacyPolicyCardProps) {
  return (
    <View className="bg-background-900 rounded-3xl w-full max-h-[80%] border border-lime-500/30 overflow-hidden">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-4 border-b border-white/10">
        {onClose ? (
          <Pressable
            onPress={onClose}
            className="w-11 h-11 items-center justify-center rounded-full bg-white/5"
            accessibilityRole="button"
            accessibilityLabel="סגור"
            accessibilityHint="לחץ כדי לסגור את מדיניות הפרטיות"
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={colors.background[400]} />
          </Pressable>
        ) : (
          <View className="w-11 h-11" importantForAccessibility="no" />
        )}
        <Text className="typo-h3 text-white" accessibilityRole="header">
          {title}
        </Text>
        <View className="w-11 h-11" importantForAccessibility="no" />
      </View>

      <PrivacyPolicyContent data={data} isLoading={isLoading} isError={isError} />

      {footer && <View className="p-4 border-t border-white/10">{footer}</View>}
    </View>
  );
}
