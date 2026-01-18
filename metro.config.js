// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// הוספת התמיכה בקבצי lottie
config.resolver.assetExts.push('lottie');

module.exports = withNativeWind(config, { input: "./global.css" });