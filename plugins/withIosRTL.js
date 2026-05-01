const { withAppDelegate } = require('@expo/config-plugins');

function withIosRTLAppDelegate(config) {
  return withAppDelegate(config, (config) => {
    let { contents } = config.modResults;

    if (contents.includes('RCTI18n_ForceRTL')) {
      return config;
    }

    // React Native iOS reads RTL preference from NSUserDefaults using these exact keys.
    // Setting them here (before moduleName/bridge init) ensures isRTL=true from first launch,
    // identical to what withAndroidRTL does on Android via I18nUtil.
    const rtlCode = [
      '    UserDefaults.standard.set(true, forKey: "RCTI18n_AllowRTL")',
      '    UserDefaults.standard.set(true, forKey: "RCTI18n_ForceRTL")',
      '',
    ].join('\n');

    const anchor = 'self.moduleName = "main"';
    if (!contents.includes(anchor)) {
      throw new Error(
        '[withIosRTL] Could not find anchor \'self.moduleName = "main"\' in AppDelegate.swift. ' +
        'RTL initialization was NOT applied.'
      );
    }

    contents = contents.replace(anchor, rtlCode + anchor);
    config.modResults.contents = contents;
    return config;
  });
}

module.exports = function withIosRTL(config) {
  return withIosRTLAppDelegate(config);
};
