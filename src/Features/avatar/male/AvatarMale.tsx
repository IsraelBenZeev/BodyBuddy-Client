import { Dispatch } from 'react';
import AvatarMaleBack from './back/AvatarMaleBack';
import AvatarMaleFront from './front/AvatarMaleFront';
import { BodyPart } from '@/src/types/bodtPart';
interface AvatarMaleProps {
  avatarSide: 'front' | 'back';
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
  svgWidthOverride?: number;
}
const AvatarMale = ({ avatarSide, isSelected, handleTogglePart, svgWidthOverride }: AvatarMaleProps) => {
  return avatarSide === 'front' ? (
    <AvatarMaleFront isSelected={isSelected} handleTogglePart={handleTogglePart} svgWidthOverride={svgWidthOverride} />
  ) : (
    <AvatarMaleBack isSelected={isSelected} handleTogglePart={handleTogglePart} svgWidthOverride={svgWidthOverride} />
  );
};

export default AvatarMale;
