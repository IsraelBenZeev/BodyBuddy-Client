import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';
interface ShouldersProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
const Shoulders = ({ isSelected, handleTogglePart }: ShouldersProps) => {
  const bodyPart: BodyPart = 'shoulders';
  return (
    <G id="shoulders" onPress={() => handleTogglePart(bodyPart)}>
      <Path
        d="M288.247 305.595C283.347 302.495 276.647 298.795 275.647 298.395C268.247 295.895 260.247 295.395 252.547 296.695C240.047 298.795 227.147 309.295 217.847 317.495C211.747 322.795 206.047 332.295 203.147 339.795C198.547 351.395 200.347 361.195 200.347 373.295C200.347 387.695 200.347 402.095 200.347 416.495C200.347 416.595 215.447 410.495 216.847 409.695C224.647 405.295 231.647 399.595 238.247 393.595C244.047 388.295 251.847 381.095 251.847 372.595C251.847 359.795 254.847 346.795 261.847 335.895C269.647 323.695 282.547 318.695 293.347 309.695C293.847 309.295 291.447 307.495 288.347 305.495L288.247 305.595Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M581 305.6C585.9 302.5 592.6 298.8 593.6 298.4C601 295.9 609 295.4 616.7 296.7C629.2 298.8 642.1 309.3 651.4 317.5C657.5 322.8 663.2 332.3 666.1 339.8C670.7 351.4 668.9 361.2 668.9 373.3C668.9 387.7 668.9 402.1 668.9 416.5C668.9 416.6 653.8 410.5 652.4 409.7C644.6 405.3 637.6 399.6 631 393.6C625.2 388.3 617.4 381.1 617.4 372.6C617.4 359.8 614.4 346.8 607.4 335.9C599.6 323.7 586.7 318.7 575.9 309.7C575.4 309.3 577.8 307.5 580.9 305.5L581 305.6Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};

export default Shoulders;
