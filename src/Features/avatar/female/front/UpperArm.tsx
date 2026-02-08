import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface UpperArmProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

export const UpperArms = ({ isSelected, handleTogglePart }: UpperArmProps) => {
  const bodyPart: BodyPart = 'upper arms';
  return (
    <G
      id="upper arms"
      onPress={() => handleTogglePart(bodyPart)}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M536.21 456.998C527.01 454.698 520.71 454.198 515.81 461.098C511.01 517.698 538.71 539.798 564.81 567.298C574.81 567.898 576.11 566.898 577.11 561.898C578.21 555.298 578.61 552.298 578.51 548.298C577.61 513.498 578.11 500.798 562.21 472.098C555.71 463.198 545.21 457.698 536.31 457.098L536.21 456.998Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M566.21 583.598C550.91 570.198 535.41 554.998 519.91 518.298C516.81 514.098 515.41 516.298 514.51 519.698C514.91 539.898 541.91 575.898 559.41 586.398C561.91 587.698 565.81 586.298 566.21 583.698V583.598Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M197.31 567.298C223.41 539.798 251.11 517.698 246.31 461.098C241.41 454.198 235.11 454.798 225.91 456.998C217.11 457.598 206.61 463.098 200.01 471.998C184.11 500.698 184.61 513.398 183.71 548.198C183.61 552.198 184.01 555.198 185.11 561.798C186.01 566.798 187.41 567.798 197.41 567.198L197.31 567.298Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M242.21 518.198C226.71 554.898 211.31 570.198 195.91 583.498C196.31 586.098 200.21 587.598 202.71 586.198C220.31 575.698 247.21 539.698 247.61 519.498C246.61 516.098 245.21 513.998 242.21 518.098V518.198Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
