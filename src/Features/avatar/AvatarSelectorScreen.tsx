import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import { BodyPart } from '@/src/types/bodtPart';
import BackGround from '@/src/ui/BackGround';
import { IconSwithBody } from '@/src/ui/IconsSVG';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import FloatingSelectionBar from './FloatingSelectionBar';
import AvatarFemale from './female/AvatarFemale';
import AvatarMale from './male/AvatarMale';

const { width, height } = Dimensions.get('window');

const AvatarSelectorScreen = () => {
  const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const { user } = useAuthStore();
  const { data: profile } = useProfile(user?.id);
  const router = useRouter();

  const handleTogglePart = useCallback((partName: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(partName) ? prev.filter((p) => p !== partName) : [...prev, partName]
    );
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

  const isSelected = (partName: BodyPart) => selectedParts.includes(partName);

  return (
    <BackGround>
      <View className="flex-1 relative">
        {/* --- Header --- */}
        <View className="px-[30px] items-end h-[120px] z-10">
          <Text className="typo-caption-bold text-zinc-500 uppercase tracking-[2px]">
            Target Area
          </Text>
          <Text className="typo-h1 text-white text-right">בחירת אזור</Text>
          <View className="h-1.5 w-20 bg-lime-500 rounded-[10px] mt-2" />
        </View>

        {/* --- Content: אזור האווטאר --- */}
        <View className="flex-1 justify-center items-center relative pt-10 mb-12">
          {/* אפקט הילה - גודל דינמי, חייב style */}
          <View
            className="absolute rounded-full bg-lime-500 opacity-[0.08] z-[1]"
            style={{ width: width * 0.6, height: width * 0.6 }}
          />

          {/* גובה דינמי, חייב style */}
          <View className="justify-center items-center z-[5]" style={{ height: height * 0.5 }}>
            {profile?.gender === 'female' ? (
              <AvatarFemale
                avatarSide={sideAvatar}
                isSelected={isSelected}
                handleTogglePart={handleTogglePart}
              />
            ) : (
              <AvatarMale
                avatarSide={sideAvatar}
                isSelected={isSelected}
                handleTogglePart={handleTogglePart}
              />
            )}
          </View>
        </View>
        {/* כפתור סיבוב + חיווי צד */}
        <View
          className="absolute left-[30px] z-20"
          style={{ top: '63%', left: 30, transform: [{ translateY: -30 }] }}
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
          style={{ top: '67%', right: 30, transform: [{ translateY: -30 }] }}
        >
          <Text className="typo-caption-bold text-zinc-400">
            {sideAvatar === 'front' ? 'מבט קדמי' : 'מבט אחורי'}
          </Text>
        </View>

        {/* --- Footer --- */}
        <View className="h-[100px] justify-end items-center px-10 mb-5 z-10">
          <Text className="typo-caption text-zinc-600 text-center leading-[18px]">
            לחץ על חלקי הגוף במודל כדי לראות תרגילים רלוונטיים
          </Text>
        </View>
      </View>

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
