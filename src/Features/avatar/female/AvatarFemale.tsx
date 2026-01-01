import { BodyPart } from '@/src/types/bodtPart';
import AvatarFemaleBack from './back/AvatarFemaleBack';
import AvatarFemaleFront from './front/AvatarFemaleFront';
interface AvatarFemaleProps {
  avatarSide: 'front' | 'back';
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
const AvatarFemale = ({ avatarSide, isSelected, handleTogglePart }: AvatarFemaleProps) => {
  return avatarSide === 'front' ? (
    <AvatarFemaleFront isSelected={isSelected} handleTogglePart={handleTogglePart} />
  ) : (
    <AvatarFemaleBack isSelected={isSelected} handleTogglePart={handleTogglePart} />
  );
};

export default AvatarFemale;
