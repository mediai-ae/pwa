<template>
  <header class="p-4 shadow bg-white text-black dark:bg-secondary-dark dark:text-white">
    <div class="flex justify-between items-center flex-wrap gap-4">
      <!-- Title -->
      <h1 class="text-2xl font-semibold">{{ t('header.dashboard') }}</h1>

      <!-- Right Controls -->
      <div class="flex flex-wrap items-center gap-3">
        <button @click="() => openModal?.('upload')" class="action-btn">
          ⬆️ {{ t('buttons.upload') }}
        </button>
        <button class="action-btn">
          📈 {{ t('buttons.search') }}
        </button>

        <select
            class="action-btn bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 appearance-none pr-8"
            :value="locale"
            @change="onLocaleChange"
        >
          <option value="en">🇬🇧 English</option>
          <option value="ar">🇸🇦 العربية</option>
        </select>

        <button @click="$emit('toggle-dark')" class="action-btn" :title="t('header.toggleTheme')">
          🌓
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{ locale: string }>();
const emit = defineEmits(['toggle-dark', 'change-locale']);
const { t } = useI18n();

const openModal = inject<(type: string, data?: any) => void>('openModal');

function onLocaleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('change-locale', target.value);
}
</script>

<style scoped>
.action-btn {
  @apply text-sm px-4 py-2 rounded-md font-medium transition-all;
  @apply bg-gray-200 text-black hover:bg-gray-300;
  @apply dark:bg-accent-soft dark:text-white dark:hover:bg-accent;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent;
}
</style>
