import AvatarFemale from '@/src/Features/avatar/female/AvatarFemale';
import AvatarMale from '@/src/Features/avatar/male/AvatarMale';
import { BodyPart } from '@/src/types/bodtPart';
import { useCallback } from 'react';
import { View } from 'react-native';

const MINI_WIDTH = 65;
const FIGMA_ASPECT = 1726 / 871;
const CONTAINER_HEIGHT = Math.ceil(MINI_WIDTH * FIGMA_ASPECT * 0.9) + 2;

const noop = () => {};

interface MiniAvatarProps {
  selectedParts: BodyPart[];
  gender: 'male' | 'female';
}

const MiniAvatar = ({ selectedParts, gender }: MiniAvatarProps) => {
  const isSelected = useCallback(
    (part: BodyPart) => selectedParts.includes(part),
    [selectedParts]
  );

  return (
    <View
      className="overflow-hidden"
      style={{ width: MINI_WIDTH, height: CONTAINER_HEIGHT }}
      pointerEvents="none"
    >
      {gender === 'female' ? (
        <AvatarFemale
          avatarSide="front"
          isSelected={isSelected}
          handleTogglePart={noop}
          svgWidthOverride={MINI_WIDTH}
        />
      ) : (
        <AvatarMale
          avatarSide="front"
          isSelected={isSelected}
          handleTogglePart={noop}
          svgWidthOverride={MINI_WIDTH}
        />
      )}
    </View>
  );
};

export default MiniAvatar;
