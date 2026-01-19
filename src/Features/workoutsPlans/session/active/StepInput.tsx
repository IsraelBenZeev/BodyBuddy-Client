import { Control, Controller } from "react-hook-form";
import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  step?: number; // בכמה להעלות/להוריד בכל לחיצה
}

const StepInput = ({ control, name, label, step = 1 }: Props) => {
  return (
    <View className="flex-1 items-center gap-2">
      <Text className="text-zinc-400 text-xs font-bold uppercase">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value = 0 } }) => (
          <View className="flex-row items-center bg-zinc-900 rounded-2xl border border-white/5 p-1">
            
            {/* כפתור מינוס */}
            <Pressable
              onPress={() => onChange(Math.max(0, (Number(value) || 0) - step))}
              className="w-12 h-12 items-center justify-center bg-zinc-800 rounded-xl active:bg-zinc-700"
            >
              <MaterialCommunityIcons name="minus" size={24} color="white" />
            </Pressable>

            {/* תצוגת המספר */}
            <View className="px-4 min-w-[60px] items-center">
              <Text className="text-white text-2xl font-black">
                {value}
              </Text>
            </View>

            {/* כפתור פלוס */}
            <Pressable
              onPress={() => onChange((Number(value) || 0) + step)}
              className="w-12 h-12 items-center justify-center bg-lime-500 rounded-xl active:bg-lime-400"
            >
              <MaterialCommunityIcons name="plus" size={24} color="black" />
            </Pressable>
            
          </View>
        )}
      />
    </View>
  );
};

export default StepInput;