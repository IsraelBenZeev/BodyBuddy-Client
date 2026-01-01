import { BodyPart } from '@/src/types';
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
const svgWidth = screenWidth * 0.75;
const svgHeight = svgWidth * ASPECT_RATIO;
interface AvatarMaleBackProps {
  selectedPart: BodyPart | null;
  setSelectedPart: React.Dispatch<React.SetStateAction<BodyPart | null>>;
}
const AvatarMaleBack = ({ selectedPart, setSelectedPart }: AvatarMaleBackProps) => {
  return (
    <View className="relative ">
      <Svg
         width={svgWidth * 0.90}
        height={svgHeight * 0.90}
        viewBox={`0 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <General />
        <Back selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Shoulders selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <UpperArm selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerArm selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <UpperLeg selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerLeg selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
      </Svg>
    </View>
  );
};

export default AvatarMaleBack;
