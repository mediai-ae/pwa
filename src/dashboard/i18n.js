import { createI18n } from 'vue-i18n';
import en from '@/dashboard/locales/en.json';
import ar from '@/dashboard/locales/ar.json';
export const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        ar
    }
});
