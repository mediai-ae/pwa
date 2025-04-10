<template>
  <div>
      <div class="tabs flex text-center shadow transition text-black bg-gray-100 dark:text-white dark:bg-secondary-dark">
        <router-link class="tab flex-1 py-3" :to="{ name: 'texts' }" active-class="active">
          {{ t('navigation.texts') }}
        </router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'images' }" active-class="active">
          {{ t('navigation.images') }}
        </router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'audios' }" active-class="active">
          {{ t('navigation.audios') }}
        </router-link>
        <router-link class="tab flex-1 py-3" :to="{ name: 'videos' }" active-class="active">
          {{ t('navigation.videos') }}
        </router-link>
      </div>

      <main class="p-4 transition-all duration-300">
        <router-view />
      </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
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
