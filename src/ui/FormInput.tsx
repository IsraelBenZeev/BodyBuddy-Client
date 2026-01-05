import { useRef } from 'react';
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

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  isPendingCreate?: boolean;
}

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
  const inputRef = useRef<TextInput>(null);
  return (
    <View style={containerStyle}>
      {label && (
        <TouchableOpacity onPress={() => inputRef.current?.focus()} disabled={isPendingCreate} activeOpacity={0.7}>
          <Text style={labelStyle}>{label}</Text>
        </TouchableOpacity>
      )}

      <Controller
        control={control}
        rules={rules}
        name={name}
        // @ts-ignore - פתרון מהיר אם אתה יודע שזה תמיד יהיה string
        // או הפתרון ה"נכון" מבחינת Types:
        // defaultValue={"test" as any}
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
              value={value?.toString() ?? ''}
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
