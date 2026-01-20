// import { Exercise } from "@/src/types/exercise";
// import { Control, useFieldArray } from "react-hook-form";
// import { View } from "react-native";
// import StepInput from "./StepInput";
// interface Props {
//     control: Control<any>;
//     step?: number;
//     item: Exercise;
// }
// const Failds = ({ control, step = 1, item }: Props) => {
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: `exercises.${item.exerciseId}.sets`
//     });
//     return (
//         <View className="flex-1 flex-row gap-2 w-full bg-background-700 py-2 px-4 rounded-2xl">

//             {/* <StepInput
//                 control={control}
//                 name={`exercises.${item.exerciseId}.sets`}
//                 label="סטים"
//                 step={1}
//             /> */}
//             <StepInput
//                 control={control}
//                 name={`exercises.${item.exerciseId}.weight`}
//                 label="משקל"
//                 step={2.5}
//             />
//             <StepInput
//                 control={control}
//                 name={`exercises.${item.exerciseId}.reps`}
//                 label="חזרות"
//                 step={1}
//             />
//         </View>
//     );
// };

// export default Failds;
import PressableOpacity from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFieldArray } from 'react-hook-form';
import { Text, View } from 'react-native';
import StepInput from './StepInput';

const Failds = ({ control, item }: any) => {
    const { fields, append } = useFieldArray({
        control,
        name: `exercises.${item.exerciseId}.sets`
    });

    // פונקציה שמוסיפה סט חדש ומעתיקה את הערכים מהסט האחרון לנוחות המשתמש
    const handleAddSet = () => {
        const lastSet = fields[fields.length - 1] as any;
        append({
            weight: lastSet?.weight || 0,
            reps: lastSet?.reps || 0
        });
    };

    return (
        <View className="w-full gap-4">
            {/* רינדור כל הסטים הקיימים */}
            {fields.map((field, index) => {
                const isLast = index === fields.length - 1;

                return (
                    <View
                        key={field.id}
                        className={`flex-1 gap-2 w-full py-3 px-4 rounded-2xl border ${isLast
                            ? "bg-background-700 border-lime-500/30"
                            : "bg-background-800/50 border-white/5 opacity-50"
                            }`}
                    >
                        {/* <View className="justify-center mr-2">
                            <Text className="text-white font-bold text-xs">סט {index + 1}</Text>
                        </View> */}

                        <View className="justify-center mr-2">
                            <Text className="text-white font-bold text-xs">סט {index + 1}</Text>
                        </View>

                        <View className="w-full flex-row gap-2">


                            <View className="flex-1">
                                <StepInput
                                    control={control}
                                    // שים לב לנתיב הדינמי שכולל את האינדקס של הסט
                                    name={`exercises.${item.exerciseId}.sets.${index}.weight`}
                                    label="משקל"
                                    step={1}
                                    disabled={index === fields.length - 1}
                                />
                            </View>

                            <View className="flex-1">
                                <StepInput
                                    control={control}
                                    name={`exercises.${item.exerciseId}.sets.${index}.reps`}
                                    label="חזרות"
                                    step={1}
                                    disabled={index === fields.length - 1}
                                />
                            </View>
                        </View>

                        {/* {!isLast && (
                            <View className="justify-center ml-1">
                                <MaterialCommunityIcons name="check-circle" size={20} color="#bef264" />
                            </View>
                        )} */}
                    </View>
                );
            })}

            {/* כפתור הוספת סט חדש */}
            <PressableOpacity
                onPress={handleAddSet}
                className="bg-lime-500/10 border border-lime-500/50 py-3 rounded-2xl flex-row justify-center items-center"
            >
                <MaterialCommunityIcons name="plus" size={20} color="#bef264" />
                <Text className="text-lime-500 font-bold ml-2">סיים סט {fields.length}</Text>
            </PressableOpacity>
        </View>
    );
};

export default Failds;