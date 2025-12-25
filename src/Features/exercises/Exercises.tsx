import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../../colors';
import AvatarFemaleBack from '../avatar/female/back/AvatarFemaleBack';

const Exercises = () => {
  const [sideAvatar, setSideAvatar] = useState<'front' | 'back'>('front');
  return (
    <LinearGradient
      className=""
      style={{ flex: 1, width: '100%', height: '100%' }}
      colors={[colors.background[500], colors.background[900]]}
    >
      {/* //   <ImageBackground */}
      {/* //     source={require('../../../assets/images/bg-5.jpg')}
    //     resizeMode="cover"
    //     className="w-full flex-1"
    //     imageStyle={{ opacity: 0.2, width: '100%', height: '100%' }} */}
      {/* //   > */}
      <View className="flex-1 w-full h-full items-center justify-between pt-10">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-primary-100 text-5xl font-bold ">בחר אזור</Text>
        </View>
        <View className="justify-center items-center flex-2 relative">
          {/* {sideAvatar === 'front' && <AvatarFront />}
          {sideAvatar === 'back' && <AvatarBack />} */}
          {/* <AvatarFemaleFront/> */}
          <AvatarFemaleBack />
          <Pressable
            className="absolute bottom-32 left-8 font-bold"
            onPress={() => setSideAvatar((prev) => (prev === 'front' ? 'back' : 'front'))}
          >
            <MaterialIcons name="3d-rotation" size={38} color={colors.primary[100]} />
          </Pressable>
        </View>
      </View>
      {/* //   </ImageBackground> */}
    </LinearGradient>
  );
};

export default Exercises;
