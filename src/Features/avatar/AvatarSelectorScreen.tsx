import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../../colors';

import { BodyPart } from '@/src/types';
import BackGround from '@/src/ui/BackGround';
import CardAreaBody from './CardAreaBody';
import AvatarFemale from './female/AvatarFemale';
import AvatarMaleFront from './male/AvatarMale';
import ModalButtom from './ModalButtom';
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
const AvatarSelectorScreen = () => {
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
      <AvatarMaleFront
        avatarSide={sideAvatar}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
      />
    );
  return (
    <BackGround>
      <View className="flex-1 w-full h-full items-center justify-between pt-10">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-primary-50 text-5xl font-bold ">גע לבחירת אזור</Text>
        </View>
        <View className="justify-center items-center flex-2 relative self-center pr-2">
          {Avatar}
          <Pressable
            className="absolute bottom-32 left-8 font-bold"
            onPress={() => {
              setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front'));
              setSelectedPart(null);
            }}
          >
            <MaterialIcons name="3d-rotation" size={38} color={colors.lime[300]} />
          </Pressable>
        </View>
      </View>
      <ModalButtom ref={sheetRef}>
        <CardAreaBody selectedPart={selectedPart} />
      </ModalButtom>
    </BackGround>
  );
};

export default AvatarSelectorScreen;
