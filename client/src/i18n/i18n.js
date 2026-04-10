import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Import translation files
import enCommon from './locales/en/common.json';
import mrCommon from './locales/mr/common.json';
import hiCommon from './locales/hi/common.json';

const resources = {
  en: {
    translation: enCommon
  },
  mr: {
    translation: mrCommon
  },
  hi: {
    translation: hiCommon
  }
};

i18n
  // Load translation using http backend
  .use(HttpBackend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    ns: ['translation'],
    react: {
      useSuspense: false // Set to false to avoid suspense issues
    }
  });

export default i18n;
