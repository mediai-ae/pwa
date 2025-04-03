<template>
  <div :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'" :class="{ dark: isDark }">
    <div class="min-h-screen font-tahoma transition-colors duration-500 bg-white text-black dark:bg-primary-dark dark:text-white">
      <!-- Header -->
      <Header
          :locale="locale"
          @change-locale="changeLocale"
          @toggle-dark="toggleDark"
      />

      <!-- Tabs -->
      <div class="tabs flex text-center shadow transition text-black bg-gray-100 dark:text-white dark:bg-secondary-dark">
        <router-link class="tab flex-1 py-3" :to="{ name: 'texts' }" active-class="active">Texts</router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'images' }" active-class="active">Images</router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'audios' }" active-class="active">Audios</router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'videos' }" active-class="active">Videos</router-link>
      </div>

      <main class="p-4 transition-all duration-300">
        <router-view />
      </main>

      <!-- Modals -->
      <Modals :active-modal="activeModal" :modal-data="modalData" @close="closeModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/app/components/Header.vue';
import Modals from '@/app/components/Modals.vue';

const { locale } = useI18n();
const isDark = ref(true);

// Modal state
const activeModal = ref('');
const modalData = ref<any>(null);

// Provide openModal
function openModal(type: string, data: any = null) {
  activeModal.value = type;
  modalData.value = data;
}
function closeModal() {
  activeModal.value = '';
  modalData.value = null;
}

provide('openModal', openModal);

// Dark mode
function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
}

// Language
function changeLocale(lang: string) {
  locale.value = lang;
}
</script>

<style scoped>
.tab {
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}
.tab.active {
  background-color: #e5e7eb;
  border-bottom-color: #6b78a7;
  font-weight: bold;
}
.dark .tab.active {
  background-color: #394263;
}
</style>
