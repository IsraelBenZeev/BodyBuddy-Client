# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# RTL / I18n - critical for Hebrew layout on release builds
-keep class com.facebook.react.modules.i18nmanager.** { *; }
-keep class expo.modules.localization.** { *; }
-keep class com.ibz1330.bodybuddy.MainActivity {
    protected void attachBaseContext(android.content.Context);
}
-keep class com.ibz1330.bodybuddy.MainApplication {
    public void onConfigurationChanged(android.content.res.Configuration);
}

# Add any project specific keep options here:
