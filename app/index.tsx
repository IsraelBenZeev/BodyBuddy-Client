import Exercises from '@/src/Features/exercises/Exercises';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native';
export default function Page() {
  return (
    <SafeAreaView className="bg-primary-100 flex-1 justify-center items-center w-full">
      {/* <StatusBar style="auto" /> */}
      {/* <Text className="">Welcome to BodyBuddy!</Text> */}
      <Exercises />
      {/* <Image
        source={'https://static.exercisedb.dev/media/LMGXZn8.gif'}
        style={{ width: 200, height: 200 }}
        cachePolicy={'disk'}
        priority={'high'}
      />  */}
      {/* <AvatarFront /> */}
      {/* <AvatarBack /> */}
    </SafeAreaView>
  );
}
