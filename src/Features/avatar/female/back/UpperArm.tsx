import { colors } from '@/colors';
import { BodyPart } from '@/src/types';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface UpperArmsProps {
    selectedPart: BodyPart | null;
    setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

export const UpperArms = ({ selectedPart, setSelectedPart }: UpperArmsProps) => {
    return (
        <G
            id="upper arms"
            onPress={() => {
                if (selectedPart === 'upper arms') {
                    setSelectedPart(null);
                    return;
                }
                setSelectedPart('upper arms');
            }}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M183.4 570.1H184.8C191.2 532.4 198.4 487.6 206.6 450.1C176.2 495.6 184.4 534 183.4 570.1Z"
                fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M201.2 572.9C206 574 213.2 551.4 203.9 495.2C195.5 523.7 193 569.4 201.2 572.9Z"
                fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M236.6 421.5C191.1 451 221.1 541.2 216.1 585.1C268.9 520.9 232.8 453.7 236.6 421.5Z"
                fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M561.2 572.9C569.4 569.3 566.9 523.7 558.5 495.2C549.2 551.4 556.4 574 561.2 572.9Z"
                fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M555.7 450.2C563.9 487.7 571.2 532.5 577.5 570.2H578.9C578 534.1 586.1 495.7 555.7 450.2Z"
                fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M525.7 421.5C529.4 453.7 493.3 520.9 546.2 585.1C541.3 541.2 571.2 451 525.7 421.5Z"
                fill={selectedPart === 'upper arms' ? colors.lime[600] : '#3F3F3F'}
            />
        </G>
    );
};
