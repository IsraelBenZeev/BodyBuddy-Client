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
      <IconFoodsTab size={24} color={focused ? colors.lime[300] : colors.background[400]} />
    ),
    []
  );
  const nutritionButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/nutrition" label="תזונה" />,
    []
  );

  const workoutsIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconsFitnessTools size={24} color={focused ? colors.lime[300] : colors.background[400]} />
    ),
    []
  );
  const workoutsButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/workouts" label="אימונים" />,
    []
  );

  const homeIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconHome size={24} color={focused ? colors.lime[300] : colors.background[400]} />
    ),
    []
  );
  const homeButton = useCallback(
    (props: any) => <TabButton {...props} routeName="/index" label="בית" />,
    []
  );

  const profileIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <IconUser size={24} color={focused ? colors.lime[300] : colors.background[400]} />
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
        animation: 'fade',
        sceneStyle: {
          backgroundColor: colors.background[1200],
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background[900],
          borderTopWidth: 0,
          elevation: 16,
          height: 74,
          paddingBottom: 0,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.07)',
          position: 'absolute',
          bottom: 0,
          marginHorizontal: 16,
          zIndex: 1000,
          overflow: 'visible',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.45,
          shadowRadius: 20,
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
          lazy: false,
          title: 'בית',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: homeIcon,
          tabBarButton: homeButton,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          lazy: false,
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
