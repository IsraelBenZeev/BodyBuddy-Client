import Reactotron from "reactotron-react-native";

Reactotron.configure({ name: "My Fitness App" })
  .useReactNative({
    asyncStorage: false, // אפשר להפעיל אם תרצה
    networking: {
      ignoreUrls: /symbolicate/ // מתעלם מהלוגים המערכתיים של Metro
    }
  })
  .connect();

export default Reactotron;