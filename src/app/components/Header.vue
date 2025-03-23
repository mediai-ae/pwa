<template>
  <header
    class="p-4 flex justify-between items-center shadow transition bg-white text-black dark:bg-secondary-dark dark:text-white"
  >
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

      <button @click="$emit('open-modal', 'upload')" class="btn">Upload</button>
      <button @click="$emit('open-modal', 'search')" class="btn">Search</button>
      <button @click="$emit('toggle-dropdown')" class="btn">Menu</button>
      <button @click="$emit('toggle-dark')" class="btn">🌓</button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ locale: string }>();
const emit = defineEmits(['toggle-dark', 'open-modal', 'toggle-dropdown', 'change-locale']);

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
