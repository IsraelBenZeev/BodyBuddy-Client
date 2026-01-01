// import { useEffect, useRef, useState } from 'react';
// import { Pressable, Text, View } from 'react-native';
// import { colors } from '../../../colors';

// import { BodyPart } from '@/src/types';
// import BackGround from '@/src/ui/BackGround';
// import { IconSwithBody } from '@/src/ui/IconsSVG';
// import ModalButtom from '../../ui/ModalButtom';
// import CardAreaBody from './CardAreaBody';
// import AvatarFemale from './female/AvatarFemale';
// import AvatarMaleFront from './male/AvatarMale';
const fakeUser = {
  gender: 'female',
  name: 'Alice',
  age: 28,
  height: 165,
  weight: 60,
  mail: 'alice@example.com',
};
const fakeUser2 = {
  gender: 'male',
  name: 'Bob',
  age: 28,
  height: 175,
  weight: 75,
  mail: 'bob@example.com',
};
// const AvatarSelectorScreen = () => {
//   const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
//   const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

//   const sheetRef = useRef<any>(null);
//   const openSheet = () => {
//     sheetRef.current?.snapToIndex(selectedPart ? 1 : -1);
//   };
//   useEffect(() => {
//     if (!selectedPart) {
//       sheetRef.current?.close();
//       return;
//     }
//     sheetRef.current?.snapToIndex(selectedPart ? 1 : -1);
//   }, [selectedPart]);
//   let Avatar =
//     fakeUser2.gender === 'female' ? (
//       <AvatarFemale avatarSide={sideAvatar} />
//     ) : (
//       <AvatarMaleFront
//         avatarSide={sideAvatar}
//         selectedPart={selectedPart}
//         setSelectedPart={setSelectedPart}
//       />
//     );
//   return (
//     <BackGround>
//       <View className="flex-1 w-full h-full items-center justify-between">
//         <View className="flex-1 justify-center items-center px-4">
//           <Text className="text-primary-50 text-5xl font-bold ">גע לבחירת אזור</Text>
//         </View>
//         <View className="justify-center items-center flex-2 relative self-center pr-2">
//           {Avatar}
//           <Pressable
//             className="absolute bottom-32 left-12 font-bold items-center justify-center"
//             onPress={() => {
//               setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front'));
//               setSelectedPart(null);
//             }}
//           >
//             <IconSwithBody size={26} color={colors.lime[700]} />
//             <Text className="text-lime-700 text-xs">סובב</Text>
//             {/* <MaterialIcons name="3d-rotation" size={38} color={colors.lime[300]} /> */}
//           </Pressable>
//         </View>
//       </View>
//       <ModalButtom ref={sheetRef} InitialIndex={-1} minimumView="6%" initialView='45%'>
//         <CardAreaBody selectedPart={selectedPart} />
//       </ModalButtom>
//     </BackGround>
//   );
// };

// export default AvatarSelectorScreen;
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../../colors';
import { BodyPart } from '@/src/types';

// UI Components
import BackGround from '@/src/ui/BackGround';
import { IconSwithBody } from '@/src/ui/IconsSVG';
import ModalButtom from '../../ui/ModalButtom';
import CardAreaBody from './CardAreaBody';

// Avatars
import AvatarFemale from './female/AvatarFemale';
import AvatarMaleFront from './male/AvatarMale';

const { width, height } = Dimensions.get('window');

const AvatarSelectorScreen = () => {
  const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

  const sheetRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedPart) {
      sheetRef.current?.close();
    } else {
      sheetRef.current?.snapToIndex(1);
    }
  }, [selectedPart]);

  return (
    <BackGround>
      <View style={styles.mainContainer} className=''>
        {/* --- Header: כותרת עליונה --- */}
        <View style={styles.headerSection}>
          <Text style={styles.subTitle}>Target Area</Text>
          <Text style={styles.mainTitle}>בחירת אזור</Text>
          <View style={styles.titleLine} />
        </View>
        {/* --- Content: אזור האווטאר --- */}
        <View style={styles.avatarSection} className=''>
          {/* אפקט הילה מאחורי המודל */}
          <View style={styles.glowEffect} />
          <View style={styles.avatarScaleWrapper}>
            {fakeUser2.gender === 'female' ? (
              <AvatarFemale avatarSide={sideAvatar} />
            ) : (
              <AvatarMaleFront
                avatarSide={sideAvatar}
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
              />
            )}
          </View>
          {/* כפתור סיבוב צף - Glassmorphism */}
          <View style={styles.controlsWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.rotateButton,
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
              ]}
              onPress={() => {
                setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front'));
                setSelectedPart(null);
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
        <View style={styles.footerSection} className=''>
          <Text style={styles.instructionText}>
            לחץ על חלקי הגוף במודל כדי לראות תרגילים רלוונטיים
          </Text>
        </View>

      </View>

      {/* מודאל תחתון */}
      <ModalButtom ref={sheetRef} InitialIndex={-1} minimumView="6%" initialView="30%">
        <View style={{ padding: 0 }}>
          <CardAreaBody selectedPart={selectedPart} />
        </View>
      </ModalButtom>
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