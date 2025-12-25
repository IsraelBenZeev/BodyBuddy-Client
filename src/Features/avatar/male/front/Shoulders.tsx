import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';
interface ShouldersProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}
export const Shoulders = ({ selectedPart, setSelectedPart }: ShouldersProps) => {
  return (
    <G
      id="shoulders"
      onPress={() => {
        console.log('Shoulders pressed');
        if (selectedPart === 'shoulders') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('shoulders');
      }}
    >
      <Path
        d="M317.3 309.5C312.9 312.4 306.9 313.7 302.1 315.9C288 322.4 275 329.4 275.1 346.7C275.2 360.1 276.8 374.7 269.5 386C264.9 393.2 258.8 399.2 253.3 405.8C247.9 412.3 244.8 418.2 235.6 413.4C214.2 402.2 199.4 380.2 201.3 355.5C202.3 341.9 208.5 328.7 218.2 319.1C229 308.4 239.4 297.9 253.4 291.2C272.5 281.9 293.7 285.4 310.9 297.2C317.1 301.5 317.3 309.5 317.3 309.5Z"
        fill={selectedPart === 'shoulders' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M553.6 309.5C558 312.4 564 313.7 568.8 315.9C582.9 322.4 595.9 329.4 595.8 346.7C595.7 360.1 594.1 374.7 601.4 386C606 393.2 612.1 399.2 617.6 405.8C623 412.3 626.1 418.2 635.3 413.4C656.7 402.2 671.5 380.2 669.6 355.5C668.6 341.9 662.4 328.7 652.7 319.1C641.9 308.4 631.5 297.9 617.5 291.2C598.4 281.9 577.2 285.4 560 297.2C553.8 301.5 553.6 309.5 553.6 309.5Z"
        fill={selectedPart === 'shoulders' ? colors.primary[900] : '#3F3F3F'}
      />
    </G>
  );
};
