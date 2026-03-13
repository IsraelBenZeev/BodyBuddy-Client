import { BodyPart } from '@/src/types/bodtPart';
import AvatarFemaleBack from './back/AvatarFemaleBack';
import AvatarFemaleFront from './front/AvatarFemaleFront';
interface AvatarFemaleProps {
  avatarSide: 'front' | 'back';
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
  svgWidthOverride?: number;
}
const AvatarFemale = ({ avatarSide, isSelected, handleTogglePart, svgWidthOverride }: AvatarFemaleProps) => {
  return avatarSide === 'front' ? (
    <AvatarFemaleFront isSelected={isSelected} handleTogglePart={handleTogglePart} svgWidthOverride={svgWidthOverride} />
  ) : (
    <AvatarFemaleBack isSelected={isSelected} handleTogglePart={handleTogglePart} svgWidthOverride={svgWidthOverride} />
  );
};

export default AvatarFemale;
