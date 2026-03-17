import AvatarFemale from '@/src/Features/avatar/female/AvatarFemale';
import AvatarMale from '@/src/Features/avatar/male/AvatarMale';
import { BodyPart } from '@/src/types/bodtPart';
import { useCallback } from 'react';
import { View } from 'react-native';

const MINI_WIDTH = 50;
const MINI_WIDTH_DUAL = 38;
const FIGMA_ASPECT = 1726 / 871;
const CONTAINER_HEIGHT = Math.ceil(MINI_WIDTH * FIGMA_ASPECT * 0.9) + 2;
const CONTAINER_HEIGHT_DUAL = Math.ceil(MINI_WIDTH_DUAL * FIGMA_ASPECT * 0.9) + 2;

const BACK_ONLY_PARTS: BodyPart[] = ['back'];

const noop = () => {};

interface MiniAvatarProps {
  selectedParts: BodyPart[];
  gender: 'male' | 'female';
  preferBack?: boolean;
}

const MiniAvatar = ({ selectedParts, gender, preferBack = false }: MiniAvatarProps) => {
  const isSelected = useCallback(
    (part: BodyPart) => selectedParts.includes(part),
    [selectedParts]
  );

  const hasFrontParts = !preferBack && selectedParts.some((p) => !BACK_ONLY_PARTS.includes(p));
  const hasBackParts = preferBack || selectedParts.some((p) => BACK_ONLY_PARTS.includes(p));
  const showBoth = hasFrontParts && hasBackParts;
  const avatarSide = !hasFrontParts ? 'back' : 'front';

  const AvatarComponent = gender === 'female' ? AvatarFemale : AvatarMale;

  if (showBoth) {
    return (
      <View className="flex-row gap-1" pointerEvents="none">
        <View
          className="overflow-hidden"
          style={{ width: MINI_WIDTH_DUAL, height: CONTAINER_HEIGHT_DUAL }}
        >
          <AvatarComponent
            avatarSide="front"
            isSelected={isSelected}
            handleTogglePart={noop}
            svgWidthOverride={MINI_WIDTH_DUAL}
          />
        </View>
        <View
          className="overflow-hidden"
          style={{ width: MINI_WIDTH_DUAL, height: CONTAINER_HEIGHT_DUAL }}
        >
          <AvatarComponent
            avatarSide="back"
            isSelected={isSelected}
            handleTogglePart={noop}
            svgWidthOverride={MINI_WIDTH_DUAL}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      className="overflow-hidden"
      style={{ width: MINI_WIDTH, height: CONTAINER_HEIGHT }}
      pointerEvents="none"
    >
      <AvatarComponent
        avatarSide={avatarSide}
        isSelected={isSelected}
        handleTogglePart={noop}
        svgWidthOverride={MINI_WIDTH}
      />
    </View>
  );
};

export default MiniAvatar;
