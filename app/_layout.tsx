import '../global.css'; // כאן אנחנו "מחברים את החשמל" (Tailwind)
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // הרכיב Stack אומר: "כאן אני אציג את הדפים של האפליקציה"
    // הוא לא מציג שום דבר ויזואלי בעצמו, הוא רק מנהל את התצוגה.
    <Stack screenOptions={{ headerShown: false }} />
  );
}
