<template>
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-slideUp">
    <div
        class="w-full max-w-lg mx-4 p-6 rounded-xl shadow-lg transition bg-white text-black dark:bg-secondary-dark dark:text-white"
    >
      <h3 class="text-lg font-semibold mb-4">
        {{ type === 'upload' ? $t('buttons.upload') : $t('buttons.search') }}
      </h3>

      <div v-if="type === 'upload'" class="space-y-4">
        <!-- Styled File Input -->
        <div>
          <label
              for="fileInput"
              class="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {{ $t('buttons.chooseFile') }}
          </label>
          <input
              id="fileInput"
              type="file"
              class="hidden"
              @change="onFileChange"
          />
          <span v-if="file?.name" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {{ file.name }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div v-if="uploading" class="w-full bg-gray-300 rounded h-3 overflow-hidden">
          <div
              class="bg-green-600 h-full transition-all duration-300"
              :style="{ width: progress + '%' }"
          ></div>
        </div>

        <!-- Upload Result -->
        <p v-if="message" class="text-sm text-green-500 dark:text-green-400">{{ message }}</p>
      </div>

      <!-- Close Button -->
      <div class="text-center mt-6">
        <button
            @click="$emit('close')"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded text-white"
        >
          {{ $t('buttons.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUploadStore } from '@/app/stores/upload';

defineProps<{ type: string }>();
defineEmits(['close']);

const file = ref<File | null>(null);
const store = useUploadStore();
const { progress, uploading, message } = storeToRefs(store);

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
    store.reset();
    await store.uploadFile(file.value);
  }
}
</script>
