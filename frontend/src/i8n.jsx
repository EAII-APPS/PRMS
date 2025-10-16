import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HTTPApi from "i18next-http-backend";

export const changeLanguage = (language) => {
  i18next.changeLanguage(language);
};
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HTTPApi)
  .init({
    // lng: "oro",
    fallbackLang: "am",
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ["en", "am", "oro"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", 
    },
  });

export default i18next;
