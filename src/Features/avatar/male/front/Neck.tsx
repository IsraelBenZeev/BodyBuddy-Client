import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';
import { colors } from '../../../../../colors';
interface NeckProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
export const Neck = ({ isSelected, handleTogglePart }: NeckProps) => {
  return (
    <G id="neck" onPress={() => handleTogglePart('neck')}>
      <Path
        d="M388.5 197.9C405 211.2 405.3 225.7 412.5 240.2C433.4 281.9 425.8 307.1 420.9 301.9C406.8 286.8 392.1 238.5 389.9 234.5C387.7 230.5 388.4 197.9 388.4 197.9H388.5Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M386 258.4C384 273.5 385.3 278.5 388.4 286.6C391.6 294.6 409.4 303.1 411.1 304.3C401.5 281.3 392.6 265.4 388.4 251C385 251.7 386 258.4 386 258.4Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M373.8 255.6C365.5 265.6 334 286.3 325.3 289C323.8 294.7 369.9 299.9 375.8 295.2C381.7 290.6 381.7 260.7 380.7 255.6C379.7 250.5 373.9 255.6 373.9 255.6H373.8Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M435.3 210C435.7 229 438.1 261 435.6 268C433.1 275.1 427.1 250 418.9 232.6C410.7 215.3 413.8 221.8 411.6 214C409.4 206.2 396.6 206.9 405.3 206.2C414.1 205.5 435.4 209.9 435.4 209.9L435.3 210Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M482.4 197.9C465.9 211.2 465.6 225.7 458.4 240.2C437.5 281.9 445.1 307.1 450 301.9C464.1 286.8 478.8 238.5 481 234.5C483.2 230.5 482.5 197.9 482.5 197.9H482.4Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M485 258.4C487 273.5 485.7 278.5 482.6 286.6C479.4 294.6 461.6 303.1 459.9 304.3C469.5 281.3 478.4 265.4 482.6 251C486 251.7 485 258.4 485 258.4Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M497.2 255.6C505.5 265.6 537 286.3 545.7 289C547.2 294.7 501.1 299.9 495.2 295.2C489.3 290.6 489.3 260.7 490.3 255.6C491.3 250.5 497.1 255.6 497.1 255.6H497.2Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M435.3 210C434.9 229 432.9 261 435.4 268C437.9 275.1 443.9 250 452.1 232.6C460.3 215.3 457.2 221.8 459.4 214C461.6 206.2 474.4 206.9 465.7 206.2C456.9 205.5 435.3 209.9 435.3 209.9L435.3 210Z"
        fill={isSelected('neck') ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
