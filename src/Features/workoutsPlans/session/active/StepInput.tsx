import PressableOpacity from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; // ייבוא הרטט
import { useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
interface Props {
    control: Control<any>;
    name: string;
    label: string;
    step?: number; // בכמה להעלות/להוריד בכל לחיצה
    disabled?: boolean;
}
const StepInput = ({ control, name, label, step = 1, disabled = false }: Props) => {

    // const handlePress = (currentValue: number, delta: number, onChange: (v: number) => void) => {
    //     const newValue = Math.max(0, (Number(currentValue) || 0) + delta);
    //     if (currentValue === 0 && delta < 0) {
    //         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    //         return;
    //     }
    //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    //     onChange(newValue);
    // };
    const timerRef = useRef<any>(null);

    // פונקציה לעדכון הערך (הוצאנו אותה החוצה כדי שגם הלחיצה הקצרה וגם הארוכה ישתמשו בה)
    const updateValue = (currentValue: number, delta: number, onChange: (v: number) => void) => {
        const newValue = Math.max(0, (Number(currentValue) || 0) + delta);
        if (currentValue === 0 && delta < 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return currentValue;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(newValue);
        return newValue;
    };

    // התחלת לחיצה ארוכה
    const handleLongPressStart = (currentValue: number, delta: number, onChange: (v: number) => void) => {
        // if (disabled) return;

        let latestValue = currentValue;
        // מפעילים אינטרוול שרץ כל 100 מילי-שניות
        timerRef.current = setInterval(() => {
            latestValue = updateValue(latestValue, delta, onChange);
        }, 100);
    };

    // עצירת הלחיצה
    const handleLongPressEnd = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    return (

        <View className="flex-1  items-center justify-center gap-2 ">
            <View className="flex-1">
                <Text className="text-zinc-400 text-xs font-bold uppercase">{label}</Text>
            </View>
            <View className="flex-1">
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value = 0 } }) => (
                        <View className="flex-row items-center bg-zinc-900 rounded-2xl border border-white/5">
                            <PressableOpacity
                                activeOpacity="/50"
                                disabled={!disabled}
                                // onPress={() => handlePress(value, -step, onChange)}
                                bgColor='background-800'
                                onPress={() => updateValue(value, -step, onChange)} // לחיצה רגילה
                                onPressIn={() => handleLongPressStart(value, -step, onChange)} // תחילת לחיצה ארוכה
                                onPressOut={handleLongPressEnd} // עזיבה
                                className={"rounded-full p-2"}
                                >
                                <MaterialCommunityIcons name="minus" size={24} color="white" />
                            </PressableOpacity>


                            <View className="px-4 min-w-[30px] items-center justify-center">
                                <AnimatedNumbers
                                    includeComma={false}
                                    animateToNumber={Number(value)}
                                    fontStyle={{
                                        fontSize: 24,
                                        fontWeight: '900',
                                        color: 'white',
                                        fontStyle: 'italic'
                                    }}
                                    animationDuration={300} // מהירות הגלילה (במילי-שניות)
                                    />
                            </View>

                            <PressableOpacity
                                activeOpacity="/50"
                                disabled={!disabled}
                                bgColor='lime-500'
                                // onPress={() => handlePress(value, step, onChange)}
                                onPress={() => updateValue(value, step, onChange)} // לחיצה רגילה
                                onPressIn={() => handleLongPressStart(value, step, onChange)} // תחילת לחיצה ארוכה
                                onPressOut={handleLongPressEnd} // עזיבה
                                className={"rounded-full p-2"}
                            >
                                <MaterialCommunityIcons name="plus" size={24} color="black" />
                            </PressableOpacity>
                        </View>
                    )}
                />
            </View>

        </View>
    );
};


export default StepInput;
