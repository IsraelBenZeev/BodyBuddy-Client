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
const svgWidth = screenWidth * 0.75;
const svgHeight = svgWidth * ASPECT_RATIO;
interface AvatarFemaleFrontProps {
 isSelected: (partName: BodyPart) => boolean;
//  handle
}
const AvatarFemaleFront = ({
  selectedPart,
  setSelectedPart,
}: {
  selectedPart: BodyPart | null;
  setSelectedPart: React.Dispatch<React.SetStateAction<BodyPart | null>>;
}) => {
  return (
    <View className="relative">
      <Svg
        width={svgWidth * 0.9}
        height={svgHeight * 0.9}
        viewBox={`-60 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <General />
        <UpperLeg selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Shoulders selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Chest selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Neck selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Waist selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <UpperArms selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerLeg selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerArms selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
      </Svg>
    </View>
  );
};

export default AvatarFemaleFront;
