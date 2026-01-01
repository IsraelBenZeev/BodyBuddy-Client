import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface UpperLegProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

export const UpperLeg = ({ selectedPart, setSelectedPart }: UpperLegProps) => {
  return (
    <G
      id="upper legs"
      onPress={() => {
        if (selectedPart === 'upper legs') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('upper legs');
      }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M278.9 1065C275.7 1020.6 281.8 972.4 300.7 936.8C290.6 931 281.6 945 278.9 945C216.2 1015.3 279.4 1096.4 285.7 1191.8C295.2 1153.1 288.1 1128.8 278.9 1065Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M257.1 953.2C250.1 936 245.3 922.7 229.8 902.8C232.1 944.3 240 981.3 246.2 1010.5C255.1 984.7 258.6 972.1 257.1 953.2Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M462 936.408C480.9 972.008 487.1 1020.11 483.8 1064.61C474.6 1128.41 467.5 1152.71 477 1191.41C483.3 1096.01 546.5 1014.91 483.8 944.608C481.1 944.608 472.1 930.608 462 936.408Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M516.236 1010.7C522.436 981.5 530.336 944.5 532.636 903C517.236 922.9 512.436 936.2 505.336 953.4C503.836 972.3 507.336 984.8 516.236 1010.7Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M426.2 1010.5C434.2 973.5 440.7 942.2 438.5 916.4C431.1 904.5 417.9 898.1 403 889.1C392.4 925.5 393.9 951.5 394.8 991.4C401.3 1027.9 411.4 1061.6 413.9 1111.4C413.9 1079.9 418.7 1050.9 426.2 1010.5Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M334.8 1040.5C330.2 1103.8 328.7 1170.5 336.2 1219.1C356.9 1182.5 344.4 1093.9 334.8 1040.5Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M323.9 916.4C321.6 942.2 328.1 973.4 336.2 1010.5C343.7 1050.9 348.5 1079.9 348.5 1111.4C351 1061.7 361.1 1028 367.6 991.4C368.5 951.6 370.1 925.6 359.4 889.1C344.5 898 331.4 904.5 323.9 916.4Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M311.121 922C279.721 1017.4 268.021 1115.5 325.721 1188.7C323.421 1176.7 321.421 1151.3 326.121 1136C330.221 1066.3 331.321 980.3 311.121 922Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M426.2 1219.1C433.6 1170.5 432.2 1103.8 427.6 1040.5C418 1093.9 405.6 1182.5 426.2 1219.1Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M450.7 921.9C430.5 980.2 431.6 1066.2 435.7 1135.9C440.4 1151.2 438.3 1176.6 436.1 1188.6C493.8 1115.3 482.1 1017.3 450.7 921.9Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
