import { colors } from '@/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageBackground } from 'react-native';
interface BackGroundProps {
  children: ReactNode;
}
const BackGround = ({ children }: BackGroundProps) => {
  return (
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
        source={require('../../assets/images/bg-2.jpg')}
        resizeMode="cover"
        className="w-full"
        imageStyle={{ opacity: 0.05, width: '100%', height: '100%' }}
      ></ImageBackground>
      {children}
    </LinearGradient>
  );
};
export default BackGround;
