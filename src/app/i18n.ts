import { createI18n } from 'vue-i18n';
import en from '@/app/locales/en.json';
import ar from '@/app/locales/ar.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ar,
  },
});
