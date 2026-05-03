import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface NeckProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

const Neck = ({ isSelected, handleTogglePart }: NeckProps) => {
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
        d="M401.1 173.5C399.6 176.3 400.1 180.1 400.3 183.7C400.8 191.7 398.7 201.5 397.6 209.5C396.1 219.9 391.3 233.6 386.3 242.8C381.7 251.1 376.6 251.1 368.5 256.3C363.6 259.4 361.5 259.5 356.6 262.5C355.5 263.2 350.1 266.3 350.7 267.8C351.2 269.2 359 269.4 360.4 269.5C374.7 271.1 389.2 270.6 403.6 270.1C407.9 269.9 412.3 269.8 416.6 269.6C418.5 269.6 420.5 269.4 422.1 268.4C424.8 266.6 425.2 262.8 425.2 259.5C425.7 231.4 426.2 207.4 426.6 179.3C426.6 176.9 426.6 174.2 425 172.4C424 171.2 422.4 170.6 420.9 170.2C415.8 168.7 410.4 168.7 405.3 170.2C403.1 170.8 401.8 172 401 173.5H401.1Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
      <Path
        d="M469.4 173.5C470.9 176.3 470.4 180.1 470.2 183.7C469.7 191.7 471.8 201.5 472.9 209.5C474.4 219.9 479.2 233.6 484.2 242.8C488.8 251.1 493.9 251.1 502 256.3C506.9 259.4 509 259.5 513.9 262.5C515 263.2 520.4 266.3 519.8 267.8C519.3 269.2 511.5 269.4 510.1 269.5C495.8 271.1 481.3 270.6 466.9 270.1C462.6 269.9 458.2 269.8 453.9 269.6C452 269.6 450 269.4 448.4 268.4C445.7 266.6 445.3 262.8 445.3 259.5C444.8 231.4 444.3 207.4 443.9 179.3C443.9 176.9 443.9 174.2 445.5 172.4C446.5 171.2 448.1 170.6 449.6 170.2C454.7 168.7 460.1 168.7 465.2 170.2C467.4 170.8 468.7 172 469.5 173.5H469.4Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
    </G>
  );
};

export default Neck;
