import { Hammer } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Instractions from './Instractions';
import { colors } from '@/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
interface TabsManagerProps {
    instructions: string[];
}
const TabsManager = ({ instructions }: TabsManagerProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabTranslateX = useRef(new Animated.Value(0)).current;

    // פונקציית אנימציה יציבה
    const animateTo = (index: number) => {
        setActiveTab(index);
        Animated.spring(tabTranslateX, {
            toValue: index,
            useNativeDriver: true,
            bounciness: 4,
            speed: 12,
        }).start();
    };

    // טיפול במחוות החלקה (Swipe)
    const onGestureEvent = (event: any) => {
        const { translationX, state } = event.nativeEvent;

        if (state === State.END) {
            if (translationX < -50 && activeTab === 0) {
                // החלקה שמאלה -> מעבר להיסטוריה
                animateTo(1);
            } else if (translationX > 50 && activeTab === 1) {
                // החלקה ימינה -> חזרה להוראות
                animateTo(0);
            }
        }
    };

    const containerWidth = SCREEN_WIDTH - 48;
    const capsuleWidth = (containerWidth - 8) / 2;

    return (
        <View className="w-full">
            {/* נעטוף רק את אזור התוכן במזהה המחוות כדי לא להפריע ללחיצות ב-TabBar */}
            <PanGestureHandler
                onHandlerStateChange={onGestureEvent}
                activeOffsetX={[-20, 20]} // מונע מהחלקה קטנה למעלה/למטה להפעיל את זה
            >
                <View>
                    {/* Tab Bar */}
                    <View className="mx-6 mt-4 mb-2 bg-[#1A1A1A] rounded-full p-1 relative flex-row items-center h-12 border border-gray-800">
                        <Animated.View
                            style={{
                                width: capsuleWidth,
                                transform: [
                                    {
                                        translateX: tabTranslateX.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, capsuleWidth + 4],
                                        }),
                                    },
                                ],
                            }}
                            className="absolute h-10 bg-[#D7FF00] rounded-full left-1"
                        />

                        <TouchableOpacity
                            onPress={() => animateTo(0)}
                            className="flex-1 items-center justify-center z-10"
                        >
                            <Text className={`font-bold ${activeTab === 0 ? 'text-black' : 'text-gray-500'}`}>הוראות</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => animateTo(1)}
                            className="flex-1 items-center justify-center z-10"
                        >
                            <Text className={`font-bold ${activeTab === 1 ? 'text-black' : 'text-gray-500'}`}>היסטוריה</Text>
                        </TouchableOpacity>
                    </View>

                    {/* תוכן - משתנה דינמית */}
                    <View className="min-h-[200px]">
                        {activeTab === 0 ? (
                            <View className="p-6">
                                <Instractions instructions={instructions} />
                            </View>
                        ) : (
                            <View className="p-6">
                                <View className="flex-row-reverse items-center gap-4 mb-4">
                                    <Hammer size={24} color={colors.lime[500]} />
                                    <Text className="text-[#D7FF00] text-xl font-bold text-right">בהקמה</Text>
                                </View>
                                <Text className="text-white text-right text-lg leading-7">ההיסטוריה יופיע כאן...</Text>
                            </View>
                        )}
                    </View>
                </View>
            </PanGestureHandler>
        </View>
    );
};

export default TabsManager;