<template>
  <header class="p-4 flex justify-between items-center shadow transition bg-white text-black dark:bg-secondary-dark dark:text-white">
    <h1 class="text-xl font-bold">Dashboard</h1>
    <div class="flex items-center gap-2">
      <select
          class="bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded px-2 py-1"
          :value="locale"
          @change="onLocaleChange"
      >
        <option value="en">🇬🇧 English</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>

      <button @click="() => openModal?.('upload')" class="btn">Upload</button>
      <button @click="() => openModal?.('content', { id: 123 })" class="btn">Analyze</button>
      <button @click="$emit('toggle-dark')" class="btn">🌓</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue';

defineProps<{ locale: string }>();
const emit = defineEmits(['toggle-dark', 'change-locale']);

const openModal = inject<(type: string, data?: any) => void>('openModal');

function onLocaleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('change-locale', target.value);
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded transition;
  @apply bg-gray-200 text-black hover:bg-gray-300;
  @apply dark:bg-accent-soft dark:text-white dark:hover:bg-accent;
}
</style>
