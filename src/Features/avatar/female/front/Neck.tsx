import { colors } from '@/colors';
import { BodyPart } from '@/src/types/bodtPart';
import React, { Dispatch } from 'react';
import { G, Path } from 'react-native-svg';

interface NeckProps {
  selectedPart: BodyPart | null;
  setSelectedPart: Dispatch<React.SetStateAction<BodyPart | null>>;
}

export const Neck = ({ selectedPart, setSelectedPart }: NeckProps) => {
  return (
    <G
      id="neck"
      onPress={() => {
        if (selectedPart === 'neck') {
          setSelectedPart(null);
          return;
        }
        setSelectedPart('neck');
      }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M411.01 369.898C415.71 370.998 424.71 369.298 428.71 367.198C429.51 365.098 428.11 360.798 427.31 358.998C425.01 354.898 423.71 351.498 417.81 345.398C414.31 349.298 409.81 358.398 408.31 365.798C408.71 366.898 410.11 369.398 411.01 369.898Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M447.81 358.998C455.01 358.798 463.01 357.598 475.01 354.898C475.51 353.998 475.91 351.698 476.41 350.798C476.11 349.698 472.31 348.098 472.31 348.098C472.31 348.098 451.61 333.298 432.81 326.298C429.01 323.998 424.61 322.898 421.91 326.298C421.81 329.098 422.21 332.298 423.31 334.498C433.91 346.998 441.71 352.198 447.81 358.998Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M314.31 358.998C320.41 352.198 328.21 346.998 338.81 334.498C339.81 332.398 340.31 329.198 340.21 326.298C337.51 322.898 333.11 323.998 329.31 326.298C310.51 333.298 289.81 348.098 289.81 348.098C289.81 348.098 286.01 349.698 285.71 350.798C286.21 351.698 286.61 353.998 287.11 354.898C299.11 357.598 307.11 358.798 314.31 358.998Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M333.41 367.198C337.41 369.398 346.41 371.098 351.11 369.898C352.01 369.398 353.51 366.998 353.81 365.798C352.31 358.398 347.81 349.198 344.31 345.398C338.41 351.498 337.11 354.898 334.81 358.998C334.11 360.798 332.61 365.098 333.41 367.198Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M379.711 357.598C368.411 338.298 359.51 309.198 346.31 297.098C345.11 307.198 344.511 316.198 345.711 323.598C352.211 342.698 366.11 361.598 374.31 380.798C374.81 381.298 380.311 384.898 379.711 380.798V357.598Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M416.411 323.598C417.611 316.198 417.01 307.198 415.81 297.098C402.61 309.298 393.711 338.398 382.411 357.598V380.698C381.911 384.798 387.41 381.198 387.81 380.698C395.91 361.598 409.911 342.598 416.411 323.498V323.598Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M367.41 309.998C366.21 319.998 376.51 336.398 381.01 343.998V307.198C373.71 307.198 369.61 306.398 367.41 309.898V309.998Z"
        fill={selectedPart === 'neck' ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
