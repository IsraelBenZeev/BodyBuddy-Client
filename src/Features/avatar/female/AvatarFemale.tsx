import { View } from 'react-native';
import AvatarFemaleBack from './back/AvatarFemaleBack';
import AvatarFemaleFront from './front/AvatarFemaleFront';
interface AvatarFemaleProps {
  avatarSide: 'front' | 'back';
}
const AvatarFemale = ({ avatarSide }: AvatarFemaleProps) => {
  return avatarSide === 'front' ? <AvatarFemaleFront /> : <AvatarFemaleBack />
};

export default AvatarFemale;
