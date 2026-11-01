const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'Thryve Mini (Dev)' : 'Thryve Mini',
    slug: 'thryve-mini',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? 'com.kathleenlister.thryvemini.dev' : 'com.kathleenlister.thryvemini',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#FFF7EE',
        foregroundImage: './assets/android-icon-foreground.png',
      },
      package: IS_DEV ? 'com.kathleenlister.thryvemini.dev' : 'com.kathleenlister.thryvemini',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-status-bar',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#FF6F59',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '1db56093-6bfb-46cb-8266-cda7a5a7c2e2',
      },
    },
  },
};
