import { useLocalSearchParams } from 'expo-router';
import SessionManager from '@/src/Features/workoutsPlans/session/SessionManager';

export default function Page() {
    const { paramse } = useLocalSearchParams(); // מקבל את הפרמטר מהכתובת

      return <SessionManager id={paramse} />;
}
