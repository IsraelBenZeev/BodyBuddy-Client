import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface LowerLegProps {
    selectedPart: BodyPart | null;
    setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

export const LowerLeg = ({ selectedPart, setSelectedPart }: LowerLegProps) => {
    return (
        <G
            id="lower legs"
            onPress={() => {
                if (selectedPart === 'lower legs') {
                    setSelectedPart(null);
                    return;
                }
                setSelectedPart('lower legs');
            }}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M465.7 1174.1C462.8 1175 452.3 1179.6 450.7 1187.7C452.8 1212.8 453.9 1267.5 453.4 1319.9C446.3 1389.7 449.1 1429.4 454.8 1441.2H457.5C467.6 1425.7 484.7 1407.4 490.2 1379.8C492.2 1370.9 490.7 1362.9 490.2 1355.3C482.2 1281.1 471.1 1245.5 465.7 1174V1174.1Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M413.9 1429C409.6 1454 413.8 1488.5 418 1525.8C418.6 1554.7 420.9 1603.9 424.8 1613.1C425.7 1613.1 429.8 1609.1 430.3 1606.3C432.2 1595.3 427.7 1566.9 424.8 1528.6C426.3 1462.7 422.9 1437 413.9 1429.1V1429Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M435.7 1619.9C437.7 1621.6 443.4 1620.4 443.9 1617.2C444.9 1562.4 452.6 1518 473.9 1455C475.6 1445.8 474.7 1439.7 472.5 1433.2C444.4 1459.6 436 1571.8 435.7 1620V1619.9Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M325.3 1400.4C336 1420.4 342.7 1421.9 352.6 1427.7C384.5 1394 331 1201.5 317.1 1187.8C311.6 1202.5 316.9 1328.3 325.3 1400.5V1400.4Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M332.1 1606.3C332.6 1609.1 336.7 1613.1 337.6 1613.1C341.5 1604 343.8 1554.8 344.4 1525.8C348.6 1488.5 352.8 1454 348.5 1429C339.5 1436.9 336.1 1462.6 337.6 1528.5C334.7 1566.8 330.3 1595.2 332.1 1606.2V1606.3Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M307.5 1441.3C313.1 1429.4 315.9 1389.8 308.9 1320C308.4 1267.5 309.5 1212.8 311.6 1187.8C310 1179.6 299.5 1175.1 296.6 1174.2C291.2 1245.7 280 1281.4 272.1 1355.5C271.6 1363.2 270.1 1371.2 272.1 1380C277.6 1407.5 294.8 1425.9 304.8 1441.4H307.5V1441.3Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M318.4 1617.2C318.9 1620.5 324.5 1621.6 326.6 1619.9C326.3 1571.7 317.9 1459.5 289.8 1433.1C287.7 1439.6 286.8 1445.7 288.4 1454.9C309.7 1517.9 317.4 1562.4 318.4 1617.1V1617.2Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M437.1 1400.4C445.5 1328.2 450.8 1202.4 445.3 1187.7C431.4 1201.5 378 1394 409.8 1427.6C419.6 1421.9 426.4 1420.4 437.1 1400.3V1400.4Z"
                fill={selectedPart === 'lower legs' ? colors.lime[600] : '#3F3F3F'}
            />
        </G>
    );
};
