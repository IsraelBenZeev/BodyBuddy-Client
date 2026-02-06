import { signOut } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import BackGround from '@/src/ui/BackGround';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('user', user);
    console.log('session', session);
  }, [user, session]);
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await signOut();
    setLoading(false);

    if (error) {
      triggerSuccess('שגיאה בהתנתקות', 'failed');
    } else {
      triggerSuccess('התנתקת בהצלחה', 'success');
    }
  };

  if (!user) {
    return (
      <BackGround>
        <NotSignedInMessage />
      </BackGround>
    );
  }

  return (
    <BackGround>
      <ScrollView className="flex-1 px-5 py-8">
        <Text className="text-lime-400 text-3xl font-black mb-8 text-right">הפרופיל שלי</Text>
        <View className="flex-row justify-end items-center mb-5">
          <View className="mr-4  justify-center items-end">
            <Text className="text-white text-2xl font-bold">{user.user_metadata.full_name}</Text>
            <Text className="text-background-400 text-sm">{user.email}</Text>
          </View>
          <Image
            source={user.user_metadata.avatar_url}
            style={{ width: 60, height: 60, borderRadius: 50 }}
          />
        </View>
        {user.created_at && (
          <ProfileItem
            title="תאריך הצטרפות"
            value={new Date(user.created_at).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        )}
        {/* @ts-ignore */}
        <ProfileItem title="גיל" value={user.age ?? '--'} />
        {/* @ts-ignore */}
        <ProfileItem title="מין" value={user.age ?? '--'} />
        {/* @ts-ignore */}
        <ProfileItem title="גובה" value={user.age ?? '--'} />
        {/* @ts-ignore */}
        <ProfileItem title="משקל" value={user.age ?? '--'} />
        {/* @ts-ignore */}
        <ProfileItem title="פעילות" value={user.age ?? '--'} />
        {/* Logout Button */}
        <ButtonPrimary
          title={loading ? 'מתנתק...' : 'התנתק'}
          onPress={handleLogout}
          classNameButton="mt-auto"
        />
      </ScrollView>
    </BackGround>
  );
}

const ProfileItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
      <Text className="text-background-400 text-sm mb-2 text-right font-semibold">{title}</Text>
      <Text className="text-white text-base text-right">{value}</Text>
    </View>
  );
};
