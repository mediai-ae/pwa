<template>
  <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" :class="{ dark: isDark }">
    <div
      class="min-h-screen font-tahoma transition-colors duration-500 bg-white text-black dark:bg-primary-dark dark:text-white"
    >
      <!-- Header -->
      <Header :locale="locale" @change-locale="changeLocale" @toggle-dark="toggleDark" />

      <main class="transition-all duration-300">
        <router-view />
      </main>

      <!-- Modals -->
      <Modals :active-modal="activeModal" :modal-data="modalData" @close="closeModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/app/components/Header.vue';
import Modals from '@/app/components/Modals/Modals.vue';

const { locale } = useI18n(); // 👈 add t
const isDark = ref(true);

onMounted(() => {
  const savedLocale = localStorage.getItem('app-locale');
  if (savedLocale) {
    locale.value = savedLocale;
  }

  const savedTheme = localStorage.getItem('app-theme');
  isDark.value = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark.value);
});

// Modal state
const activeModal = ref('');
const modalData = ref<any>(null);

function openModal(type: string, data: any = null) {
  activeModal.value = type;
  modalData.value = data;
}
function closeModal() {
  activeModal.value = '';
  modalData.value = null;
}
provide('openModal', openModal);

function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('app-theme', isDark.value ? 'dark' : 'light');
}

function changeLocale(lang: string) {
  locale.value = lang;
  localStorage.setItem('app-locale', lang);
}
</script>
