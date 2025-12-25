import { BodyPart } from '@/src/types';
import { Dispatch } from 'react';
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
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}
const AvatarMaleFront = ({ selectedPart, setSelectedPart }: AvatarMaleFrontProps) => {
  return (
    <View className="relative">
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <General />
        <Neck selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Chest selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Shoulders selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <UpperArms selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerArms selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Waist selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <UpperLegs selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerLegs selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
      </Svg>
    </View>
  );
};

export default AvatarMaleFront;
