import i18n from 'i18next';
import 'intl-pluralrules';
import { getLocales } from 'expo-localization';
import { initReactI18next } from 'react-i18next';


export const deviceLanguage = getLocales()[0]?.languageCode;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      nl: require('./translations/nl.json'),
      en: require('./translations/en.json'),
    },
    lng: deviceLanguage,
    fallbackLng: 'en',
    keySparator: '.',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  })
