<template>
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-slideUp">
    <div
      class="w-full max-w-lg mx-4 p-6 rounded-xl shadow-lg transition bg-white text-black dark:bg-secondary-dark dark:text-white"
    >
      <h3 class="text-lg font-semibold mb-4">
        {{ type === 'upload' ? $t('buttons.upload') : $t('buttons.search') }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">Modal content for {{ type }}</p>
      <div class="text-center mt-4">
        <button
          @click="$emit('close')"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ type: string }>();
defineEmits(['close']);
</script>
