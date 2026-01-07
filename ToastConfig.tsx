import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Text, TouchableOpacity, View } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');
const ProgressBar = ({ duration }: { duration: number }) => {
  const widthAnim = useRef(new Animated.Value(100)).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={{ height: 3, width: '100%', backgroundColor: '#1e293b', position: 'absolute', bottom: 0, left: 0 }}>
      <Animated.View
        style={{
          height: '100%',
          width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          backgroundColor: colors.lime[500],
        }}
      />
    </View>
  );
};

export const ToastConfig = {
  info: ({ text1, onPress, props, onPressCancel, onPressDelete }: any) => {
    const { mode, icon, timeProgress, iconCancel, iconDelete } = props || { mode: 'default', icon: null, timeProgress: 5000 };
    console.log("mode config: ", mode);
    if (mode === "delete") {
      return (
        <View
          className="bg-background-600 rounded-2xl shadow-2xl overflow-hidden border border-lime-500"
          style={{ elevation: 15, marginTop: 10, width: width * 0.9, backgroundColor: colors.background[1000] }} // מוריד אותו קצת מהקצה
        >
          <View className="p-4 flex-row justify-between items-center" >
            <View className="flex-1 items-end pr-2">
              <Text className="text-white font-bold text-base">{text1}</Text>
            </View>
            <TouchableOpacity onPress={onPressDelete} className="bg-lime-500/20 px-4 py-2 rounded-full  bd">
              {iconDelete}
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCancel} className="bg-red-500/20 px-4 py-2 rounded-full  bd">
              {iconCancel}
            </TouchableOpacity>
          </View>
          <ProgressBar key={`delete-${text1}`} duration={timeProgress} />
        </View>
      )
    }
    if (mode === "cancel") {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          className="items-end justify-end  bg-background-600 rounded-2xl shadow-2xl overflow-hidden border border-lime-500 p-5 "
          style={{ elevation: 15, width: width * 0.9, backgroundColor: colors.background[1000], justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <View className="flex-row-reverse items-center w-full">
            {icon}
            <Text className="text-white font-bold text-base " style={{ marginHorizontal: 10 }}>{text1}</Text>
          </View>
          <ProgressBar key={`cancel-${text1}`} duration={timeProgress} />
        </TouchableOpacity>
      )
    }
  },


};
export default ToastConfig
