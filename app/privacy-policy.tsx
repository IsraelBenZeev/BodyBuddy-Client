import { usePrivacyPolicy } from '@/src/hooks/usePrivacyPolicy';
import { useTermsOfService } from '@/src/hooks/useTermsOfService';
import PrivacyPolicyCard from '@/src/ui/PrivacyPolicyCard';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type LegalTab = 'privacy' | 'terms';

export default function PrivacyPolicyScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<LegalTab>(tab === 'terms' ? 'terms' : 'privacy');

  const privacyPolicy = usePrivacyPolicy();
  const termsOfService = useTermsOfService();
  const active = activeTab === 'privacy' ? privacyPolicy : termsOfService;

  return (
    <View className="flex-1 items-center justify-center bg-black/60 px-6">
      <View className="w-full gap-3">
        <View
          className="flex-row self-center rounded-full border border-white/10 overflow-hidden bg-white/5"
          accessibilityRole="tablist"
        >
          <Pressable
            onPress={() => setActiveTab('privacy')}
            className={`px-4 py-2 ${activeTab === 'privacy' ? 'bg-lime-500/20' : ''}`}
            accessibilityRole="tab"
            accessibilityLabel="מדיניות פרטיות"
            accessibilityState={{ selected: activeTab === 'privacy' }}
          >
            <Text
              className={`typo-caption-bold ${activeTab === 'privacy' ? 'text-lime-300' : 'text-background-400'}`}
            >
              מדיניות פרטיות
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('terms')}
            className={`px-4 py-2 ${activeTab === 'terms' ? 'bg-lime-500/20' : ''}`}
            accessibilityRole="tab"
            accessibilityLabel="תנאי שימוש"
            accessibilityState={{ selected: activeTab === 'terms' }}
          >
            <Text
              className={`typo-caption-bold ${activeTab === 'terms' ? 'text-lime-300' : 'text-background-400'}`}
            >
              תנאי שימוש
            </Text>
          </Pressable>
        </View>

        <PrivacyPolicyCard
          title={activeTab === 'privacy' ? 'מדיניות פרטיות' : 'תנאי שימוש'}
          onClose={() => router.back()}
          data={active.data}
          isLoading={active.isLoading}
          isError={active.isError}
        />
      </View>
    </View>
  );
}
