import { Dispatch } from 'react';
import AvatarMaleBack from './back/AvatarMaleBack';
import AvatarMaleFront from './front/AvatarMaleFront';
import { BodyPart } from '@/src/types/bodtPart';
interface AvatarMaleProps {
  avatarSide: 'front' | 'back';
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
const AvatarMale = ({ avatarSide, isSelected, handleTogglePart }: AvatarMaleProps) => {
  return avatarSide === 'front' ? (
    <AvatarMaleFront isSelected={isSelected} handleTogglePart={handleTogglePart} />
  ) : (
    <AvatarMaleBack isSelected={isSelected} handleTogglePart={handleTogglePart} />
  );
};

export default AvatarMale;
