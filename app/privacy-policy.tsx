import { colors } from '@/colors';
import { usePrivacyPolicy } from '@/src/hooks/usePrivacyPolicy';
import BodyBuddyLoadingIcon from '@/src/ui/BodyBuddyLoadingIcon';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

type PolicyLanguage = 'he' | 'en';

export default function PrivacyPolicyScreen() {
  const { data, isLoading, isError } = usePrivacyPolicy();
  const [language, setLanguage] = useState<PolicyLanguage>('he');
  const sections = language === 'he' ? data?.content_he : data?.content_en;

  return (
    <View className="flex-1 items-center justify-center bg-black/60 px-6">
      <View className="bg-background-900 rounded-3xl w-full max-h-[80%] border border-lime-500/30 overflow-hidden">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-4 border-b border-white/10">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 items-center justify-center rounded-full bg-white/5"
            accessibilityRole="button"
            accessibilityLabel="סגור"
            accessibilityHint="לחץ כדי לסגור את מדיניות הפרטיות"
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={colors.background[400]} />
          </Pressable>
          <Text className="typo-h3 text-white" accessibilityRole="header">
            מדיניות פרטיות
          </Text>
          <View className="w-11 h-11" importantForAccessibility="no" />
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="py-10 items-center">
            <BodyBuddyLoadingIcon size={56} />
          </View>
        ) : isError || !data ? (
          <View className="py-12 items-center px-6">
            <Text className="typo-body text-background-400 text-center">
              לא ניתן לטעון כרגע את מדיניות הפרטיות. נסה שוב מאוחר יותר.
            </Text>
          </View>
        ) : (
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
        )}
      </View>
    </View>
  );
}
