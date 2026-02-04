import LoginScreen from "@/src/Features/auth/LoginScreen";
import { useLocalSearchParams } from "expo-router";

export default function Login() {
  const { params } = useLocalSearchParams();
  return <LoginScreen />;
}