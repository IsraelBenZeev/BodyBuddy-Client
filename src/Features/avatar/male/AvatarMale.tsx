import { BodyPart } from '@/src/types';
import { Dispatch } from 'react';
import AvatarMaleBack from './back/AvatarMaleBack';
import AvatarMaleFront from './front/AvatarMaleFront';
interface AvatarMaleProps {
  avatarSide: 'front' | 'back';
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}
const AvatarMale = ({ avatarSide, selectedPart, setSelectedPart }: AvatarMaleProps) => {
  return avatarSide === 'front' ? (
    <AvatarMaleFront selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
  ) : (
    <AvatarMaleBack />
  );
};

export default AvatarMale;
