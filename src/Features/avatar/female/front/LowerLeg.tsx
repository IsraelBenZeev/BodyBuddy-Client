import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface LowerLegProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

const LowerLeg = ({ selectedPart, setSelectedPart }: LowerLegProps) => {
  return (
    <G
      id="lower_leg"
      onPress={() => {
        console.log('lower leg pressed');
        if (selectedPart === 'lower_leg') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('lower_leg');
      }}
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M323.91 1486C322.31 1473.9 320.51 1459.8 319.81 1443.8C317.41 1404.1 309.81 1344.9 303.51 1319.9C294.11 1281.8 287.11 1262.3 284.41 1254.6C281.51 1271.6 278.81 1302.6 285.81 1321.3C290.51 1341.4 299.61 1379.8 307.61 1419.3C313.01 1451.4 317.71 1486.1 322.61 1510.5C325.41 1524.8 327.51 1540.2 330.81 1543.2C332.11 1540.1 336.21 1540.2 332.41 1524.2C332.11 1521.5 327.71 1507.3 324.01 1486H323.91Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
        />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M321.11 1520C312.11 1495.2 306.71 1437 302.01 1404.3C297.01 1384.8 283.21 1316.2 276.11 1298.1C263.91 1352.5 269.111 1394.6 288.411 1435.6C297.511 1475.8 313.91 1524.7 323.81 1535C323.51 1529 322.31 1526 321.11 1520Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
            
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M485.91 1298.2C478.91 1316.3 465.01 1384.8 460.01 1404.4C455.31 1437.1 450.01 1495.3 440.91 1520.1C439.71 1526.1 438.51 1529.1 438.21 1535.1C448.01 1524.8 464.51 1476 473.61 1435.7C492.91 1394.8 498.11 1352.7 485.91 1298.2Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M458.61 1320C452.21 1345 444.61 1404.1 442.31 1443.9C441.61 1459.9 439.81 1474 438.21 1486.1C434.51 1507.4 430.11 1521.6 429.81 1524.3C426.11 1540.3 430.21 1540.2 431.41 1543.3C434.71 1540.4 436.71 1524.9 439.61 1510.6C444.41 1486.2 449.21 1451.5 454.61 1419.4C462.61 1379.9 471.71 1341.5 476.41 1321.4C483.41 1302.8 480.71 1271.7 477.81 1254.7C475.11 1262.5 468.21 1282 458.71 1320H458.61Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M438.21 1386.6C438.81 1325.1 438.21 1320.5 438.21 1320.9C438.21 1321 438.21 1321.2 438.21 1321.3C438.21 1321.3 438.21 1321 438.21 1320.9C438.21 1308.4 422.81 1255.5 420.51 1253.2C414.01 1271.2 409.51 1296.5 405.51 1325.3C402.61 1346.6 398.91 1369.8 400.11 1393.4C408.81 1446 419.91 1489.1 426.01 1517.3C436.01 1483.1 440.51 1426.5 438.31 1386.6H438.21Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M341.61 1253.3C339.41 1255.5 323.81 1308.5 323.91 1321V1321.4C323.91 1321.3 323.91 1321.1 323.91 1321C323.81 1320.7 323.31 1325.3 323.91 1386.7C321.61 1426.5 326.11 1483.2 336.21 1517.4C342.31 1489.2 353.41 1446.1 362.11 1393.5C363.21 1370 359.61 1346.7 356.71 1325.4C352.71 1296.6 348.31 1271.3 341.71 1253.3H341.61Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
    </G>
  );
};

export default LowerLeg;
