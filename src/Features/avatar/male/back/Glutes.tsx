import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';

interface GlutesProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}

const Glutes = ({ isSelected, handleTogglePart }: GlutesProps) => {
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
        d="M343.5 766C316.9 781.9 302 793.1 293 807.7C284 822.3 285.7 848.7 297.9 875C310.1 901.3 335.5 930.9 348.6 930.9C361.7 930.9 383.4 947.6 405.7 939.1C425.1 931.7 417.6 918.3 419.6 900.8C422.4 876.4 428.4 877.8 431.7 819.9C432.5 806 429.3 782.7 425.4 774.9C421.5 767.1 413.5 757.1 410.1 752.7C406.7 748.3 404.5 738.7 376 751.2C364.2 756.4 360.6 755.9 343.6 766.1L343.5 766Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
      <Path
        d="M526.9 766C553.5 781.9 568.4 793.1 577.4 807.7C586.4 822.3 584.7 848.7 572.5 875C560.3 901.3 534.9 930.9 521.8 930.9C508.7 930.9 487 947.6 464.7 939.1C445.3 931.7 452.8 918.3 450.8 900.8C448 876.4 442 877.8 438.7 819.9C437.9 806 441.1 782.7 445 774.9C448.9 767.1 456.9 757.1 460.3 752.7C463.7 748.3 465.9 738.7 494.4 751.2C506.2 756.4 509.8 755.9 526.8 766.1L526.9 766Z"
        fill={fill}
        onPressIn={() => handleTogglePart(bodyPart)}
      />
    </G>
  );
};

export default Glutes;
