import i18n from "i18next";
import { initReactI18next } from "react-i18next";
 
// Import your language JSON files
import en from "./i18n/en.json";
import te from "./i18n/te.json";
import hi from "./i18n/hi.json";
import kn from "./i18n/kn.json";
import ta from "./i18n/ta.json";
import ml from "./i18n/ml.json";
 
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      hi: { translation: hi },
      kn: { translation: kn },
      ta: { translation: ta },
      ml: { translation: ml },
    },
    lng: "en",           // default language
    fallbackLng: "en",   // fallback language if translation missing
    interpolation: { escapeValue: false },
  });
 
export default i18n;