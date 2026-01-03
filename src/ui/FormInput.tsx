// import React, { useRef } from 'react';
// import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
// import {
//   StyleProp,
//   Text,
//   TextInput,
//   TextInputProps,
//   TextStyle,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from 'react-native';

// // הוספתי ? לכל הסטיילים כדי שיהיו אופציונליים
// interface FormInputProps<T extends FieldValues> extends TextInputProps {
//   control: Control<T>;
//   name: Path<T>;
//   rules?: RegisterOptions<T, Path<T>>;
//   label?: string;
//   containerStyle?: StyleProp<ViewStyle>;
//   inputStyle?: StyleProp<TextStyle>;
//   errorStyle?: StyleProp<TextStyle>;
//   labelStyle?: StyleProp<TextStyle>; // סטייל נפרד ללייבל
// }

// // שים לב להוספת ה- <T extends FieldValues> לפני הסוגריים של הפונקציה
// const FormInput = <T extends FieldValues>({
//   control,
//   name,
//   rules,
//   label,
//   inputStyle,
//   errorStyle,
//   containerStyle,
//   labelStyle,
//   ...rest
// }: FormInputProps<T>) => {
//   // כאן משתמשים ב-T ולא ב-FieldValues הכללי
//   const inputRef = useRef<TextInput>(null);

//   return (
//     <View>
//       {/* <View style={containerStyle}> */}
//       {label && (
//         <TouchableOpacity onPress={() => inputRef.current?.focus()} activeOpacity={0.7}>
//           <Text style={labelStyle}>{label}</Text>
//         </TouchableOpacity>
//       )}

//       <Controller
//         control={control}
//         rules={rules}
//         name={name}
//         render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
//           <View>
//             <TextInput
//               {...rest}
//               ref={inputRef}
//               // שילוב של סטייל בסיסי עם הסטייל שהועבר ב-props
//               //   style={[inputStyle, error && { borderColor: 'red' }]}
//               onBlur={onBlur}
//               onChangeText={onChange}
//               value={value}
//             />
//             {error && (
//               <Text style={[{ color: 'red', marginTop: 4 }, errorStyle]}>
//                 {error.message || 'שדה חובה'}
//               </Text>
//             )}
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default FormInput;
