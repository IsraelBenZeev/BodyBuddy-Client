const { withAndroidManifest, withMainApplication } = require('@expo/config-plugins');

function withRTLManifest(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$['android:supportsRtl'] = 'true';
    return config;
  });
}

// Places I18nUtil calls after super.onCreate() but before loadReactNative() —
// conventional Android order AND before React Native reads the RTL preference.
function withRTLMainApplication(config) {
  return withMainApplication(config, (config) => {
    let { contents } = config.modResults;

    if (!contents.includes('com.facebook.react.modules.i18nmanager.I18nUtil')) {
      const importAnchor = 'import com.facebook.react.ReactApplication';
      if (!contents.includes(importAnchor)) {
        throw new Error(
          '[withAndroidRTL] Could not find import anchor in MainApplication.kt. ' +
          'Check that "import com.facebook.react.ReactApplication" exists.'
        );
      }
      contents = contents.replace(
        importAnchor,
        `${importAnchor}\nimport com.facebook.react.modules.i18nmanager.I18nUtil`
      );
    }

    if (!contents.includes('I18nUtil.getInstance()')) {
      // Insert AFTER super.onCreate() so Android lifecycle is correct,
      // but still BEFORE loadReactNative() so RN reads the RTL preference.
      const superAnchor = 'super.onCreate()';
      if (!contents.includes(superAnchor)) {
        throw new Error(
          '[withAndroidRTL] Could not find "super.onCreate()" in MainApplication.kt. ' +
          'RTL initialization was NOT applied — check the generated file manually.'
        );
      }
      contents = contents.replace(
        superAnchor,
        `${superAnchor}\n    android.util.Log.d("RTL_DEBUG", "RTL INIT STARTED")\n    I18nUtil.getInstance().allowRTL(this, true)\n    I18nUtil.getInstance().forceRTL(this, true)`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = function withAndroidRTL(config) {
  config = withRTLManifest(config);
  config = withRTLMainApplication(config);
  return config;
};
