import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';
interface UpperArmProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}
export const UpperArms = ({ selectedPart, setSelectedPart }: UpperArmProps) => {
  return (
    <G
      id="upper arms"
      onPress={() => {
        console.log('upper arms pressed');
        if (selectedPart === 'upper arms') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('upper arms');
      }}
    >
      <Path
        d="M253.7 454.8C244.7 488.1 210.2 562.4 209.7 564.1C208.3 568.4 211 574 214.5 576.6C220 580.6 225.8 572.1 228.7 568.5C248.7 543.8 266.4 497.4 269.2 486C272.6 472.4 283.3 453.1 279 430.2C274.7 407.3 270.7 396.5 268.8 399C266.2 402.2 265.7 409 264.7 412.8C262 423.2 260.6 434 257.6 444.2C256.6 447.8 254.8 451.2 253.8 454.8H253.7Z"
        fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M220.6 429.1C209.2 435 190 468.4 187.3 485.1C182.3 516 183.8 532.9 183.5 542C183.2 551.1 199.6 549.3 213.3 536.9C221.8 529.2 244.7 477.2 240.1 451.5C236.8 432.7 230.8 424.8 220.6 429.1Z"
        fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M617.3 454.8C626.3 488.1 660.8 562.4 661.3 564.1C662.7 568.4 660 574 656.5 576.6C651 580.6 645.2 572.1 642.3 568.5C622.3 543.8 604.6 497.4 601.8 486C598.4 472.4 587.7 453.1 592 430.2C596.4 407.3 600.3 396.5 602.2 399C604.8 402.2 605.3 409 606.3 412.8C609 423.2 610.4 434 613.4 444.2C614.4 447.8 616.2 451.2 617.2 454.8H617.3Z"
        fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M650.3 429.1C661.7 435 680.9 468.4 683.6 485.1C688.6 516 687.1 532.9 687.4 542C687.7 551.1 671.3 549.3 657.6 536.9C649.1 529.2 626.2 477.2 630.8 451.5C634.1 432.7 640.1 424.8 650.3 429.1Z"
        fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
