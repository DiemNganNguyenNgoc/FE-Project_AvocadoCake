import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enComponents from "../../locales/en/components.json";

import viComponents from "../../locales/vi/components.json";


const resources = {
  en: {
    components: enComponents,
  },
  vi: {
    components: viComponents,
  },
};


i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: "en",
  ns: ["components"], 
  defaultNS: "components",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
