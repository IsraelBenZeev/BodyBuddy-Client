import { BodyPart } from '@/src/types/bodtPart';
import { Dimensions, View } from 'react-native';
import Svg from 'react-native-svg';
import { Chest } from './Chest';
import { General } from './General';
import { LowerArms } from './LowerArm';
import LowerLeg from './LowerLeg';
import { Neck } from './Neck';
import { Shoulders } from './Shoulders';
import { UpperArms } from './UpperArm';
import { UpperLeg } from './UpperLeg';
import { Waist } from './Waist';
const { width: screenWidth } = Dimensions.get('window');
const FIGMA_WIDTH = 871;
const FIGMA_HEIGHT = 1726;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
interface AvatarFemaleFrontProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
  svgWidthOverride?: number;
}
const AvatarFemaleFront = ({ isSelected, handleTogglePart, svgWidthOverride }: AvatarFemaleFrontProps) => {
  const computedWidth = svgWidthOverride ?? screenWidth * 0.75;
  const computedHeight = computedWidth * ASPECT_RATIO;
  return (
    <View className="relative">
      <Svg
        width={computedWidth * 0.9}
        height={computedHeight * 0.9}
        viewBox={`-60 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <General />
        <UpperLeg isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Shoulders isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Chest isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Neck isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Waist isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <UpperArms isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <LowerLeg isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <LowerArms isSelected={isSelected} handleTogglePart={handleTogglePart} />
      </Svg>
    </View>
  );
};

export default AvatarFemaleFront;
