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
        d="M307.6 1232.8C268.1 1278.9 278 1391.8 284.5 1421.8C291.1 1451.8 291.9 1457.1 305.8 1456.9C311.2 1456.9 323.4 1449.1 321.2 1424.3C319 1399.4 321.7 1330.5 321.7 1302.9C321.7 1275.3 326.1 1208.4 326.1 1208.4L307.6 1232.9V1232.8Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M333.3 1265.2C338.8 1322.3 334.4 1393.4 333.3 1414.9C332.2 1435.4 331.2 1454.8 340.9 1456.8C350.7 1458.8 374.1 1427.7 378.5 1399.2C382 1376.5 375.9 1328.1 371.9 1306.7C366.3 1276.3 359.3 1265.2 351.7 1249.6C344.1 1234 336.9 1216.4 335.6 1209.1C334.3 1201.8 333.2 1265.2 333.2 1265.2H333.3Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M308 1471.3C314.6 1471.5 320.1 1476.5 321 1483.1C325.7 1521 329.5 1614.7 328.6 1620.8C327.6 1627.6 324.3 1659.8 321.3 1645.1C312.4 1601.9 307.1 1539.3 301.8 1513.4C296.7 1488.4 287.7 1482.3 297.4 1474.5C302.4 1470.5 301.5 1471.2 308 1471.3Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M336.9 1476.4C328.8 1485.7 337.4 1648.9 338.9 1649C340.4 1649.1 344.3 1596.4 351.6 1566.2C358.9 1536 359.2 1486.3 359.2 1486.2C356.3 1474.5 343.1 1472.3 337 1476.4H336.9Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M562.8 1232.8C602.3 1278.9 592.4 1391.8 585.9 1421.8C579.3 1451.8 578.5 1457.1 564.6 1456.9C559.2 1456.9 547 1449.1 549.2 1424.3C551.4 1399.4 548.7 1330.5 548.7 1302.9C548.7 1275.3 544.3 1208.4 544.3 1208.4L562.8 1232.9V1232.8Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M537.1 1265.2C531.6 1322.3 536 1393.4 537.1 1414.9C538.2 1435.4 539.2 1454.8 529.5 1456.8C519.7 1458.8 496.3 1427.7 491.9 1399.2C488.4 1376.5 494.5 1328.1 498.5 1306.7C504.1 1276.3 511.1 1265.2 518.7 1249.6C526.3 1234 533.5 1216.4 534.8 1209.1C536.1 1201.8 537.2 1265.2 537.2 1265.2H537.1Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M562.4 1471.3C555.8 1471.5 550.3 1476.5 549.4 1483.1C544.7 1521 540.9 1614.7 541.8 1620.8C542.8 1627.6 546.1 1659.8 549.1 1645.1C558 1601.9 563.3 1539.3 568.6 1513.4C573.7 1488.4 582.7 1482.3 573 1474.5C568 1470.5 568.9 1471.2 562.4 1471.3Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
      <Path
        d="M533.6 1476.4C541.7 1485.7 533.1 1648.9 531.6 1649C530.1 1649.1 526.2 1596.4 518.9 1566.2C511.6 1536 511.3 1486.3 511.3 1486.2C514.2 1474.5 527.4 1472.3 533.5 1476.4H533.6Z"
        fill={selectedPart === 'lower_leg' ? colors.primary[900] : '#3F3F3F'}
      />
    </G>
  );
};

export default LowerLeg;
