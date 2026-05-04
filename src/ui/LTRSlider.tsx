import { Slider } from '@miblanchard/react-native-slider';
import { ComponentProps } from 'react';

// ספריית הסליידר מטפלת בקואורדינטות המגע במרחב המקורי — לכן לא מפעילים scaleX: -1
// (ה-transform מהפך ויזואל אבל לא אירועי מגע, מה שגורם לתנועה הפוכה)
type LTRSliderProps = Omit<ComponentProps<typeof Slider>, 'animationType'> & {
  animationType?: ComponentProps<typeof Slider>['animationType'];
};

const LTRSlider = ({ animationType = 'timing', ...props }: LTRSliderProps) => (
  <Slider animationType={animationType} {...props} />
);

export default LTRSlider;
