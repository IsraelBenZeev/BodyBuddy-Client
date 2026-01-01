import { BodyPart } from '@/src/types/bodtPart';
import { G, Path } from 'react-native-svg';
import { colors } from '../../../../../colors';
interface ChestProps {
  isSelected: (partName: BodyPart) => boolean;
  handleTogglePart: (partName: BodyPart) => void;
}
export const Chest = ({ isSelected, handleTogglePart }: ChestProps) => {
  const bodyPart: BodyPart = 'chest';
  return (
    <G id="chest" onPress={() => handleTogglePart(bodyPart)}>
      <Path
        d="M285.5 372C283.2 403.5 291.4 441.5 316.7 456.6C326 462.1 336.8 464.6 347.4 466.7C380.7 473.4 421 456.8 424.3 426.4C427.8 393.8 432.7 354.8 418.1 326.3C408.4 307.3 399 307.3 388.4 306.2C377.8 305.1 345 304 332.2 309.9C315.6 317.5 295.9 328.6 290.1 347C287.8 354.3 286.2 362.9 285.5 372.1V372Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M295.7 444.8C305.9 456.9 321.2 465.3 330 469.8C334.4 472.1 334.9 480.6 331.2 481.7C327.5 482.8 297.5 472.1 293.9 465.4C290.3 458.7 289.1 448.8 289.9 444.8C290.6 440.8 295.8 444.8 295.8 444.8H295.7Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M585.4 372C587.7 403.5 579.5 441.5 554.2 456.6C544.9 462.1 534.1 464.6 523.5 466.7C490.2 473.4 449.9 456.8 446.6 426.4C443.1 393.8 438.2 354.8 452.8 326.3C462.5 307.3 471.9 307.3 482.5 306.2C493.1 305.1 525.9 304 538.7 309.9C555.3 317.5 575 328.6 580.8 347C583.1 354.3 584.7 362.9 585.4 372.1V372Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
      <Path
        d="M575.2 444.8C565 456.9 549.7 465.3 540.9 469.8C536.5 472.1 536 480.6 539.7 481.7C543.4 482.8 573.4 472.1 577 465.4C580.7 458.7 581.8 448.8 581 444.8C580.3 440.8 575.1 444.8 575.1 444.8H575.2Z"
        fill={isSelected(bodyPart) ? colors.lime[600] : '#3F3F3F'}
      />
    </G>
  );
};
