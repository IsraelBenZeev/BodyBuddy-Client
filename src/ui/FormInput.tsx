import React, { useRef } from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

// הוספתי ? לכל הסטיילים כדי שיהיו אופציונליים
interface FormInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>; // סטייל נפרד ללייבל
  isPendingCreate?: boolean;
}

// שים לב להוספת ה- <T extends FieldValues> לפני הסוגריים של הפונקציה
const FormInput = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  inputStyle,
  errorStyle,
  containerStyle,
  labelStyle,
  isPendingCreate,
  ...rest
}: FormInputProps<T>) => {
  // כאן משתמשים ב-T ולא ב-FieldValues הכללי
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={containerStyle}>
      {/* <View style={containerStyle}> */}
      {label && (
        <TouchableOpacity onPress={() => inputRef.current?.focus()} disabled={isPendingCreate} activeOpacity={0.7}>
          <Text style={labelStyle}>{label}</Text>
        </TouchableOpacity>
      )}

      <Controller
        control={control}
        rules={rules}
        name={name}
        disabled={isPendingCreate}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <View>
            <TextInput
              editable={!isPendingCreate}
              {...rest}
              ref={inputRef}
              // שילוב של סטייל בסיסי עם הסטייל שהועבר ב-props
              //   style={[inputStyle, error && { borderColor: 'red' }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={inputStyle}
            />
            {error && (
              <Text style={[{ color: 'red', marginTop: 4 }, errorStyle]}>
                {error.message || 'שדה חובה'}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default FormInput;
