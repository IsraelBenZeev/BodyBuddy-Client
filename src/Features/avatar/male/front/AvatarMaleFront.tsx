import { BodyPart } from '@/src/types/bodtPart';
import { Dimensions, View } from 'react-native';
import Svg from 'react-native-svg';
import { Chest } from './Chest';
import { General } from './General';
import { LowerArms } from './LowerArm';
import { LowerLegs } from './LowerLeg';
import { Neck } from './Neck';
import { Shoulders } from './Shoulders';
import { UpperArms } from './UpperArm';
import { UpperLegs } from './UpperLeg';
import { Waist } from './Waist';
const { width: screenWidth } = Dimensions.get('window');
const FIGMA_WIDTH = 871;
const FIGMA_HEIGHT = 1726;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
const svgWidth = screenWidth * 0.75;
const svgHeight = svgWidth * ASPECT_RATIO;
interface AvatarMaleFrontProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
const AvatarMaleFront = ({ isSelected, handleTogglePart }: AvatarMaleFrontProps) => {
  return (
    <View className="" style={{ flex: 1 }} pointerEvents="auto">
      <Svg
        width={svgWidth * 0.9}
        height={svgHeight * 0.9}
        viewBox={`0 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
        pointerEvents="auto"
      >
        <General />
        <Neck isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Chest isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Shoulders isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <UpperArms isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <LowerArms isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <Waist isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <UpperLegs isSelected={isSelected} handleTogglePart={handleTogglePart} />
        <LowerLegs isSelected={isSelected} handleTogglePart={handleTogglePart} />
      </Svg>
    </View>
  );
};

export default AvatarMaleFront;
