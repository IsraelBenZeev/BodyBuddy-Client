import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import BackGround from '@/src/ui/BackGround';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import { useAuthStore } from '@/src/store/useAuthStore';
import { signOut } from '@/src/service/authService';
import { useUIStore } from '@/src/store/useUIStore';
import Loading from '@/src/ui/Loading';
import { colors } from '@/colors';
import NotSignedInMessage from '@/src/ui/NotSignedInMessage';

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
      triggerSuccess('שגיאה בהתנתקות');
    }
    // Store מתעדכן אוטומטית -> Auth Guard ירדיר לlogin
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
        <Text className="text-lime-400 text-3xl font-black mb-8 text-right">
          הפרופיל שלי
        </Text>

        {/* Email Section */}
        <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
          <Text className="text-background-400 text-sm mb-2 text-right font-semibold">
            אימייל
          </Text>
          <Text className="text-white text-base text-right">
            {user.email}
          </Text>
        </View>

        {/* User ID Section */}
        <View className="bg-background-800 rounded-2xl p-5 mb-4 border border-background-600">
          <Text className="text-background-400 text-sm mb-2 text-right font-semibold">
            מזהה משתמש
          </Text>
          <Text className="text-white text-xs text-right font-mono">
            {user.id}
          </Text>
        </View>

        {/* Created At Section */}
        {user.created_at && (
          <View className="bg-background-800 rounded-2xl p-5 mb-6 border border-background-600">
            <Text className="text-background-400 text-sm mb-2 text-right font-semibold">
              תאריך הצטרפות
            </Text>
            <Text className="text-white text-base text-right">
              {new Date(user.created_at).toLocaleDateString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}

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
