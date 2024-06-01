import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { NativeModules, I18nManager, Platform } from 'react-native';

export const deviceLanguage = Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale // iOS
  : NativeModules.I18nManager.localeIdentifier; // Android

// I18n.fallbacks = true;
// I18n.escapeValue = false;
// I18n.defaultSeparator = ".";
// I18n.locale = deviceLanguage;

// I18n.translations = {
//   en: require('./translations/en.json'),
//   nl: require('./translations/nl.json')
// };

i18n
  .use(initReactI18next)
  .init({
    en: require('./translations/en.json'),
    nl: require('./translations/nl.json'),
    lng: deviceLanguage,
    keySparator: '.',
    interpolation: {
      escapeValue: false,
    }
  })

I18nManager.localeIdentifier = deviceLanguage;
