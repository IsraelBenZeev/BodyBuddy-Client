import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

export default function ScanAnimation() {
    return (
        <View className="items-center py-4">
            <LottieView
                source={require('@/assets/animations/Circle.lottie')}
                autoPlay
                loop={true}
                style={{ width: 220, height: 220 }}
                colorFilters={[
                    {
                        keypath: '**',
                        color: '#84cc16',
                    },
                ]}
            />
            <Text className="text-white font-black text-lg -mt-2">מנתח את הארוחה...</Text>
            <Text className="text-gray-500 text-sm mt-1">ה-AI עובד על זה, רגע</Text>
        </View>
    );
}
