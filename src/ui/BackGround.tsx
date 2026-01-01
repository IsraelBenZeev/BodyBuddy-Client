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
      style={{ flex: 1, width: '100%', height: '100%', paddingBottom: 50 }}
      colors={[
        colors.background[900],
        colors.background[950],
        colors.background[800],
        colors.background[700],
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
