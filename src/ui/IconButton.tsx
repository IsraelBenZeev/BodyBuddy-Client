import { colors } from '@/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
interface IconButtonProps {
  children: React.ReactNode;
  text?: string;
  classNameText?: string;
}
const IconButton = ({ children, text, classNameText }: IconButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} className="gap-2 items-center">
      {children}
      {text && <Text
      style={styles.text}
       className={classNameText ? classNameText : ''}>{text}</Text>}
    </TouchableOpacity>
  );
};

export default IconButton;
const styles = StyleSheet.create({
  button: {
    width: '15%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    // backgroundColor: colors.lime[500],
    backgroundColor: colors.background[700],
    // marginHorizontal: 16,
  },
    text: {
        position: 'absolute',
        bottom: -18,
        textAlign: 'center',
        width: '100%',
    }
});
