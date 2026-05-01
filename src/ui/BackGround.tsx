import { colors } from '@/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageBackground } from 'react-native';
interface BackGroundProps {
  children: ReactNode;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  colorD?: string;
}
const BackGround = ({ children, colorA, colorB, colorC, colorD }: BackGroundProps) => {
  return (
    <LinearGradient
      style={{ flex: 1, width: '100%', paddingBottom: 10 }}
      colors={[
        colorA || colors.background[900],
        colorB || colors.background[950],
        colorC || colors.background[800],
        colorD || colors.background[700],
      ]}
    >
      {children}
    </LinearGradient>
  );
};
export default BackGround;
