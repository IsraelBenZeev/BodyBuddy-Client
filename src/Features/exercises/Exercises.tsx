import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../../../colors';

import { BodyPart, partsBodyHebrew } from '@/src/types';
import AvatarFemale from '../avatar/female/AvatarFemale';
import AvatarMale from '../avatar/male/AvatarMale';
import ModalButtom, { ButtonOPenSheet } from './ModalButtom';
import CardAreaBody from './CardAreaBody';
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
const Exercises = () => {
  const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const sheetRef = useRef<any>(null);
  const openSheet = () => {
    sheetRef.current?.snapToIndex(selectedPart ? 1 : -1);
  };
  useEffect(() => {
    if (!selectedPart) {
      sheetRef.current?.close();
      return;
    }
    sheetRef.current?.snapToIndex(selectedPart ? 1 : -1);
  }, [selectedPart]);
  let Avatar =
    fakeUser2.gender === 'female' ? (
      <AvatarFemale avatarSide={sideAvatar} />
    ) : (
      <AvatarMale
        avatarSide={sideAvatar}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
      />
    );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        className=""
        style={{ flex: 1, width: '100%', height: '100%' }}
        colors={[
          colors.background[1200],
          colors.background[1100],
          colors.background[1000],
          colors.background[1200],
        ]}
      >
        <ImageBackground
          source={require('../../../assets/images/bg-2.jpg')}
          resizeMode="cover"
          className="w-full flex-1"
          imageStyle={{ opacity: 0.05, width: '100%', height: '100%' }}
        >
          <View className="flex-1 w-full h-full items-center justify-between pt-10">
            <View className="flex-1 justify-center items-center px-4">
              <Text className="text-primary-50 text-5xl font-bold ">גע לבחירת אזור</Text>
            </View>
            <View className="justify-center items-center flex-2 relative self-center pr-2">
              {/* {sideAvatar === 'front' && <AvatarFront />}
          {sideAvatar === 'back' && <AvatarBack />} */}
              {/* <AvatarFemaleFront/> */}
              {/* <AvatarFemaleBack /> */}
              {Avatar}
              <Pressable
                className="absolute bottom-32 left-8 font-bold"
                onPress={() => setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front'))}
              >
                <MaterialIcons name="3d-rotation" size={38} color={colors.lime[300]} />
              </Pressable>
            </View>
          </View>
          <ModalButtom ref={sheetRef}>
            <CardAreaBody selectedPart={selectedPart}/>
          </ModalButtom>
        </ImageBackground>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default Exercises;
