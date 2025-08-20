import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enComponents from "../i18n/locales/en/components.json"
import enPageProduct from "./locales/en/productPage.json"
import viComponents from "../i18n/locales/vi/components.json";
import viPageProduct from "./locales/vi/productPage.json"
import viCommon from "./locales/vi/components.json"
import enCommon from "./locales/en/components.json"




const resources = {
  vi: {
    translation: {
      ...viComponents,
      ...viPageProduct,
      ...viCommon,
    }
  },
  en: {
    translation: {
      ...enComponents,
      ...enPageProduct,
      ...enCommon,

    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: "en",
  defaultNS: "translation"
});


export default i18n;
