import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface LowerArmProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

export const LowerArms = ({ selectedPart, setSelectedPart }: LowerArmProps) => {
  return (
    <G
      id="lower arms"
      onPress={() => {
        if (selectedPart === 'lower arms') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('lower arms');
      }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M575.31 660.098C603.91 704.798 637.51 743.698 666.91 772.798C656.21 750.598 635.01 716.298 613.81 691.098C598.41 672.098 591.71 662.698 575.31 660.098Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M617.911 680.198C628.911 694.298 639.51 709.098 647.81 723.798C655.61 739.598 663.81 757.698 675.01 768.698C667.81 745.398 653.61 722.198 645.11 695.198C628.01 641.398 603.61 587.898 573.01 574.098C571.91 585.098 578.311 628.998 617.911 680.298V680.198Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M144.21 680.198C183.81 628.998 190.21 584.998 189.11 573.998C158.41 587.898 134.11 641.298 117.01 695.098C108.41 722.098 94.3104 745.298 87.1104 768.598C98.4104 757.498 106.51 739.398 114.31 723.698C122.71 709.098 133.21 694.298 144.21 680.098V680.198Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M593.41 658.398H594.81C600.81 651.998 573.611 619.598 556.711 603.998C554.711 603.798 552.31 602.098 551.31 603.998C549.81 611.798 549.41 625.698 551.31 637.998C556.11 640.398 561.21 642.398 566.31 644.798C575.51 649.198 582.21 655.998 593.51 658.398H593.41Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M631.51 741.498C623.51 733.098 617.51 724.998 615.21 722.398C610.71 717.498 583.41 678.898 571.61 661.098C568.31 656.498 565.41 651.898 564.81 651.598C560.81 652.198 564.11 658.498 564.81 661.098C565.11 665.198 579.81 691.798 598.81 714.198C623.11 742.698 653.11 767.898 654.61 768.598C657.51 771.098 661.41 772.698 662.81 772.698C658.41 767.898 642.81 753.298 631.51 741.398V741.498Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M186.81 660.098C170.41 662.698 163.71 672.098 148.31 691.098C127.11 716.198 105.91 750.498 95.2104 772.798C124.61 743.698 158.21 704.798 186.81 660.098Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M197.31 651.598C196.71 651.998 193.81 656.598 190.51 661.098C178.81 678.798 151.51 717.498 146.91 722.398C144.51 724.898 138.51 733.098 130.61 741.498C119.31 753.398 103.71 767.998 99.3103 772.798C100.71 772.798 104.61 771.198 107.51 768.698C109.01 767.898 139.01 742.798 163.31 714.298C182.31 691.898 197.11 665.298 197.31 661.198C198.01 658.598 201.31 652.298 197.31 651.698V651.598Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M205.41 603.998C188.51 619.598 161.31 652.098 167.31 658.398H168.71C180.01 655.998 186.71 649.198 195.91 644.798C200.91 642.398 206.11 640.398 210.91 637.998C212.81 625.698 212.41 611.798 210.91 603.998C209.81 602.098 207.41 603.798 205.51 603.998H205.41Z"
        fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
