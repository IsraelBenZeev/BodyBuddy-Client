import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface ShouldersProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

export const Shoulders = ({ isSelected, handleTogglePart }: ShouldersProps) => {
  const bodyPart: BodyPart = 'shoulders';
  return (
    <G
      id="shoulders"
      onPress={() => handleTogglePart(bodyPart)}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M210.91 439.298V440.698C242.81 442.498 265.01 424.698 273.51 401.198C278.71 386.998 280.41 367.598 283.01 349.498C280.51 347.098 279.91 346.898 274.81 349.498C247.31 368.798 216.21 398.798 210.81 439.298H210.91Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M559.41 424.298C559.91 423.798 563.51 421.998 563.91 421.598C563.01 370.998 550.41 355.398 524.01 340.898C521.11 339.998 507.31 335.198 504.91 343.998C531.01 362.498 549.71 397.798 559.31 424.298H559.41Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M551.21 440.698V439.298C545.91 398.798 514.71 368.798 487.21 349.498C482.11 346.898 481.51 347.098 479.01 349.498C481.61 367.598 483.31 386.998 488.51 401.198C497.11 424.698 519.21 442.498 551.11 440.698H551.21Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M257.21 343.998C255.51 341.398 252.81 336.298 238.11 340.898C211.71 355.398 200.51 371.398 198.61 421.598C199.11 422.098 202.21 423.898 202.71 424.298C212.41 397.798 231.11 362.398 257.11 343.998H257.21Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
