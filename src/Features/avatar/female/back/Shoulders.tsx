import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
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
        if (selectedPart === 'shoulders') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('shoulders');
      }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M280.8 359.4C273 353 253 337.5 233.4 344.6C211.8 355.4 201.3 373.8 200.3 418.6C200.8 419.5 202 442.2 202.5 443C225.4 405.4 257.7 378.5 280.9 359.4H280.8Z"
        fill={selectedPart === 'shoulders' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M557.7 442.9C558.2 442 559.4 419.4 559.8 418.5C561.4 377.9 556.1 358.5 528.5 343.6C505.8 338.6 493.6 352.8 485.8 359.3C510.4 383.5 536.1 410.1 557.6 442.9H557.7Z"
        fill={selectedPart === 'shoulders' ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
