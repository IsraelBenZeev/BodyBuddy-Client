const { withAppBuildGradle } = require('@expo/config-plugins');

// Gives debug builds (local `expo run:android`, dev client) a distinct
// applicationId/app name so they can be installed alongside the Play Store
// release build on the same device. Release builds (the AAB uploaded to
// the store) are untouched.
module.exports = function withDevApplicationId(config) {
  return withAppBuildGradle(config, (config) => {
    let { contents } = config.modResults;

    if (!contents.includes('applicationIdSuffix ".dev"')) {
      contents = contents.replace(
        /(debug\s*\{\s*\n)(\s*)(signingConfig signingConfigs\.debug)/,
        `$1$2applicationIdSuffix ".dev"\n$2resValue "string", "app_name", "BodyBuddy Dev"\n$2$3`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};
