import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import { BodyPart } from '@/src/types/bodtPart';
import BackGround from '@/src/ui/BackGround';
import { IconSwithBody } from '@/src/ui/IconsSVG';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FloatingSelectionBar from './FloatingSelectionBar';
import AvatarFemale from './female/AvatarFemale';
import AvatarMale from './male/AvatarMale';
import { colors } from '@/colors';

const { width, height } = Dimensions.get('window');

// Avatar SVG aspect ratio: FIGMA_HEIGHT / FIGMA_WIDTH = 1726 / 871
// SVG rendered height = svgWidth * ASPECT_RATIO * 0.9
// Cap svgWidth so the rendered height fits within the allocated container (height * 0.55)
const AVATAR_ASPECT_RATIO = 1726 / 871;
const AVATAR_CONTAINER_HEIGHT = Math.min(height * 0.6, height - 260);
const AVATAR_SVG_WIDTH = Math.min(width * 0.82, AVATAR_CONTAINER_HEIGHT / (AVATAR_ASPECT_RATIO * 0.9));
const TAB_BAR_HEIGHT = 60;

const AvatarSelectorScreen = () => {
  const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const { user } = useAuthStore();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const router = useRouter();
  const { bottom: bottomInset } = useSafeAreaInsets();

  const handleTogglePart = useCallback((partName: BodyPart) => {
    setSelectedParts((prev) => {
      const isRemoving = prev.includes(partName);
      Haptics.impactAsync(isRemoving ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
      return isRemoving ? prev.filter((p) => p !== partName) : [...prev, partName];
    });
  }, []);

  const handleToggleSide = useCallback(
    () => setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front')),
    []
  );

  const handleNavigate = useCallback(() => {
    router.navigate({
      pathname: '/exercises/[parts]',
      params: {
        parts: JSON.stringify(selectedParts),
        mode: 'view',
      },
    });
  }, [selectedParts, router]);

  const handleNavigateCardio = useCallback(() => {
    router.navigate({
      pathname: '/exercises/[parts]',
      params: {
        parts: JSON.stringify(['cardio']),
        mode: 'view',
      },
    });
  }, [router]);

  const isSelected = (partName: BodyPart) => selectedParts.includes(partName);

  return (
    <BackGround>
      <View className="flex-1 relative ">
        {/* --- Header --- */}
        <View className="px-[30px] items-start h-[120px] z-10  ">
          <Text className="typo-caption-bold text-zinc-500 uppercase tracking-[2px]">
            Target Area
          </Text>
          <Text className="typo-h1 text-white text-right">בחירת אזור</Text>
          <View className="h-1.5 w-20 bg-lime-500 rounded-[10px] mt-2" />
        </View>

        {/* --- Content: אזור האווטאר --- */}
        <View className="flex-1 items-center relative pt-10">
          {/* אפקט הילה - גודל דינמי, חייב style */}
          <View
            className="absolute rounded-full bg-lime-500 opacity-[0.08] z-[1]"
            style={{ width: width * 0.6, height: width * 0.6, top: height * 0.09 }}
          />

          {/* גובה דינמי, חייב style */}
          <View className="justify-center items-center z-[5]" style={{ height: AVATAR_CONTAINER_HEIGHT }}>
            {!isProfileLoading && (
              profile?.gender === 'female' ? (
                <AvatarFemale
                  avatarSide={sideAvatar}
                  isSelected={isSelected}
                  handleTogglePart={handleTogglePart}
                  svgWidthOverride={AVATAR_SVG_WIDTH}
                />
              ) : (
                <AvatarMale
                  avatarSide={sideAvatar}
                  isSelected={isSelected}
                  handleTogglePart={handleTogglePart}
                  svgWidthOverride={AVATAR_SVG_WIDTH}
                />
              )
            )}
          </View>

          {/* טקסט הדרכה מתחת לאווטאר */}
          {/* <Text className="typo-caption text-zinc-600 text-center leading-[18px] px-10 mt-4 z-[5]">
            לחץ על חלקי הגוף במודל כדי לראות תרגילים רלוונטיים
          </Text> */}
        </View>
        {/* כפתור סיבוב + חיווי צד */}
        <View
          className="absolute right-[30px] z-20"
          style={{ top: '63%', transform: [{ translateY: -30 }] }}
        >
          <Pressable
            className="items-center active:opacity-70 active:scale-95"
            onPress={handleToggleSide}
            accessibilityRole="button"
            accessibilityLabel="סובב מודל"
          >
            {/* צל עם צבע lime מותאם - חייב style */}
            <View
              className="bg-lime-500 p-3.5 rounded-[22px]"
              style={{
                shadowColor: '#84cc16',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 10,
              }}
            >
              <IconSwithBody size={26} color="black" />
            </View>
            <Text className="typo-caption-bold text-white mt-1.5">סובב מודל</Text>
          </Pressable>
        </View>
        {/* חיווי צד נוכחי */}
        <View
          className="absolute z-20 bg-white/[0.06] px-3 py-1.5 rounded-xl border border-white/10"
          style={{ top: '67%', left: 30, transform: [{ translateY: -30 }] }}
        >
          <Text className="typo-caption-bold text-zinc-400">
            {sideAvatar === 'front' ? 'מבט קדמי' : 'מבט אחורי'}
          </Text>
        </View>

      </View>
      

      {/* כפתור אירובי - מוצג רק כשלא נבחרו חלקי גוף, כדי לא להתנגש עם בר הבחירה */}
      {selectedParts.length === 0 && (
        <View
          className="absolute right-6  flex flex-col  top-20 items-center"
          style={{ bottom: TAB_BAR_HEIGHT + bottomInset - 10, zIndex: 40 }}
          pointerEvents="box-none"
        >
          <Pressable
            className="items-center active:opacity-70 active:scale-95"
            onPress={handleNavigateCardio}
            accessibilityRole="button"
            accessibilityLabel="עבור לתרגילי אירובי"
            accessibilityHint="פותח רשימת תרגילי אירובי כמו הליכון ואופניים"
          >
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 52,
                height: 52,
                backgroundColor: colors.background[700],
                borderWidth: 1,
                borderColor: 'rgba(150, 200, 40, 0.5)',
              }}
            >
              <Ionicons name="walk-outline" size={24} color="#bef264" />
            </View>
            <Text className="typo-caption-bold text-lime-300 mt-1.5">תרגילי אירובי</Text>
          </Pressable>
        </View>
      )}

      {/* בר בחירה צף */}
      {selectedParts.length > 0 && (
        <FloatingSelectionBar
          selectedParts={selectedParts}
          onDeselectPart={handleTogglePart}
          onClearAll={() => setSelectedParts([])}
          onNavigate={handleNavigate}
        />
      )}
    </BackGround>
  );
};

export default AvatarSelectorScreen;
