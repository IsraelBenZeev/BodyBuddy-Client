import { useProfile } from '@/src/hooks/useProfile';
import { useAuthStore } from '@/src/store/useAuthStore';
import { BodyPart } from '@/src/types/bodtPart';
import BackGround from '@/src/ui/BackGround';
import { IconSwithBody } from '@/src/ui/IconsSVG';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../colors';
import ModalBottom from '../../ui/ModalButtom';
import CardAreaBody from './CardAreaBody';
import AvatarFemale from './female/AvatarFemale';
import AvatarMale from './male/AvatarMale';

const { width, height } = Dimensions.get('window');

const AvatarSelectorScreen = () => {
  const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const { user } = useAuthStore();
  const { data: profile } = useProfile(user?.id);
  const sheetRef = useRef<any>(null);
  useEffect(() => {
    if (!selectedParts.length) {
      sheetRef.current?.close();
    } else {
      sheetRef.current?.snapToIndex(0);
    }
  }, [selectedParts.length]);
  const handleTogglePart = (partName: BodyPart) => {
    setSelectedParts(
      (prev) =>
        prev.includes(partName)
          ? prev.filter((p) => p !== partName) // מסיר
          : [...prev, partName] // מוסיף
    );
  };

  const isSelected = (partName: BodyPart) => selectedParts.includes(partName);
  return (
    <BackGround>
      <View style={styles.mainContainer} className="">
        {/* --- Header: כותרת עליונה --- */}
        <View style={styles.headerSection}>
          <Text style={styles.subTitle}>Target Area</Text>
          <Text style={styles.mainTitle}>בחירת אזור</Text>
          <View style={styles.titleLine} />
        </View>
        {/* --- Content: אזור האווטאר --- */}
        <View style={styles.avatarSection} className="">
          {/* אפקט הילה מאחורי המודל */}
          <View style={styles.glowEffect} />
          <View style={styles.avatarScaleWrapper}>
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
          {/* כפתור סיבוב צף - Glassmorphism */}
          <View style={styles.controlsWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.rotateButton,
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              onPress={() => {
                setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front'));
                // setSelectedParts([]);
              }}
            >
              <View style={styles.rotateIconContainer}>
                <IconSwithBody size={26} color="black" />
              </View>
              <Text style={styles.rotateText}>סובב מודל</Text>
            </Pressable>

            {/* חיווי צד נוכחי */}
            <View style={styles.sideBadge}>
              <Text style={styles.sideBadgeText}>
                {sideAvatar === 'front' ? 'מבט קדמי' : 'מבט אחורי'}
              </Text>
            </View>
          </View>
        </View>

        {/* --- Footer: הנחיה למשתמש --- */}
        <View style={styles.footerSection} className="">
          <Text style={styles.instructionText}>
            לחץ על חלקי הגוף במודל כדי לראות תרגילים רלוונטיים
          </Text>
        </View>
      </View>
      
      {/* מודאל תחתון */}
      <ModalBottom
        ref={sheetRef}
        title="האזורים שנבחרו"
        initialIndex={-1}
        minHeight="40%"
        maxHeight="40%"
        enablePanDownToClose={true}
      // onClose={()=> setSelectedParts([])}
      >
        <View style={{ paddingBottom: 100 }}>
          <CardAreaBody selectedPart={selectedParts} />
        </View>
      </ModalBottom>
    </BackGround>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerSection: {
    paddingHorizontal: 30,
    alignItems: 'flex-end',
    height: 120, // גובה קבוע כדי שלא יזוז
    zIndex: 10,
  },
  subTitle: {
    color: '#71717a', // zinc-500
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  mainTitle: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'right',
  },
  titleLine: {
    height: 6,
    width: 80,
    backgroundColor: colors.lime[500],
    borderRadius: 10,
    marginTop: 8,
  },
  avatarSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 40,
  },
  avatarScaleWrapper: {
    // כאן אנחנו שולטים בגודל האווטאר שלא יברח
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  glowEffect: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width,
    backgroundColor: colors.lime[500],
    opacity: 0.08,
    zIndex: 1,
  },
  controlsWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'flex-end',
    zIndex: 20,
  },
  rotateButton: {
    alignItems: 'center',
  },
  rotateIconContainer: {
    backgroundColor: colors.lime[500],
    padding: 14,
    borderRadius: 22,
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  rotateText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 6,
  },
  sideBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sideBadgeText: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
  },
  footerSection: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
    zIndex: 10,
  },
  instructionText: {
    color: '#52525b', // zinc-600
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AvatarSelectorScreen;
