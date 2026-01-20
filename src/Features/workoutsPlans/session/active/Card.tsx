import { Exercise } from '@/src/types/exercise';
import { Image } from 'expo-image';
import { Control } from 'react-hook-form';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Failds from './Failds';

interface CardProps {
    item: Exercise;
    isActive: boolean;
    activeId: string;
    control: Control<any>;
}

// const Card = ({ item, isActive, activeId, control }: CardProps) => {
//     const { width, height } = useWindowDimensions();

//     return (
//         <View className="bg-background-900 p-2">
//             <View className="justify-center items-end w-full">
//                 <Text className="text-lime-500 font-bold text-xs uppercase tracking-widest mb-2">
//                     {item.bodyParts_he}
//                 </Text>
//                 <Text className="text-white text-3xl font-black mb-6 italic text-right">
//                     {item.name_he}
//                 </Text>
//             </View>
//             <ScrollView
//                 className=""
//                 contentContainerStyle={{ paddingBottom: 20 }}
//                 nestedScrollEnabled={true}
//                 showsVerticalScrollIndicator={true}
//             >
//                 <View className="items-center bg-background-850 border border-white/10 rounded-2xl px-4 py-2 gap-3">
//                     <View className="bg-white items-center justify-center rounded-2xl overflow-hidden w-full">
//                         <Image
//                             source={{ uri: item.gifUrl }}
//                             style={{ width: 200, height: 200 }}
//                             contentFit="cover"
//                         />
//                     </View>

//                     <Failds control={control} item={item} />
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };
const Card = ({ item, isActive, activeId, control }: CardProps) => {
    const { width, height } = useWindowDimensions();

    return (
        <View className="bg-background-900 p-2">
            <View className="justify-center items-end w-full">
                <Text className="text-lime-500 font-bold text-xs uppercase tracking-widest mb-2">{item.bodyParts_he}</Text>
                <Text className="text-white text-3xl font-black mb-6 italic text-right">{item.name_he}</Text>
            </View>
            
            <ScrollView
                className=""
                contentContainerStyle={{ paddingBottom: 20 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
            >
                <View className="items-center bg-background-850 border border-white/10 rounded-2xl px-4 py-2 gap-3">
                    <View className="bg-white items-center justify-center rounded-2xl overflow-hidden w-full">
                        <Image
                            source={{ uri: item.gifUrl }}
                            style={{ width: 200, height: 200 }}
                            contentFit="cover"
                        />
                    </View>
                    <View className="w-full bd">

                        <Failds control={control} item={item} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Card;
