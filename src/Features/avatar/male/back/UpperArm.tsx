import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';
interface UpperArmProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}
const UpperArm = ({ selectedPart, setSelectedPart }: UpperArmProps) => {
  return (
    <G
      id="upper_arm"
      onPress={() => {
        console.log('upper arm pressed');
        if (selectedPart === 'upper_arm') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('upper_arm');
      }}
    >
      <Path
        d="M250.6 393.6C201.1 428.7 201.8 451.2 206.2 479.9C210.2 506.1 222 477.8 229.9 471.9C235.7 467.7 241.5 463.6 247.2 459.2C249.1 457.8 260.1 451 259.7 448.2C259.4 445.8 250.6 393.6 250.6 393.6Z"
        fill={selectedPart === 'upper_arm' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M257.9 458.7C248 467 238.2 475.6 228.9 484.7C219.6 493.8 217.7 500.4 217.5 513.7C217.3 532.8 211.5 551.3 208.7 570.1C207.2 579.6 206.5 589.4 207.7 599C209.2 610.3 211.3 604.9 216.4 599.3C219 596.5 221.5 593.7 223.8 590.7C231 581.6 231.2 573.6 232.6 562.2C234.2 549.7 243.8 545.1 249.4 533.7C252.9 526.6 254.8 511.2 258.4 504C265.7 489.2 267.7 472.2 262.6 456.5L257.8 458.7H257.9Z"
        fill={selectedPart === 'upper_arm' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M193.9 473.4C187.6 490.9 176 548.8 181.3 573.6C182.6 579.4 187.1 592 191.2 580.2C197.7 561.6 205.8 542.8 210.4 523.6C213.4 510.9 201.5 489.1 193.9 473.4Z"
        fill={selectedPart === 'upper_arm' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M619.9 393.6C669.4 428.7 668.7 451.2 664.3 479.9C660.3 506.1 648.5 477.8 640.6 471.9C634.8 467.7 629 463.6 623.3 459.2C621.4 457.8 610.4 451 610.8 448.2C611.1 445.8 619.9 393.6 619.9 393.6Z"
        fill={selectedPart === 'upper_arm' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M612.6 458.7C622.5 467 632.3 475.6 641.6 484.7C650.9 493.8 652.8 500.4 653 513.7C653.2 532.8 659 551.3 661.8 570.1C663.3 579.6 664 589.4 662.8 599C661.3 610.3 659.2 604.9 654.1 599.3C651.5 596.5 649 593.7 646.7 590.7C639.5 581.6 639.3 573.6 637.9 562.2C636.3 549.7 626.7 545.1 621.1 533.7C617.6 526.6 615.7 511.2 612.1 504C604.8 489.2 602.8 472.2 607.9 456.5L612.7 458.7H612.6Z"
        fill={selectedPart === 'upper_arm' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M676.6 473.4C682.9 490.9 694.5 548.8 689.2 573.6C687.9 579.4 683.4 592 679.3 580.2C672.8 561.6 664.7 542.8 660.1 523.6C657.1 510.9 669 489.1 676.6 473.4Z"
        fill={selectedPart === 'upper_arm' ? colors.primary[900] : '#3F3F3F'}
      />
    </G>
  );
};

export default UpperArm;
