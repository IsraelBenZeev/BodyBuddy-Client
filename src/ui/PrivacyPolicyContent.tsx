import { colors } from '@/colors';
import ActionButton from '@/src/ui/ActionButton';
import BodyBuddyLoadingIcon from '@/src/ui/BodyBuddyLoadingIcon';
import type { PrivacyPolicyContent as PrivacyPolicyContentType } from '@/src/types/privacyPolicy';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ReactNode, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

const PRIVACY_POLICY_URL = 'https://bodybuddy.fitness/privecypolicy/';

// Matches "Section 8" / "סעיף 8" inside a changes-summary bullet so it can become
// a tap target that scrolls to that section. The number is trusted as-is — there's
// no cross-check against the actual section titles, so it must be kept in sync by
// whoever writes the changes_summary_he/en content.
const SECTION_REF_RE = /(?:Section|סעיף)\s+(\d+)/g;

function renderChangeText(text: string, onSectionPress: (sectionNumber: number) => void) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  SECTION_REF_RE.lastIndex = 0;
  let key = 0;

  while ((match = SECTION_REF_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Text key={key++}>{text.slice(lastIndex, match.index)}</Text>);
    }
    const sectionNumber = Number(match[1]);
    parts.push(
      <Text
        key={key++}
        className="text-lime-300 underline"
        onPress={() => onSectionPress(sectionNumber)}
        accessibilityRole="link"
        accessibilityLabel={`עבור לסעיף ${sectionNumber}`}
        accessibilityHint="לחיצה תגלול לסעיף הרלוונטי"
      >
        {match[0]}
      </Text>
    );
    lastIndex = SECTION_REF_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<Text key={key++}>{text.slice(lastIndex)}</Text>);
  }
  return parts;
}

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
  const changesSummary =
    language === 'he' ? data?.changes_summary_he : data?.changes_summary_en;

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<number, number>>({});

  const scrollToSection = (sectionNumber: number) => {
    const y = sectionOffsets.current[sectionNumber];
    if (y !== undefined) {
      scrollViewRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
    }
  };

  if (isLoading) {
    return (
      <View className="py-10 items-center">
        <BodyBuddyLoadingIcon size={56} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="py-12 items-center px-6 gap-4">
        <Text className="typo-body text-background-400 text-center">
          לא ניתן לטעון כרגע את מדיניות הפרטיות. נסה שוב מאוחר יותר.
        </Text>
        <ActionButton
          variant="outline"
          size="sm"
          iconName="open-outline"
          label="צפה במדיניות הפרטיות באתר"
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
          accessibilityHint="לחיצה תפתח את מדיניות הפרטיות בדפדפן"
        />
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

      <ScrollView
        ref={scrollViewRef}
        className="px-5 py-4"
        contentContainerClassName="items-center"
        contentContainerStyle={{ gap: 14 }}
      >
        {changesSummary && changesSummary.length > 0 && (
          <View
            className="w-full bg-lime-500/[0.12] border border-lime-500/40 rounded-3xl p-4"
            accessible
            accessibilityRole="text"
            accessibilityLabel={`מה השתנה בגרסה זו: ${changesSummary.join('. ')}`}
          >
            <View
              className={`flex-row items-center gap-2 mb-3 ${language === 'en' ? 'flex-row-reverse' : ''}`}
            >
              <View
                className="w-7 h-7 items-center justify-center rounded-full bg-lime-500/20"
                importantForAccessibility="no"
              >
                <Ionicons name="sparkles" size={14} color={colors.lime[300]} />
              </View>
              <Text className="typo-h4 text-lime-300">
                {language === 'en' ? "What's new in this version" : 'מה השתנה בגרסה זו'}
              </Text>
            </View>
            <View className="gap-1.5">
              {changesSummary.map((change, changeIndex) => {
                const dot = (
                  <View
                    className="w-1.5 h-1.5 rounded-full bg-lime-300 mt-2"
                    importantForAccessibility="no"
                  />
                );
                const text = (
                  <Text
                    className={`typo-label text-background-400 flex-1 leading-5 ${language === 'en' ? 'text-right' : ''}`}
                  >
                    {renderChangeText(change, scrollToSection)}
                  </Text>
                );
                return (
                  <View key={changeIndex} className="flex-row items-start gap-2">
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
          </View>
        )}
        {sections?.map((section, sectionIndex) => {
          const sectionNumber = sectionIndex + 1;
          const numberBadge = (
            <View
              className="w-6 h-6 items-center justify-center rounded-full bg-lime-500/15 border border-lime-500/40"
              importantForAccessibility="no"
            >
              <Text className="typo-caption-bold text-lime-300">{sectionNumber}</Text>
            </View>
          );
          return (
            <View
              key={sectionIndex}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4"
              onLayout={(e) => {
                sectionOffsets.current[sectionNumber] = e.nativeEvent.layout.y;
              }}
            >
              <View className="flex-row items-center gap-3 mb-3">
                {language === 'en' ? (
                  <>
                    <View className="flex-1 h-px bg-lime-500/40" importantForAccessibility="no" />
                    {numberBadge}
                    <Text className="typo-h4 text-white">{section.title}</Text>
                  </>
                ) : (
                  <>
                    <Text className="typo-h4 text-white">{section.title}</Text>
                    {numberBadge}
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
          );
        })}
      </ScrollView>
    </>
  );
}
