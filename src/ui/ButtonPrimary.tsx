import { Text, Pressable } from "react-native";
interface ButtonPrimaryProps {
    title: string;
    onPress: () => void;
    classNameButton?: string;
    classNameText?: string;
}
const ButtonPrimary = ({ title, onPress, classNameButton, classNameText }: ButtonPrimaryProps) => {
    return (
        <Pressable onPress={onPress} className={`bg-lime-500 w-full py-4 rounded-2xl items-center shadow-lg ${classNameButton}`}>
            <Text className={`text-center text-black font-extrabold text-base ${classNameText}`}>{title}</Text>
        </Pressable>
    );
};
export default ButtonPrimary;