import { colors } from '@/colors';
import Loading from '@/src/ui/Loading'; // הרכיב שלך
import AppButton from '@/src/ui/PressableOpacity';
import LottieView from 'lottie-react-native';
import { ReactNode, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface SuccessProps {
    isLoading: boolean;
    isSuccess: boolean;
    onDone?: () => void;
    onPress: () => void;
    icon?: ReactNode;
    color?: string;
    size?: number;
    label?: string;
    loadingLabel?: string;
    className?: string;
}

const Success = ({
    isLoading,
    isSuccess,
    onDone,
    onPress,
    icon,
    color = 'lime-500',
    size,
    label,
    loadingLabel,
    className,
}: SuccessProps) => {
    const [showSuccess, setShowSuccess] = useState(false);

    // מאזין לשינוי ב-isSuccess מה-Hook החיצוני
    useEffect(() => {
        if (isSuccess) {
            setShowSuccess(true);
        }
    }, [isSuccess]);

    const handleAnimationFinish = () => {
        setShowSuccess(false);
        onDone?.();
    };

    return (
        <AppButton
            onPress={onPress}
            // כשיש אנימציה, אנחנו רוצים שהרקע של הכפתור ייעלם כדי לראות את ה-Lottie
            haptic="medium"
            animationType="opacity"
            disabled={isLoading || showSuccess}
            className={`${showSuccess ? 'bg-transparent' : `bg-${color}`} p-1 rounded-full items-center justify-center min-w-[40px] min-h-[40px] ${className}`}
        >
            {isLoading ? (
                <View style={{ width: 24, height: 24 }}>
                    <Loading size="small" color={colors.background[850]} />
                </View>
            ) : showSuccess ? (
                <LottieView
                    source={require('@/assets/animations/Success.lottie')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={handleAnimationFinish}
                    style={{ width: size, height: size }}
                    // צובע את ה-V בצבע כהה שייראה טוב על הרקע
                    colorFilters={[{ keypath: "**", color: colors.lime[500] }]}
                />
            ) : (
                <View className="flex-row items-center justify-center gap-2">
                    {icon && icon}
                    {label && (
                        <Text className="font-bold text-background-950 text-xl tracking-wide">
                            {label}
                        </Text>
                    )}
                </View>
            )}
            {/* בדיקה האם אנחנו בתהליך (או טעינה או הצלחה) */}
            {/* {(isLoading || showSuccess) ? (
                <View className="items-center justify-center">
                    {showSuccess ? (
                        <LottieView
                            source={require('@/assets/animations/Success.lottie')}
                            autoPlay
                            loop={false}
                            onAnimationFinish={handleAnimationFinish}
                            style={{ width: size, height: size }}
                            colorFilters={[{ keypath: "**", color: colors.lime[500] }]}
                        />
                    ) : (
                        <View className="flex-row items-center gap-2">
                            <Loading size="small" color={colors.lime[500]} />
                            {loadingLabel && (
                                <Text className="text-background-850 font-bold">{loadingLabel}</Text>
                            )}
                        </View>
                    )}
                </View>
            ) : (
                <View className="flex-row items-center justify-center gap-2">
                    {icon && icon}
                    {label && (
                        <Text className="font-bold text-background-950 text-xl tracking-wide">
                            {label}
                        </Text>
                    )}
                </View>
            )} */}
        </AppButton>
    );
};

export default Success;

// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import LottieView from 'lottie-react-native';
// import PressableOpacity from '@/src/ui/PressableOpacity';
// import Loading from '@/src/ui/Loading';
// import { colors } from '@/colors';

// interface SuccessProps {
//   isLoading: boolean;
//   isSuccess: boolean;
//   onPress: () => void;
//   onDone?: () => void;
//   // אופציונליים - מאפשרים את ה"גם וגם"
//   label?: string;           // לטקסט (כמו "צור אימון")
//   loadingLabel?: string;    // טקסט בזמן טעינה (כמו "שומר...")
//   icon?: React.ReactNode;   // לאייקון (כמו Check)
//   // עיצוב
//   color?: string;
//   size?: number;            // גודל האנימציה
//   className?: string;       // מאפשר להעביר p-4 או p-1 מבחוץ
// }

// const Success = ({
//   isLoading,
//   isSuccess,
//   onPress,
//   onDone,
//   label,
//   loadingLabel,
//   icon,
//   color = 'lime-500',
//   size = 50,
//   className = ""
// }: SuccessProps) => {
//   const [showSuccess, setShowSuccess] = useState(false);

//   useEffect(() => {
//     if (isSuccess) setShowSuccess(true);
//   }, [isSuccess]);

//   const handleAnimationFinish = () => {
//     setShowSuccess(false);
//     onDone?.();
//   };

//   return (
//     <PressableOpacity
//       onPress={onPress}
//       bgColor={showSuccess ? 'transparent' : color}
//       disabled={isLoading || showSuccess}
//       // שילוב של העיצוב הבסיסי עם מה שנשלח מבחוץ
//       className={`rounded-2xl items-center justify-center flex-row ${className}`}
//     >
//       {isLoading ? (
//         <View className="flex-row items-center justify-center gap-3">
//           <Loading size="small" color={colors.background[950]} />
//           {loadingLabel && (
//             <Text className="text-background-950 font-bold text-lg">{loadingLabel}</Text>
//           )}
//         </View>
//       ) : showSuccess ? (
//         <LottieView
//           source={require('@/assets/animations/Success.lottie')}
//           autoPlay
//           loop={false}
//           onAnimationFinish={handleAnimationFinish}
//           style={{ width: size, height: size }}
//           colorFilters={[{ keypath: "**", color: colors.background[950] }]}
//         />
//       ) : (
//         <View className="flex-row items-center justify-center gap-2">
//           {icon && icon}
//           {label && (
//             <Text className="font-bold text-background-950 text-xl tracking-wide">
//               {label}
//             </Text>
//           )}
//         </View>
//       )}
//     </PressableOpacity>
//   );
// };

// export default Success;