import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  type?: "text" | "number"; // הוספת ה-Type
  placeholder?: string;
}

const MyInput = ({ control, name, label, type = "text", placeholder }: Props) => {
  return (
    <View className="mb-4">
      <Text className="text-white mb-2 font-medium">{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 focus:border-lime-500"
            onBlur={onBlur}
            // לוגיקה לשינוי ה-Value וה-OnChange לפי הטיפוס
            onChangeText={(text) => {
              if (type === "number") {
                // מנקה כל מה שהוא לא מספר והופך ל-Int
                const cleaned = text.replace(/[^0-9]/g, "");
                onChange(cleaned ? parseInt(cleaned, 10) : 0);
              } else {
                onChange(text);
              }
            }}
            value={value?.toString() || ""} 
            
            // הגדרות מקלדת לפי הטיפוס
            keyboardType={type === "number" ? "numeric" : "default"}
            placeholder={placeholder || (type === "number" ? "0" : "הקלד כאן...")}
            placeholderTextColor="#666"
            
            // הגדרות נוספות
            multiline={type === "text"} 
            numberOfLines={type === "text" ? 3 : 1}
            textAlignVertical={type === "text" ? "top" : "center"}
          />
        )}
      />
    </View>
  );
};

export default MyInput;