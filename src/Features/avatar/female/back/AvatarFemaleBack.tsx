import { BodyPart, partsBodyHebrew } from '@/src/types';
import { useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Svg from 'react-native-svg';
import { Back } from './Back';
import { General } from './General';
import { LowerArms } from './LowerArm';
import { LowerLeg } from './LowerLeg';
import { Shoulders } from './Shoulders';
import { UpperArms } from './UpperArm';
import { UpperLeg } from './UpperLeg';

const { width: screenWidth } = Dimensions.get('window');
const FIGMA_WIDTH = 871;
const FIGMA_HEIGHT = 1726;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
const svgWidth = screenWidth * 0.75;
const svgHeight = svgWidth * ASPECT_RATIO;

const AvatarFemaleBack = () => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  return (
    <View className="relative">
      <Text className="absolute text-primary-900">
        {selectedPart ? partsBodyHebrew[selectedPart] : ''}
      </Text>
      <Svg
         width={svgWidth * 0.90}
        height={svgHeight * 0.90}
        viewBox={`-60 0 ${FIGMA_WIDTH} ${FIGMA_HEIGHT}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <General />
        <UpperLeg selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Shoulders selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <Back selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <UpperArms selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerLeg selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        <LowerArms selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
      </Svg>
    </View>
  );
};

export default AvatarFemaleBack;
