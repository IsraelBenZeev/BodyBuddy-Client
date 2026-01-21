import { StyleSheet, Text } from 'react-native';
import AppButton from './PressableOpacity';
interface IconButtonProps {
  children: React.ReactNode;
  text?: string;
  classNameText?: string;
  onPress?: () => void;
}
const IconButton = ({ children, text, classNameText, onPress }: IconButtonProps) => {
  return (
    <AppButton
      animationType="opacity"
      haptic="medium"
      style={styles.button}
      className="gap-2 items-center w-[15%] h-10 justify-center rounded-lg"
      onPress={onPress}>

      {children}
      {text && <Text
        style={styles.text}
        className={classNameText ? classNameText : ''}>{text}</Text>}
    </AppButton>
  );
};

export default IconButton;
const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    bottom: -18,
    textAlign: 'center',
    width: '100%',
  }
});
