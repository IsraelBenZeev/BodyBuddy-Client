import { colors } from '@/colors';
import { IconFoodsTab, IconHome, IconsFitnessTools, IconUser } from '@/src/ui/IconsSVG';
import TabButton from '@/src/ui/TabButton';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // מבטל את הכותרת העליונה המובנית
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background[900], // רקע כהה שמתאים לאפליקציה שלך
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,

          position: 'absolute', // הופך את הטאב-בר לשכבה צפה שלא נדחפת
          bottom: 0,            // מצמיד לתחתית
          left: 0,
          right: 0,
          zIndex: 1000,         // מבטיח שהוא תמיד מעל התוכן
          overflow: 'visible',


        },
        tabBarActiveTintColor: colors.lime[500], // הצבע הליים שלך כשטאב פעיל
        tabBarInactiveTintColor: colors.background[100], // אפור כשלא פעיל
      }}
    >
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'תזונה',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: ({ focused }) => (
            <IconFoodsTab size={24} color={focused ? 'black' : colors.background[100]} />
          ),
          tabBarButton: (props) => <TabButton {...props} routeName="/nutrition" label="תזונה" />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'אימונים',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: ({ focused }) => (
            <IconsFitnessTools size={24} color={focused ? 'black' : colors.background[100]} />
          ),
          tabBarButton: (props) => <TabButton {...props} routeName="/workouts" label="אימונים" />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'בית',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: ({ focused }) => <IconHome size={24} color={focused ? 'black' : colors.background[100]} />,
          tabBarButton: (props) => <TabButton {...props} routeName="/index" label="בית" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'פרופיל',
          tabBarLabelStyle: { color: colors.background[900] },
          tabBarIcon: ({ focused }) => <IconUser size={24} color={focused ? 'black' : colors.background[100]} />,
          tabBarButton: (props) => <TabButton {...props} routeName="/profile" label="פרופיל" />,
        }}
      />
    </Tabs>
  );
}
