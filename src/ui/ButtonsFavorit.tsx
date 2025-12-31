import Entypo from '@expo/vector-icons/Entypo';
import { Text, View } from 'react-native';
export const ButtonRemoveFavorit = () => {
  return (
    <View>
      <Entypo name="star" size={24} color="white" className="" />
    </View>
  );
};
export const ButtonAddFavorit = () => {
  return (
    <View>
      <Text>
        <Entypo name="star-outlined" size={24} color="white" className="" />
      </Text>
    </View>
  );
};
