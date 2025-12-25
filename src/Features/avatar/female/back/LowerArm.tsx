import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface LowerArmsProps {
    selectedPart: BodyPart | null;
    setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

export const LowerArms = ({ selectedPart, setSelectedPart }: LowerArmsProps) => {
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
                d="M212.1 617.8C207.5 620.7 200.8 626.1 195.7 626C192.9 625.6 188 625.4 183.4 626C170.9 639.1 144.1 702.9 128.9 740.5C158.6 718.9 204.7 639.6 213.4 617.8C213.7 617.2 213 617.3 212 617.8H212.1Z"
                fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M123.4 672.4C110.3 705.1 97.3999 738.6 91.9999 752.8C87.7999 767.2 101.5 768 105.6 766.4C108.6 731.3 144.3 629.4 156.1 604.2C146.2 615.4 134.9 643.6 123.4 672.4Z"
                fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M158.9 649.2C161 638.2 163.4 625.2 163 605.6C141.8 648.8 116.2 708.5 116.6 740.6C124.1 731.8 137.2 714.1 142.5 701.1C148.9 681.2 156.1 670.3 158.9 649.3V649.2Z"
                fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M566.6 626C561.5 626.1 554.9 620.7 550.2 617.8C549.2 617.3 548.6 617.2 548.8 617.8C557.6 639.6 603.7 718.9 633.3 740.5C618.1 702.9 591.2 639 578.8 626C574.3 625.4 569.3 625.6 566.5 626H566.6Z"
                fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M603.5 649.2C606.3 670.2 613.5 681.1 619.9 701C625.2 714 638.3 731.8 645.8 740.5C646.3 708.5 620.6 648.7 599.4 605.5C599 625.2 601.4 638.1 603.5 649.1V649.2Z"
                fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M670.3 752.8C665 738.5 652 705 638.9 672.4C627.4 643.7 616 615.4 606.2 604.2C618 629.4 653.7 731.4 656.7 766.4C660.8 768 674.6 767.2 670.3 752.8Z"
                fill={selectedPart === 'lower arms' ? colors.lime[600] : '#3F3F3F'}
            />
        </G>
    );
};
