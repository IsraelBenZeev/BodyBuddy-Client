import { View } from 'react-native';
import TabsManager from '../exercises/TabsMenager';
import Foods from './Foods';
import Meals from './Meals';

interface Props {
  userId: string;
  date: string;
  onClose: () => void;
}

export default function FoodSelectionModal({ userId, date, onClose }: Props) {
  const tabs = [
    { title: 'ארוחות', Component: <Meals userId={userId} date={date} onClose={onClose} /> },
    {
      title: 'מאכלים',
      Component: <Foods userId={userId} date={date} onClose={onClose} />,
    },
  ];
  return (
    <View className="flex-1">
      <TabsManager initialTab={0} tabs={tabs} />
    </View>
  );
}
