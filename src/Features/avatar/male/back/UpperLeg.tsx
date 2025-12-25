import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';
interface UpperLegProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}
const UpperLeg = ({ selectedPart, setSelectedPart }: UpperLegProps) => {
  return (
    <G
      id="upper legs"
      onPress={() => {
        console.log('upper leg pressed');
        if (selectedPart === 'upper legs') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('upper legs');
      }}
    >
      <Path
        d="M373.6 953.8C382.4 961.6 406.9 1004.8 399.1 1046.7C391.3 1088.6 411.2 1019.8 415.7 992.9C419.2 971.6 421.4 955.3 417.4 951.8C411.1 946.3 373.6 953.8 373.6 953.8Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M268.1 904.3C265.2 923.3 272 1067.2 283.2 1110.6C294.4 1154 291.9 1127.7 289.5 1106.2C287.1 1084.7 293.9 1029.6 294.9 1010.1C295.9 990.6 292 942.3 283.7 921.3C275.4 900.3 276.9 899.4 272 892C267.1 884.7 268.1 904.2 268.1 904.2V904.3Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M298 1172C292.9 1196.8 290 1240.8 287.6 1242.7C308.6 1220.3 331.9 1137.7 337.3 1110C342.7 1082.7 342.8 992.9 345.2 978.3C347.6 963.7 345 964.7 342.7 956.9C339.4 945.5 326 927 319.1 920.1C292.8 893.8 313.3 1096.2 297.9 1172H298Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M392 1047.2C392 1073.1 368.6 1140.4 370.1 1170.6C371.6 1200.8 365.4 1253.5 364.5 1257.9C374.7 1234 379.6 1182.3 380.1 1156.9C380.6 1131.5 397.4 1087.6 395.5 1073C393.6 1058.4 392.1 1047.1 392.1 1047.1L392 1047.2Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M355.5 975.1C350.9 995 332.5 1210.1 350.9 1234C358.7 1220.8 364.4 1105.7 382.2 1059.4C391.4 1035.3 381.5 1004 377.1 987.5C375.7 982.1 361.7 959.5 361.7 959.5L355.4 975.2L355.5 975.1Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M496.9 953.8C488.1 961.6 463.6 1004.8 471.4 1046.7C479.2 1088.6 459.3 1019.8 454.8 992.9C451.3 971.6 449.1 955.3 453.1 951.8C459.4 946.3 496.9 953.8 496.9 953.8Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M602.3 904.3C605.2 923.3 598.4 1067.2 587.2 1110.6C576 1154 578.5 1127.7 580.9 1106.2C583.3 1084.7 576.5 1029.6 575.5 1010.1C574.5 990.6 578.4 942.3 586.7 921.3C595 900.3 593.5 899.4 598.4 892C603.3 884.7 602.3 904.2 602.3 904.2V904.3Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
        />
      <Path
       d="M572.4 1172C577.5 1196.8 580.4 1240.8 582.8 1242.7C561.8 1220.3 538.5 1137.7 533.1 1110C527.7 1082.7 527.6 992.9 525.2 978.3C522.8 963.7 525.4 964.7 527.7 956.9C531 945.5 544.4 927 551.3 920.1C577.6 893.8 557.1 1096.2 572.5 1172H572.4Z" 
       fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M478.5 1047.2C478.5 1073.1 501.9 1140.4 500.4 1170.6C498.9 1200.8 505.1 1253.5 506 1257.9C495.8 1234 490.9 1182.3 490.4 1156.9C489.9 1131.5 473.1 1087.6 475 1073C476.9 1058.4 478.4 1047.1 478.4 1047.1L478.5 1047.2Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M515 975.1C519.6 995 538 1210.1 519.6 1234C511.8 1220.8 506.1 1105.7 488.3 1059.4C479.1 1035.3 489 1004 493.4 987.5C494.8 982.1 508.8 959.5 508.8 959.5L515.1 975.2L515 975.1Z"
        fill={selectedPart === 'upper legs' ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};

export default UpperLeg;
