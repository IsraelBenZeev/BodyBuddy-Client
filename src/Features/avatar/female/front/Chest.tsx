import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface ChestProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

export const Chest = ({ isSelected, handleTogglePart }: ChestProps) => {
  const bodyPart: BodyPart = 'chest';
  return (
    <G
      id="chest"
      onPress={() => handleTogglePart(bodyPart)}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M265.31 492.398C267.91 502.698 274.11 514.798 277.61 525.098C279.11 536.198 281.21 543.598 284.41 549.598C286.51 537.198 286.61 523.898 287.11 519.698C279.71 510.298 275.21 501.698 265.31 492.498V492.398Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M496.81 492.398C486.91 501.598 482.41 510.298 475.01 519.598C475.61 523.798 475.61 537.198 477.71 549.498C480.91 543.498 483.01 536.098 484.51 524.998C488.01 514.798 494.21 502.598 496.81 492.298V492.398Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M402.81 512.798C423.81 520.798 462.01 506.198 506.31 480.098C500.61 446.098 489.21 420.098 475.01 403.898C462.91 390.098 448.71 383.798 434.21 380.798C428.61 378.398 407.11 380.298 390.61 384.898C388.81 386.698 389.41 386.698 389.21 388.998C387.31 437.598 381.91 475.598 386.91 496.298C388.21 501.698 398.71 510.798 402.81 512.898V512.798Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M371.51 384.898C355.01 380.298 333.51 378.398 327.91 380.798C313.41 383.898 299.21 390.098 287.11 403.898C272.91 420.098 261.51 446.098 255.81 480.098C300.11 506.198 338.21 520.798 359.31 512.798C363.31 510.698 373.91 501.598 375.21 496.198C380.21 475.598 374.81 437.498 372.91 388.898C372.71 386.598 373.41 386.598 371.51 384.798V384.898Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
