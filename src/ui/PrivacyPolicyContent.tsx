import BodyBuddyLoadingIcon from '@/src/ui/BodyBuddyLoadingIcon';
import type { PrivacyPolicyContent as PrivacyPolicyContentType } from '@/src/types/privacyPolicy';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type PolicyLanguage = 'he' | 'en';

interface PrivacyPolicyContentProps {
  data?: PrivacyPolicyContentType;
  isLoading: boolean;
  isError: boolean;
}

export default function PrivacyPolicyContent({
  data,
  isLoading,
  isError,
}: PrivacyPolicyContentProps) {
  const [language, setLanguage] = useState<PolicyLanguage>('he');
  const sections = language === 'he' ? data?.content_he : data?.content_en;

  if (isLoading) {
    return (
      <View className="py-10 items-center">
        <BodyBuddyLoadingIcon size={56} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="py-12 items-center px-6">
        <Text className="typo-body text-background-400 text-center">
          לא ניתן לטעון כרגע את מדיניות הפרטיות. נסה שוב מאוחר יותר.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-3 border-b border-white/5">
        <Text className="typo-caption text-background-400">
          {data.created_at
            ? `גרסה ${data.version} · עודכן ב-${format(parseISO(data.created_at), 'dd/MM/yyyy')}`
            : `גרסה ${data.version}`}
        </Text>

        <View className="flex-row rounded-full border border-white/10 overflow-hidden bg-white/5">
          <Pressable
            onPress={() => setLanguage('he')}
            className={`px-3 py-1 ${language === 'he' ? 'bg-lime-500/20' : ''}`}
            accessibilityRole="button"
            accessibilityLabel="הצג את מדיניות הפרטיות בעברית"
            accessibilityState={{ selected: language === 'he' }}
          >
            <Text
              className={`typo-caption-bold ${language === 'he' ? 'text-lime-300' : 'text-background-400'}`}
            >
              HE
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage('en')}
            className={`px-3 py-1 ${language === 'en' ? 'bg-lime-500/20' : ''}`}
            accessibilityRole="button"
            accessibilityLabel="Show privacy policy in English"
            accessibilityState={{ selected: language === 'en' }}
          >
            <Text
              className={`typo-caption-bold ${language === 'en' ? 'text-lime-300' : 'text-background-400'}`}
            >
              EN
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="px-5 py-4" contentContainerStyle={{ gap: 14 }}>
        {sections?.map((section, sectionIndex) => (
          <View
            key={sectionIndex}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4"
          >
            <View className="flex-row items-center gap-3 mb-3">
              {language === 'en' ? (
                <>
                  <View className="flex-1 h-px bg-lime-500/40" importantForAccessibility="no" />
                  <Text className="typo-h4 text-white">{section.title}</Text>
                </>
              ) : (
                <>
                  <Text className="typo-h4 text-white">{section.title}</Text>
                  <View className="flex-1 h-px bg-lime-500/40" importantForAccessibility="no" />
                </>
              )}
            </View>
            {section.body.map((paragraph, paragraphIndex) => (
              <Text
                key={paragraphIndex}
                className={`typo-label text-background-400  mb-2 leading-5 ${language === 'en' ? 'text-right' : ''}`}
              >
                {paragraph}
              </Text>
            ))}
            {section.items && (
              <View className="mt-1 gap-1.5">
                {section.items.map((item, itemIndex) => {
                  const dot = (
                    <View
                      className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2"
                      importantForAccessibility="no"
                    />
                  );
                  const text = (
                    <Text
                      className={`typo-label text-background-400 flex-1 leading-5 ${language === 'en' ? 'text-right' : ''}`}
                    >
                      {item}
                    </Text>
                  );
                  return (
                    <View key={itemIndex} className="flex-row items-start gap-2">
                      {language === 'en' ? (
                        <>
                          {text}
                          {dot}
                        </>
                      ) : (
                        <>
                          {dot}
                          {text}
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
}
