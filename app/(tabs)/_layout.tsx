import { colors } from '@/colors';
import { IconFoodsTab, IconHome, IconsFitnessTools, IconUser } from '@/src/ui/IconsSVG';
import TabButton from '@/src/ui/TabButton';
import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const nutritionIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconFoodsTab size={24} color={focused ? 'black' : colors.background[100]} />
    ),
    []
  );
  const nutritionButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/nutrition" label="תזונה" />,
    []
  );

  const workoutsIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconsFitnessTools size={24} color={focused ? 'black' : colors.background[100]} />
    ),
    []
  );
  const workoutsButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/workouts" label="אימונים" />,
    []
  );

  const homeIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconHome size={24} color={focused ? 'black' : colors.background[100]} />
    ),
    []
  );
  const homeButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/index" label="בית" />,
    []
  );

  const profileIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconUser size={24} color={focused ? 'black' : colors.background[100]} />
    ),
    []
  );
  const profileButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/profile" label="פרופיל" />,
    []
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        sceneStyle: {
          backgroundColor: colors.background[1200],
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background[900], // רקע כהה שמתאים לאפליקציה שלך
          borderTopWidth: 0,
          elevation: 0,
          height: insets.bottom > 0 ? 60 + insets.bottom : 70,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

          position: 'absolute', // הופך את הטאב-בר לשכבה צפה שלא נדחפת
          bottom: 0, // מצמיד לתחתית
          left: 0,
          right: 0,
          zIndex: 1000, // מבטיח שהוא תמיד מעל התוכן
          overflow: 'visible',
        },
        tabBarActiveTintColor: colors.lime[500], // הצבע הליים שלך כשטאב פעיל
        tabBarInactiveTintColor: colors.background[100], // אפור כשלא פעיל
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'פרופיל',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: profileIcon,
          tabBarButton: profileButton,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'בית',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: homeIcon,
          tabBarButton: homeButton,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'אימונים',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: workoutsIcon,
          tabBarButton: workoutsButton,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'תזונה',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: nutritionIcon,
          tabBarButton: nutritionButton,
        }}
      />
    </Tabs>
  );
}
