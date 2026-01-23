import AppButton from '@/src/ui/PressableOpacity';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

// 1. הגדרת מבנה של טאב בודד
interface TabItem {
    title: string;
    Component: React.ReactNode;
}

// 2. עדכון ה-Props - הסרנו את instructions והוספנו את tabs
interface TabsManagerProps {
    tabs: TabItem[];      // מערך של טאבים
    initialTab?: number;  // אופציונלי, ברירת מחדל 0
}
// const TabsManager = ({ instructions }: TabsManagerProps) => {
    //     const [activeTab, setActiveTab] = useState(0);
    //     const tabTranslateX = useRef(new Animated.Value(0)).current;
    
    //     // פונקציית אנימציה יציבה
    //     const animateTo = (index: number) => {
        //         setActiveTab(index);
        //         Animated.spring(tabTranslateX, {
            //             toValue: index,
            //             useNativeDriver: true,
            //             bounciness: 4,
            //             speed: 12,
            //         }).start();
            //     };
            
            //     // טיפול במחוות החלקה (Swipe)
            //     const onGestureEvent = (event: any) => {
                //         const { translationX, state } = event.nativeEvent;
                
                //         if (state === State.END) {
                    //             if (translationX < -50 && activeTab === 0) {
                        //                 // החלקה שמאלה -> מעבר להיסטוריה
                        //                 animateTo(1);
                        //             } else if (translationX > 50 && activeTab === 1) {
                            //                 // החלקה ימינה -> חזרה להוראות
                            //                 animateTo(0);
                            //             }
                            //         }
                            //     };
                            
                            //     const containerWidth = SCREEN_WIDTH - 48;
                            //     const capsuleWidth = (containerWidth - 8) / 2;
                            
                            //     return (
                                //         <View className="w-full">
                                //             {/* נעטוף רק את אזור התוכן במזהה המחוות כדי לא להפריע ללחיצות ב-TabBar */}
                                //             <PanGestureHandler
//                 onHandlerStateChange={onGestureEvent}
//                 activeOffsetX={[-20, 20]} // מונע מהחלקה קטנה למעלה/למטה להפעיל את זה
//             >
//                 <View>
//                     {/* Tab Bar */}
//                     <View className="mx-6 mt-4 mb-2 bg-background-850 rounded-full p-1 relative flex-row items-center h-12 border border-gray-800">
//                         <Animated.View
//                             style={{
    //                                 width: capsuleWidth,
    //                                 transform: [
        //                                     {
            //                                         translateX: tabTranslateX.interpolate({
                //                                             inputRange: [0, 1],
                //                                             outputRange: [0, capsuleWidth + 4],
                //                                         }),
                //                                     },
                //                                 ],
                //                             }}
//                             className="absolute h-10 bg-lime-500 rounded-full left-1"
//                         />

//                         <AppButton
//                             animationType='opacity'
//                             haptic='medium'
//                             onPress={() => animateTo(0)}
//                             className="flex-1 items-center justify-center z-10"
//                         >
//                             <Text className={`font-bold ${activeTab === 0 ? 'text-background-950' : 'text-gray-500'}`}>הוראות</Text>
//                         </AppButton>

//                         <AppButton
//                             animationType='opacity'
//                             haptic='medium'
//                             onPress={() => animateTo(1)}
//                             className="flex-1 items-center justify-center z-10"
//                         >
//                             <Text className={`font-bold ${activeTab === 1 ? 'text-background-950' : 'text-gray-500'}`}>היסטוריה</Text>
//                         </AppButton>
//                     </View>

//                     {/* תוכן - משתנה דינמית */}
//                     <View className="min-h-[200px]">
//                         {activeTab === 0 ? (
    //                             <View className="p-6">
    //                                 <Instractions instructions={instructions} />
    //                             </View>
    //                         ) : (
        //                             <View className="p-6">
        //                                 <View className="flex-row-reverse items-center gap-4 mb-4">
        //                                     <Hammer size={24} color={colors.lime[500]} />
        //                                     <Text className="text-lime-500 text-xl font-bold text-right">בהקמה</Text>
        //                                 </View>
        //                                 <Text className="text-white text-right text-lg leading-7">ההיסטוריה יופיע כאן...</Text>
        //                             </View>
        //                         )}
        //                     </View>
        //                 </View>
//             </PanGestureHandler>
//         </View>
//     );
// };
// 3. עדכון שורת הפונקציה
const TabsManager = ({ tabs, initialTab = 0 }: TabsManagerProps) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const tabTranslateX = useRef(new Animated.Value(initialTab)).current;
    
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const animateTo = (index: number) => {
        setActiveTab(index);
        Animated.spring(tabTranslateX, {
            toValue: index,
            useNativeDriver: true,
            bounciness: 4,
            speed: 12,
        }).start();
    };

    // const onGestureEvent = (event: any) => {
    //     const { translationX, state } = event.nativeEvent;
    //     if (state === State.END) {
    //         // מעבר לטאב הבא (שמאלה)
    //         if (translationX < -50 && activeTab < tabs.length - 1) {
    //             animateTo(activeTab + 1);
    //         }
    //         // חזרה לטאב הקודם (ימינה)
    //         else if (translationX > 50 && activeTab > 0) {
    //             animateTo(activeTab - 0);
    //         }
    //     }
    // };
    const onGestureEvent = (event: any) => {
        const { translationX, state } = event.nativeEvent;

        if (state === State.END) {
            // רגישות ההחלקה - 50 פיקסלים
            const threshold = 50;

            // מקרה 1: החלקה שמאלה (מזיזים את האצבע ימינה לשמאלה) -> עוברים לטאב הבא
            if (translationX < -threshold) {
                if (activeTab < tabs.length - 1) {
                    animateTo(activeTab + 1);
                }
            }
            // מקרה 2: החלקה ימינה (מזיזים את האצבע משמאל לימינה) -> חוזרים לטאב הקודם
            else if (translationX > threshold) {
                if (activeTab > 0) {
                    animateTo(activeTab - 1);
                }
            }
        }
    };

    const containerWidth = SCREEN_WIDTH - 48;
    const capsuleWidth = (containerWidth - 8) / tabs.length; // חישוב רוחב דינמי לפי מספר הטאבים

    return (
        <View className="w-full">
            <View>
                {/* Tab Bar */}
                <View className="mx-6 mt-4 mb-2 bg-background-850 rounded-full p-1 relative flex-row items-center h-12 border border-gray-800">
                    <Animated.View
                        style={{
                            width: capsuleWidth,
                            transform: [{
                                translateX: tabTranslateX.interpolate({
                                    inputRange: tabs.map((_, i) => i),
                                    outputRange: tabs.map((_, i) => i * (capsuleWidth + 4)),
                                }),
                            }],
                        }}
                        className="absolute h-10 bg-lime-500 rounded-full left-1"
                    />

                    {tabs.map((tab, index) => (
                        <AppButton
                            key={tab.title}
                            animationType='opacity'
                            haptic='medium'
                            onPress={() => animateTo(index)}
                            className="flex-1 items-center justify-center z-10"
                        >
                            <Text className={`font-bold ${activeTab === index ? 'text-background-950' : 'text-gray-500'}`}>
                                {tab.title}
                            </Text>
                        </AppButton>
                    ))}
                </View>

                {/* תוכן עם זיהוי מחוות */}
                <PanGestureHandler onHandlerStateChange={onGestureEvent} activeOffsetX={[-20, 20]}>
                    <View className="min-h-[200px] p-6">
                        {tabs[activeTab].Component}
                    </View>
                </PanGestureHandler>
            </View>
        </View>
    );
};
export default TabsManager;