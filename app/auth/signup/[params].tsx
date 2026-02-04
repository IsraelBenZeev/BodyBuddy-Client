import RegisterScreen from "@/src/Features/auth/RegisterScreen";
import { useLocalSearchParams } from "expo-router";

export default function Signup() {
  const { params } = useLocalSearchParams();
  return <RegisterScreen />;
}