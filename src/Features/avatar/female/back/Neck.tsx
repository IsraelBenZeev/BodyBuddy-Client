import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface NeckProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

export const Neck = ({ isSelected, handleTogglePart }: NeckProps) => {
  const bodyPart: BodyPart = 'neck';
  const fill = isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F';
  return (
    <G
      id="neck-back"
      accessible={true}
      accessibilityLabel={`צוואר - ${isSelected(bodyPart) ? 'נבחר' : 'לחץ לבחירה'}`}
      accessibilityState={{ selected: isSelected(bodyPart) }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M450.7 326.3C452.2 325.9 449.2 322.6 448 322.2C436.4 318.8 432 317.5 420.7 308.4C408.3 293.8 409.3 273.5 405.7 245.7C403.1 242.4 395 244 392.1 244.3C392.9 275.7 394.8 307.5 394.8 338.4C410.4 331.5 432.7 326.2 450.7 326.3Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M311.6 326.3C329.7 326.2 351.9 331.5 367.5 338.4C367.5 307.5 369.4 275.7 370.2 244.3C367.3 244 359.2 242.4 356.6 245.7C353 273.5 354 293.8 341.6 308.4C330.3 317.5 326 318.8 314.3 322.2C313.1 322.6 310.1 325.9 311.6 326.3Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
    </G>
  );
};
