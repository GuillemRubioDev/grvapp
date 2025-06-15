import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from './ml/en/translation.json';
import translationES from './ml/es/translation.json';

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: translationES },
      en: { translation: translationEN }
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    returnObjects: true,
    parseMissingKeyHandler: (key) => `¡¡¿¿${key}??!!`
  });

export default i18n;
