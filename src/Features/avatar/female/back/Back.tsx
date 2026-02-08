import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface BackProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

export const Back = ({ isSelected, handleTogglePart }: BackProps) => {
  const bodyPart: BodyPart = 'back';
  return (
    <G
      id="back"
      onPress={() => handleTogglePart(bodyPart)}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M394.8 733.7C408.3 714.9 431.4 697.8 453.4 661.4C435.6 652.6 410.7 621.9 392 602.8C392.5 644.2 389.1 692.3 394.7 733.7H394.8Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M456.2 694.2C463 698.3 472.6 703.7 479.4 707.8C477.6 688.3 476.4 652.4 469.9 646.4C458.6 662.5 457.5 679 456.3 694.1L456.2 694.2Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M283 707.8C289.8 703.7 299.4 698.3 306.2 694.2C305 679.1 303.9 662.6 292.6 646.5C286 652.5 284.9 688.3 283.1 707.9L283 707.8Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M308.9 661.5C330.9 697.9 354.1 714.9 367.5 733.8C373.1 692.4 369.8 644.3 370.2 602.9C351.6 622 326.6 652.7 308.8 661.5H308.9Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M373 484.2C375.7 484.2 375.6 479 375.7 476C375.2 434.6 375.9 402.3 374.3 361.5C361.8 344.3 311.2 331 270.7 332.9C264.1 333.4 254.9 334.7 253 337C323.3 347.3 296.6 449.6 373 484.2Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M389.4 484.2C465.8 449.6 439.1 347.3 509.4 337C507.5 334.7 498.2 333.4 491.7 332.9C451.2 331 400.6 344.4 388.1 361.5C386.5 402.4 387.2 434.7 386.7 476C386.9 479 386.7 484.2 389.4 484.2Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M311.6 450.2C295.6 460.6 280.7 453.8 266.6 454.3C285.4 518 298.4 563.7 306.1 643.8C360.6 601.9 388.4 563.4 372.9 510.2C353.1 496.2 332 470.6 311.5 450.2H311.6Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M456.2 643.7C464 563.6 476.9 517.9 495.7 454.2C481.6 453.7 466.7 460.5 450.7 450.1C430.2 470.5 409.2 496.1 389.3 510.1C373.9 563.3 401.6 601.8 456.1 643.7H456.2Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
