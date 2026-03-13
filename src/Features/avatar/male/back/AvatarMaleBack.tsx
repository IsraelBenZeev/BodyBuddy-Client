import { BodyPart } from '@/src/types/bodtPart';
import { Dimensions, View } from 'react-native';
import Svg from 'react-native-svg';
import Back from './Back';
import General from './General';
import LowerArm from './LowerArm';
import LowerLeg from './LowerLeg';
import Shoulders from './Shoulders';
import UpperArm from './UpperArm';
import UpperLeg from './UpperLeg';
const { width: screenWidth } = Dimensions.get('window');
const FIGMA_WIDTH = 871;
const FIGMA_HEIGHT = 1726;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
interface AvatarMaleBackProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
  svgWidthOverride?: number;
}
const AvatarMaleBack = ({ isSelected, handleTogglePart, svgWidthOverride }: AvatarMaleBackProps) => {
  const computedWidth = svgWidthOverride ?? screenWidth * 0.75;
  const computedHeight = computedWidth * ASPECT_RATIO;
  return (
    <View className="relative " pointerEvents="auto">
      <Svg
        width={computedWidth * 0.9}
        height={computedHeight * 0.9}
        viewBox={`0 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
        pointerEvents="auto"
      >
        <General />
        <Back isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Shoulders isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <UpperArm isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <LowerArm isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <UpperLeg isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <LowerLeg isSelected={isSelected} handleTogglePart={handleTogglePart} />
      </Svg>
    </View>
  );
};

export default AvatarMaleBack;
