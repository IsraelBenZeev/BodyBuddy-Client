import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface GlutesProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

export const Glutes = ({ isSelected, handleTogglePart }: GlutesProps) => {
  const bodyPart: BodyPart = 'upper legs';
  const fill = isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F';
  return (
    <G
      id="glutes"
      accessible={true}
      accessibilityLabel={`ישבן - ${isSelected(bodyPart) ? 'נבחר' : 'לחץ לבחירה'}`}
      accessibilityState={{ selected: isSelected(bodyPart) }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M265.3 942.3C282.8 892.1 339.5 920.1 371.7 857.8C371.5 824.2 372.1 789 370.3 752.8C285.4 756.7 171.3 821.6 265.3 942.3Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M497.1 942.3C591.1 821.6 477 756.7 392.1 752.8C390.3 789 391 824.2 390.7 857.8C422.9 920.1 479.6 892.1 497.1 942.3Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
    </G>
  );
};
