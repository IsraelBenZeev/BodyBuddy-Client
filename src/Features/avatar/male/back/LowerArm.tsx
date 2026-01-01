import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';
interface LowerArmProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
const LowerArm = ({ isSelected, handleTogglePart }: LowerArmProps) => {
  const bodyPart: BodyPart = 'lower arms';
  return (
    <G id="lower arms" onPress={() => handleTogglePart(bodyPart)}>
      <Path
        d="M172.4 589.6C173 596 174.1 602.4 174.2 609C174.4 621.6 170.2 647.7 182.1 656.7C192.7 646.7 196.9 629.1 196.1 615C195.6 606.9 188 601.6 183.1 595.8C179.3 591.4 175.7 586.9 172.1 582.4C172.1 584.8 172.2 587.3 172.5 589.7L172.4 589.6Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M152 603.8C148.1 636.5 129.6 784 117.4 815.7C116.4 830.8 163.3 738 168.8 707.1C173.2 682.6 165.7 635 160.3 623.3C154.9 611.6 152 603.8 152 603.8Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M203 635.5C198.4 639.2 195.8 645.2 195.5 645.7C173.5 703 164.6 747.3 138.3 798.1C136.5 801.5 133.2 811 129 812.2C143.6 807.8 166.3 744.8 195.1 694.5C201.4 683.6 219 639.8 220.4 633.9C221.5 629.5 206.7 632.3 202.8 635.4L203 635.5Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M135.1 635.3C127.8 665.5 118.1 759.8 96.7 815.8C114.3 804.1 125 762.4 127.9 745.3C134.1 709.1 139.1 669.3 141.5 632.7C141.7 629.1 141.8 622.6 137.5 621.4C135.4 625.5 135.7 630.7 135 635.3H135.1Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M698.1 589.6C697.5 596 696.4 602.4 696.3 609C696.1 621.6 700.3 647.7 688.4 656.7C677.8 646.7 673.6 629.1 674.4 615C674.9 606.9 682.5 601.6 687.4 595.8C691.2 591.4 694.8 586.9 698.4 582.4C698.4 584.8 698.3 587.3 698 589.7L698.1 589.6Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M718.4 603.8C722.3 636.5 740.8 784 753 815.7C754 830.8 707.1 738 701.6 707.1C697.2 682.6 704.7 635 710.1 623.3C715.5 611.6 718.4 603.8 718.4 603.8Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M667.4 635.5C672 639.2 674.6 645.2 674.9 645.7C696.9 703 705.8 747.3 732.1 798.1C733.9 801.5 737.2 811 741.4 812.2C726.8 807.8 704.1 744.8 675.3 694.5C669 683.6 651.4 639.8 650 633.9C648.9 629.5 663.7 632.3 667.6 635.4L667.4 635.5Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M735.4 635.3C742.7 665.5 752.4 759.8 773.8 815.8C756.2 804.1 745.5 762.4 742.6 745.3C736.4 709.1 731.4 669.3 729 632.7C728.8 629.1 728.7 622.6 733 621.4C735.1 625.5 734.8 630.7 735.5 635.3H735.4Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};

export default LowerArm;
